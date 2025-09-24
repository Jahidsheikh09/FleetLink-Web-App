import request from 'supertest';
import { app } from '../src/app.js';
import { setupTestDb, teardownTestDb, clearDatabase } from './setup/testDb.js';
import { Booking } from '../src/models/Booking.js';
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

describe('GET /api/vehicles/available', () => {
  it('returns vehicles meeting capacity with no overlaps', async () => {
    const v1 = await Vehicle.create({ name: 'Truck 1', capacityKg: 800, tyres: 6 });
    const v2 = await Vehicle.create({ name: 'Truck 2', capacityKg: 1200, tyres: 8 });

    const res = await request(app)
      .get('/api/vehicles/available')
      .query({ capacityRequired: 700, fromPincode: '110001', toPincode: '110011', startTime: '2023-10-27T10:00:00Z' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('vehicles');
    const ids = res.body.vehicles.map(v => v._id);
    expect(ids).toContain(String(v1._id));
    expect(ids).toContain(String(v2._id));
    expect(typeof res.body.estimatedRideDurationHours).toBe('number');
  });

  it('filters out vehicles with overlapping bookings', async () => {
    const v1 = await Vehicle.create({ name: 'Truck 1', capacityKg: 800, tyres: 6 });
    await Vehicle.create({ name: 'Truck 2', capacityKg: 1200, tyres: 8 });

    // from 110001 to 110011 => duration 10 hours
    const start = new Date('2023-10-27T10:00:00Z');
    const end = new Date(start.getTime() + 10 * 60 * 60 * 1000);
    await Booking.create({
      vehicleId: v1._id,
      fromPincode: '110001',
      toPincode: '110011',
      startTime: start,
      endTime: end,
      customerId: 'cust-1'
    });

    const res = await request(app)
      .get('/api/vehicles/available')
      .query({ capacityRequired: 700, fromPincode: '110001', toPincode: '110011', startTime: '2023-10-27T11:00:00Z' });

    expect(res.status).toBe(200);
    const ids = res.body.vehicles.map(v => v._id);
    expect(ids).not.toContain(String(v1._id));
  });
});

