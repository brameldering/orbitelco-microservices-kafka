import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { apiAccessAll } from '@orbitelco/common';
import { getApiAccessArray } from '../utils/getApiAccessArray';

// In test use .env file for environment variables
require('dotenv').config();

// ================== Mock the kafka-wrapper ====================
jest.mock('../kafka-wrapper');

// ================== Mock the ApiAccessArray ===================
jest.mock('../utils/loadApiAccessArray', () => ({
  getApiAccessArray: jest.fn(),
}));
(getApiAccessArray as jest.Mock).mockResolvedValue(apiAccessAll);
// ==============================================================

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();

  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});
