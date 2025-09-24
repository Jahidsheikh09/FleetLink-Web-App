import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { Vehicle } from '../models/Vehicle.js';
import { Booking } from '../models/Booking.js';
import { calculateEstimatedRideDurationHours } from '../utils/rideDuration.js';
import { Customer } from '../models/Customer.js';

export async function createBooking(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { vehicleId, vehicleName, fromPincode, toPincode, startTime, customerId, customerName } = req.body;

    let resolvedVehicleId = vehicleId;
    if (!resolvedVehicleId && vehicleName) {
      const v = await Vehicle.findOne({ name: vehicleName.trim() });
      if (v) resolvedVehicleId = String(v._id);
    }
    if (!resolvedVehicleId || !mongoose.Types.ObjectId.isValid(resolvedVehicleId)) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const vehicle = await Vehicle.findById(resolvedVehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    let resolvedCustomerId = req.user?.id || customerId;
    if (!resolvedCustomerId && customerName) {
      const c = await Customer.findOne({ name: customerName.trim() });
      if (c) resolvedCustomerId = String(c._id);
    }

    const parsedStart = new Date(startTime);
    const durationHours = calculateEstimatedRideDurationHours(fromPincode, toPincode);
    const bookingEndTime = new Date(parsedStart.getTime() + durationHours * 60 * 60 * 1000);

    const conflict = await Booking.findOne({
      vehicleId: resolvedVehicleId,
      $or: [
        { startTime: { $lt: bookingEndTime }, endTime: { $gt: parsedStart } }
      ]
    });
    if (conflict) {
      return res.status(409).json({ message: 'Vehicle already booked for overlapping time' });
    }

    const booking = await Booking.create({
      vehicleId: resolvedVehicleId,
      fromPincode,
      toPincode,
      startTime: parsedStart,
      endTime: bookingEndTime,
      customerId: resolvedCustomerId || 'guest'
    });

    return res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
}

export async function deleteBooking(req, res, next) {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid booking id' });
    }
    const deleted = await Booking.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function listBookings(req, res, next) {
  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 }).populate('vehicleId', 'name capacityKg tyres');
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

