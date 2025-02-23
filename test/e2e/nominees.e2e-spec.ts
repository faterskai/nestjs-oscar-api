import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Nominee,
  NomineeSchema,
} from '../../src/modules/nominees/schemas/nominee.schema';

describe('Nominees E2E', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let nomineeModel: Model<Nominee>;
  let server: any;

  beforeAll(async () => {
    // Set up an in-memory MongoDB instance
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([{ name: 'Nominee', schema: NomineeSchema }]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    server = app.getHttpServer();
    nomineeModel = moduleFixture.get<Model<Nominee>>(getModelToken('Nominee'));
  });

  afterAll(async () => {
    await nomineeModel.deleteMany({});
    await app.close();
    await mongod.stop();
  });

  let createdNomineeId: string;

  // 1️⃣ Test POST /nominees
  it('should create a nominee', async () => {
    const response = await request(server)
      .post('/nominees')
      .send({
        title: 'Dune: Part Two',
        description:
          'A 2021-es Dűne folytatása Frank Herbert 1965-ös regényének adaptációjának második része.',
        release: 2024,
        director: 'Denis Villeneuve',
        winner: true,
      })
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.title).toBe('Dune: Part Two');
    createdNomineeId = response.body._id; // Store ID for later tests
  });

  // 2️⃣ Test GET /nominees
  it('should get a list of nominees with pagination', async () => {
    const response = await request(server)
      .get('/nominees?sortBy=title&sortOrder=asc&page=1&limit=10&title=Dune')
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBeTruthy();
    expect(response.body.total).toBeGreaterThan(0);
  });

  // 3️⃣ Test GET /nominees/{id}
  it('should get a nominee by ID', async () => {
    const response = await request(server)
      .get(`/nominees/${createdNomineeId}`)
      .expect(200);

    expect(response.body).toHaveProperty('_id', createdNomineeId);
    expect(response.body.title).toBe('Dune: Part Two');
  });

  // 4️⃣ Test PUT /nominees/{id}
  it('should update a nominee', async () => {
    const updatedData = {
      title: 'Dune: Part Two (Updated)',
      release: 2025,
    };

    const response = await request(server)
      .put(`/nominees/${createdNomineeId}`)
      .send(updatedData)
      .expect(200);

    expect(response.body._id).toBe(createdNomineeId);
    expect(response.body.title).toBe('Dune: Part Two (Updated)');
    expect(response.body.release).toBe(2025);
  });
});
