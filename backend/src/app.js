import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import vehiclesRouter from './routes/vehicles.routes.js';
import bookingsRouter from './routes/bookings.routes.js';
import customersRouter from './routes/customers.routes.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/vehicles', vehiclesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/customers', customersRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };

