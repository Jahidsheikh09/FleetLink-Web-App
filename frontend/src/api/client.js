import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

// Attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function createVehicle(data) {
  const res = await api.post('/vehicles', data);
  return res.data;
}

export async function searchAvailable(params) {
  const res = await api.get('/vehicles/available', { params });
  return res.data;
}

export async function createBooking(data) {
  const res = await api.post('/bookings', data);
  return res.data;
}

export async function cancelBooking(id) {
  await api.delete(`/bookings/${id}`);
}

export async function getAllVehicles() {
  const res = await api.get('/vehicles');
  return res.data;
}

export async function getAllBookings() {
  const res = await api.get('/bookings');
  return res.data;
}

// Customers & Auth
export async function signup(data) {
  const res = await api.post('/customers/auth/signup', data);
  return res.data;
}

export async function login(data) {
  const res = await api.post('/customers/auth/login', data);
  return res.data;
}

export async function createCustomer(data) {
  const res = await api.post('/customers', data);
  return res.data;
}

export async function listCustomers() {
  const res = await api.get('/customers');
  return res.data;
}

