import { Router } from 'express';
import { body, query } from 'express-validator';
import { createVehicle, getAvailableVehicles, listVehicles } from '../controllers/vehicles.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.post(
  '/',
  requireAuth,
  [
    body('name').isString().trim().notEmpty(),
    body('capacityKg').isNumeric(),
    body('tyres').isInt({ min: 2 })
  ],
  createVehicle
);

router.get('/', listVehicles);

router.get(
  '/available',
  [
    query('capacityRequired').isNumeric(),
    query('fromPincode').isString().notEmpty(),
    query('toPincode').isString().notEmpty(),
    query('startTime').isISO8601()
  ],
  getAvailableVehicles
);

export default router;

