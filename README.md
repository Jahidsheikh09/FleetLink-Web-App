# FleetLink – Logistics Vehicle Booking System

FleetLink is a full‑stack web app for discovering vehicle availability and creating bookings. It includes JWT-based authentication for customers and protects sensitive API routes. The booking duration is a simplified placeholder based on pincodes.

## Features
- Customer signup/login with JWT
- Create vehicles, list vehicles, check availability
- Create and cancel bookings
- Protected routes (frontend and backend)
- Simple, responsive UI with React + Vite + Tailwind

## Tech Stack
- Backend: Node.js, Express, Mongoose, MongoDB, Jest
- Frontend: React, Vite, Tailwind CSS, Axios, React Router
- DevOps: Docker, docker-compose

## Repository Structure
```
FleetLink/
  backend/
  frontend/
  docker-compose.yml
```

## Prerequisites
- Node.js 18+ (tested on Node v20+/v24 as well)
- npm (or yarn/pnpm)
- MongoDB running locally (or a connection string)
- Optional: Docker + docker-compose

---

## 1) Backend
Path: `backend/`

### Environment
Create `backend/.env`:
```env
JWT_SECRET=change-this-to-a-long-random-string
MONGODB_URI=mongodb://localhost:27017/fleetlink
PORT=4000
```
Notes:
- The server uses `dotenv` and will fall back to a default secret if missing, but you should set `JWT_SECRET`.
- If `PORT=4000` is already in use, the server will auto-switch to the next available port and log it.

### Install
```bash
cd backend
npm install
```

### Run (Dev)
```bash
npm run dev
```
or
```bash
npm start
```
The API will start on `http://localhost:4000` (or the next available port). Health check: `GET /api/health`.

### Test
```bash
npm test
```

### Key API Endpoints
- Health: `GET /api/health`
- Auth: `POST /api/customers/auth/signup`, `POST /api/customers/auth/login`
- Customers (protected): `GET /api/customers`, `GET /api/customers/:id`, `POST /api/customers`, `PUT /api/customers/:id`, `DELETE /api/customers/:id`
- Vehicles:
  - Public: `GET /api/vehicles`, `GET /api/vehicles/available`
  - Protected: `POST /api/vehicles`
- Bookings:
  - Public: `GET /api/bookings`
  - Protected: `POST /api/bookings`, `DELETE /api/bookings/:id`

### Authentication
- Send the JWT in the `Authorization` header: `Bearer <token>`
- Sensitive routes require a valid token. Signup/Login return a token.

### Booking Logic (Simplified Placeholder)
- Duration: `estimatedRideDurationHours = Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24`
- End time: `bookingEndTime = startTime + estimatedRideDurationHours hours`
- Conflict prevention: Before insertion, the backend re-checks for overlapping bookings on the target vehicle within `[startTime, bookingEndTime)`.
- Note: This logic is intentionally simplified and does not represent real-world routing/ETA.

---

## 2) Frontend
Path: `frontend/`

### Environment (optional)
Not required for default usage. If you add env vars, they must be prefixed with `VITE_` in `frontend/.env`.

### Install
```bash
cd frontend
npm install
```

### Run (Dev)
```bash
npm run dev
```
The app will be available at the URL Vite prints (typically `http://localhost:5173`). The frontend proxies API requests to `/api`.

### Usage Flow
1. Sign Up or Log In (token stored in `localStorage`).
2. Add a Vehicle (protected) or view Vehicles.
3. Create Booking (protected):
   - Provide either Vehicle ID or Vehicle Name
   - Enter `fromPincode`, `toPincode`
   - Pick `startTime` via the datetime picker (local time)
   - Submit. The frontend converts the time to ISO and sends it with the token.
4. View or cancel bookings (protected).

### Frontend Auth
- Axios attaches `Authorization: Bearer <token>` automatically if a token exists in `localStorage`.
- Protected pages use a simple route guard to redirect unauthenticated users to `/login`.
- Navbar shows Log In/Sign Up when logged out; Logout when logged in.

---

## 3) Running Everything with Docker
Make sure Docker is running, then from the project root:
```bash
docker-compose up --build
```
This builds and starts both services. Adjust environment variables in `docker-compose.yml` as needed.

---

## Troubleshooting
- Address in use (EADDRINUSE):
  - The backend auto-switches to the next port if 4000 is busy and logs the chosen port.
  - Or free port 4000 on Windows PowerShell:
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess | Stop-Process -Force
```
- Unauthorized (401): Log in first; ensure the `Authorization` header is being sent (frontend does this automatically).
- Vehicle not found (404): Use a valid `vehicleId` or a correct `vehicleName`.
- Overlap (409): Choose a `startTime` where the vehicle is not already booked.
- Invalid date: Use the datetime picker; the frontend converts to ISO automatically.

---

## Scripts
Backend:
- `npm start` – start server
- `npm run dev` – start in watch mode
- `npm test` – run tests

Frontend:
- `npm run dev` – start Vite dev server
- `npm run build` – production build
- `npm run preview` – preview production build

---

## Notes
- The booking duration computation is a placeholder and for demonstration/testing only.
- Do not commit secrets. `.gitignore` is configured to ignore `.env` files in both apps.
