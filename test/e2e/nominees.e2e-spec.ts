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

    // Insert test data
    await nomineeModel.insertMany([
      {
        title: 'Avatar',
        description: 'Sci-fi movie',
        release: 2009,
        director: 'James Cameron',
        winner: false,
      },
      {
        title: 'Dune: Part Two',
        description: 'Epic sci-fi',
        release: 2024,
        director: 'Denis Villeneuve',
        winner: true,
      },
      {
        title: 'Interstellar',
        description: 'Space exploration',
        release: 2014,
        director: 'Christopher Nolan',
        winner: true,
      },
    ]);
  });

  afterAll(async () => {
    await nomineeModel.deleteMany({});
    await app.close();
    await mongod.stop();
  });

  let createdNomineeId: string;

  // Test POST /nominees
  it('should create a nominee', async () => {
    const response = await request(server)
      .post('/nominees')
      .send({
        title: 'Inception',
        description: 'A mind-bending thriller about dreams within dreams.',
        release: 2010,
        director: 'Christopher Nolan',
        winner: true,
      })
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.title).toBe('Inception');
    createdNomineeId = response.body._id; // Store ID for later tests
  });

  // Test GET /nominees/{id}
  it('should get a nominee by ID', async () => {
    const response = await request(server)
      .get(`/nominees/${createdNomineeId}`)
      .expect(200);

    expect(response.body).toHaveProperty('_id', createdNomineeId);
    expect(response.body.title).toBe('Inception');
  });

  // Test PUT /nominees/{id}
  it('should update a nominee', async () => {
    const updatedData = {
      title: 'Inception (Updated)',
      release: 2025,
    };

    const response = await request(server)
      .put(`/nominees/${createdNomineeId}`)
      .send(updatedData)
      .expect(200);

    expect(response.body._id).toBe(createdNomineeId);
    expect(response.body.title).toBe('Inception (Updated)');
    expect(response.body.release).toBe(2025);
  });

  // Test GET /nominees
  it('should get a list of nominees with pagination', async () => {
    const response = await request(server)
      .get('/nominees?sortBy=title&sortOrder=asc&page=1&limit=10&title=Dune')
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBeTruthy();
    expect(response.body.total).toBeGreaterThan(0);
  });

  // Test Sorting by Title (Ascending)
  it('should return nominees sorted by title in ascending order', async () => {
    const response = await request(server)
      .get('/nominees?sortBy=title&sortOrder=asc')
      .expect(200);

    expect(response.body.data.length).toBeGreaterThan(0);
    const titles = response.body.data.map((nominee: Nominee) => nominee.title);
    expect(titles).toEqual([
      'Avatar',
      'Dune: Part Two',
      'Inception (Updated)',
      'Interstellar',
    ]);
  });

  // Test Sorting by Title (Descending)
  it('should return nominees sorted by title in descending order', async () => {
    const response = await request(server)
      .get('/nominees?sortBy=title&sortOrder=desc')
      .expect(200);

    expect(response.body.data.length).toBeGreaterThan(0);
    const titles = response.body.data.map((nominee: Nominee) => nominee.title);
    expect(titles).toEqual([
      'Interstellar',
      'Inception (Updated)',
      'Dune: Part Two',
      'Avatar',
    ]);
  });

  // Test Pagination (Limit & Page)
  it('should return paginated nominees (limit=2, page=1)', async () => {
    const response = await request(server)
      .get('/nominees?sortBy=title&sortOrder=asc&page=1&limit=2')
      .expect(200);

    expect(response.body.data.length).toBe(2); // ✅ Only 2 results on first page
    expect(Number(response.body.total)).toBe(4); // ✅ Total number of nominees
    expect(Number(response.body.currentPage)).toBe(1);
    expect(Number(response.body.totalPages)).toBe(2); // ✅ 3 nominees, 2 per page → 2 pages
  });

  // Test Pagination (Page 2)
  it('should return second page of paginated nominees', async () => {
    const response = await request(server)
      .get('/nominees?sortBy=title&sortOrder=asc&page=2&limit=2')
      .expect(200);

    expect(response.body.data.length).toBe(2); // ✅ Only 1 nominee left on page 2
    expect(Number(response.body.currentPage)).toBe(2);
    expect(Number(response.body.totalPages)).toBe(2);
  });
});
