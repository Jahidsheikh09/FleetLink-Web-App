import { Route, Routes, Navigate } from "react-router-dom";
import AddVehiclePage from "./pages/AddVehiclePage.jsx";
import SearchBookPage from "./pages/SearchBookPage.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import VehiclesListPage from "./pages/VehiclesListPage.jsx";
import BookingsListPage from "./pages/BookingsListPage.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import AuthSignupPage from "./pages/AuthSignupPage.jsx";
import AuthLoginPage from "./pages/AuthLoginPage.jsx";

function isAuthed() {
  return Boolean(localStorage.getItem('token'));
}

function Protected({ children }) {
  if (!isAuthed()) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <div className="flex items-center justify-center text-center ">
        <h1 className="text-indigo-500 font-bold text-1xl md:text-2xl lg:text-3xl leading-snug animate-fadeIn mt-5">
          FleetLink – Smart Logistics Vehicle Booking for Businesses.
          <br />
          <span className="text-black block font-normal text-lg md:text-xl mt-3 opacity-90">
            Manage your fleet, check availability in real time, and book vehicles with
            ease.
          </span>
        </h1>
      </div>
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<SearchBookPage />} />
            <Route path="/add-vehicle" element={<Protected><AddVehiclePage /></Protected>} />
            <Route path="/book" element={<Protected><BookingPage /></Protected>} />
            <Route path="/vehicles" element={<VehiclesListPage />} />
            <Route path="/bookings" element={<Protected><BookingsListPage /></Protected>} />
            <Route path="/signup" element={<AuthSignupPage />} />
            <Route path="/login" element={<AuthLoginPage />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
}
