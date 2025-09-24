import { validationResult } from 'express-validator';
import { Vehicle } from '../models/Vehicle.js';
import { Booking } from '../models/Booking.js';
import { calculateEstimatedRideDurationHours } from '../utils/rideDuration.js';

export async function createVehicle(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, capacityKg, tyres } = req.body;
    const vehicle = await Vehicle.create({ name, capacityKg, tyres });
    return res.status(201).json(vehicle);
  } catch (err) {
    next(err);
  }
}

export async function listVehicles(req, res, next) {
  try {
    const vehicles = await Vehicle.find({}).sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (err) {
    next(err);
  }
}

export async function getAvailableVehicles(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { capacityRequired, fromPincode, toPincode, startTime } = req.query;
    const parsedStart = new Date(startTime);
    const durationHours = calculateEstimatedRideDurationHours(fromPincode, toPincode);
    const endTime = new Date(parsedStart.getTime() + durationHours * 60 * 60 * 1000);

    const candidateVehicles = await Vehicle.find({ capacityKg: { $gte: Number(capacityRequired) } });
    const candidateIds = candidateVehicles.map(v => v._id);

    if (candidateIds.length === 0) {
      return res.json({ vehicles: [], estimatedRideDurationHours: durationHours });
    }

    const overlappingBookings = await Booking.find({
      vehicleId: { $in: candidateIds },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: parsedStart } }
      ]
    }).select('vehicleId');

    const bookedSet = new Set(overlappingBookings.map(b => String(b.vehicleId)));
    const available = candidateVehicles.filter(v => !bookedSet.has(String(v._id)));

    return res.json({ vehicles: available, estimatedRideDurationHours: durationHours });
  } catch (err) {
    next(err);
  }
}

