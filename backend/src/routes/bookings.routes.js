import { Router } from 'express';
import { body, param, oneOf } from 'express-validator';
import { createBooking, deleteBooking, listBookings } from '../controllers/bookings.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', listBookings);

router.post(
  '/',
  requireAuth,
  [
    oneOf([
      body('vehicleId').isString().notEmpty(),
      body('vehicleName').isString().notEmpty()
    ], 'Provide vehicleId or vehicleName'),
    body('fromPincode').isString().notEmpty(),
    body('toPincode').isString().notEmpty(),
    body('startTime').isISO8601(),
    body('customerId').optional().isString().notEmpty(),
    body('customerName').optional().isString().notEmpty()
  ],
  createBooking
);

router.delete(
  '/:id',
  requireAuth,
  [param('id').isString().notEmpty()],
  deleteBooking
);

export default router;

