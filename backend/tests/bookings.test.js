import request from 'supertest';
import { app } from '../src/app.js';
import { setupTestDb, teardownTestDb, clearDatabase } from './setup/testDb.js';
import { Vehicle } from '../src/models/Vehicle.js';

beforeAll(async () => {
  await setupTestDb();
}, 600000);

afterAll(async () => {
  await teardownTestDb();
}, 600000);

afterEach(async () => {
  await clearDatabase();
});

describe('POST /api/bookings', () => {
  it('creates booking when available', async () => {
    const vehicle = await Vehicle.create({ name: 'Truck', capacityKg: 1000, tyres: 6 });
    const payload = {
      vehicleId: String(vehicle._id),
      fromPincode: '560001',
      toPincode: '560011',
      startTime: '2023-10-27T10:00:00Z',
      customerId: 'cust-123'
    };
    const res = await request(app).post('/api/bookings').send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('prevents booking when overlapping', async () => {
    const vehicle = await Vehicle.create({ name: 'Truck', capacityKg: 1000, tyres: 6 });
    const startTime = '2023-10-27T10:00:00Z';

    const first = await request(app).post('/api/bookings').send({
      vehicleId: String(vehicle._id),
      fromPincode: '560001',
      toPincode: '560011',
      startTime,
      customerId: 'cust-1'
    });
    expect(first.status).toBe(201);

    const conflict = await request(app).post('/api/bookings').send({
      vehicleId: String(vehicle._id),
      fromPincode: '560001',
      toPincode: '560011',
      startTime: '2023-10-27T12:00:00Z',
      customerId: 'cust-2'
    });
    expect(conflict.status).toBe(409);
  });

  it('returns 404 for invalid vehicleId', async () => {
    const res = await request(app).post('/api/bookings').send({
      vehicleId: '64f000000000000000000000',
      fromPincode: '560001',
      toPincode: '560011',
      startTime: '2023-10-27T10:00:00Z',
      customerId: 'cust-123'
    });
    expect(res.status).toBe(404);
  });
});

