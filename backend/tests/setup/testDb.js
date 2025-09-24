import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { connectToDatabase, disconnectDatabase } from '../../src/config/db.js';

let mongoServer;
let usingLocalMongo = false;

export async function setupTestDb() {
  // If USE_LOCAL_MONGO is set, connect to provided MONGODB_URI (e.g., docker mongo)
  usingLocalMongo = String(process.env.USE_LOCAL_MONGO || '').toLowerCase() === 'true';
  if (usingLocalMongo) {
    if (!process.env.MONGODB_URI) {
      process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/fleetlink-test';
    }
  } else {
    try {
      mongoServer = await MongoMemoryServer.create({ binary: { version: '7.0.14' } });
      const uri = mongoServer.getUri('fleetlink-test');
      process.env.MONGODB_URI = uri;
    } catch (err) {
      // Fallback to local Mongo when download fails (no internet / blocked)
      usingLocalMongo = true;
      if (!process.env.MONGODB_URI) {
        process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/fleetlink-test';
      }
    }
  }

  await connectToDatabase();
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connection.asPromise();
  }
  await mongoose.connection.db.admin().ping();
}

export async function teardownTestDb() {
  try {
    await disconnectDatabase();
  } catch (e) {
    // ignore
  }
  if (!usingLocalMongo && mongoServer) {
    await mongoServer.stop();
  }
}

export async function clearDatabase() {
  if (mongoose.connection.readyState !== 1) return;
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
}

