import { Router } from 'express';
import { body, param } from 'express-validator';
import { createCustomer, listCustomers, getCustomer, updateCustomer, deleteCustomer, signup, login } from '../controllers/customers.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', requireAuth, listCustomers);
router.get('/:id', requireAuth, getCustomer);

router.post(
  '/',
  requireAuth,
  [body('name').isString().notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 })],
  createCustomer
);

router.put(
  '/:id',
  requireAuth,
  [param('id').isString().notEmpty(), body('name').isString().notEmpty()],
  updateCustomer
);

router.delete('/:id', requireAuth, [param('id').isString().notEmpty()], deleteCustomer);

router.post(
  '/auth/signup',
  [body('name').isString().notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 })],
  signup
);

router.post(
  '/auth/login',
  [body('email').isEmail(), body('password').isString().notEmpty()],
  login
);

export default router;

