import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    capacityKg: { type: Number, required: true, min: 0 },
    tyres: { type: Number, required: true, min: 2 }
  },
  { timestamps: true }
);

export const Vehicle = mongoose.model('Vehicle', vehicleSchema);

