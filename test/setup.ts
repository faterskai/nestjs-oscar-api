import { MongoMemoryServer } from 'mongodb-memory-server';
import { Mongoose } from 'mongoose';

let mongod: MongoMemoryServer;
let mongoose: Mongoose;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();
});

afterAll(async () => {
  if (mongod) await mongod.stop();
});
