import request from 'supertest';
import { app } from '../src/app.js';
import { setupTestDb, teardownTestDb, clearDatabase } from './setup/testDb.js';

beforeAll(async () => {
  await setupTestDb();
}, 600000);

afterAll(async () => {
  await teardownTestDb();
}, 600000);

afterEach(async () => {
  await clearDatabase();
});

describe('POST /api/vehicles', () => {
  it('creates a vehicle with valid payload', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .send({ name: 'Truck A', capacityKg: 1000, tyres: 6 });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe('Truck A');
  });

  it('validates required fields', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .send({ name: '', capacityKg: 'not-a-number', tyres: 1 });
    expect(res.status).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
  });
});

