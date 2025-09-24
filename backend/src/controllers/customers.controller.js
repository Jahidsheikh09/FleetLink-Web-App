import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Customer } from '../models/Customer.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function createCustomer(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { name, email, password } = req.body;
    const existing = await Customer.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });
    const passwordHash = await bcrypt.hash(password, 10);
    const customer = await Customer.create({ name, email, passwordHash });
    res.status(201).json({ _id: customer._id, name: customer.name, email: customer.email });
  } catch (err) { next(err); }
}

export async function listCustomers(req, res, next) {
  try {
    const customers = await Customer.find({}).select('-passwordHash').sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) { next(err); }
}

export async function getCustomer(req, res, next) {
  try {
    const c = await Customer.findById(req.params.id).select('-passwordHash');
    if (!c) return res.status(404).json({ message: 'Customer not found' });
    res.json(c);
  } catch (err) { next(err); }
}

export async function updateCustomer(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { name } = req.body;
    const updated = await Customer.findByIdAndUpdate(req.params.id, { name }, { new: true }).select('-passwordHash');
    if (!updated) return res.status(404).json({ message: 'Customer not found' });
    res.json(updated);
  } catch (err) { next(err); }
}

export async function deleteCustomer(req, res, next) {
  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Customer not found' });
    res.status(204).send();
  } catch (err) { next(err); }
}

export async function signup(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { name, email, password } = req.body;
    const exists = await Customer.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });
    const passwordHash = await bcrypt.hash(password, 10);
    const customer = await Customer.create({ name, email, passwordHash });
    const token = jwt.sign({ sub: String(customer._id), email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, customer: { _id: customer._id, name, email } });
  } catch (err) { next(err); }
}

export async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email });
    if (!customer) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, customer.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ sub: String(customer._id), email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, customer: { _id: customer._id, name: customer.name, email: customer.email } });
  } catch (err) { next(err); }
}

