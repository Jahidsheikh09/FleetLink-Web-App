import { NavLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  function logout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <header className="sticky top-0 z-20 bg-indigo-600 text-white backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">
          <span className="text-white">FleetLink</span> - Logistics Vehicle Booking System
        </h1>
        <nav className="flex items-center gap-4 text-sm">
          <NavLink className={({isActive}) => `px-3 py-1.5 rounded-md transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-100'}`} to="/" end>Search & Book</NavLink>
          <NavLink className={({isActive}) => `px-3 py-1.5 rounded-md transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-100'}`} to="/add-vehicle">Add Vehicle</NavLink>
          <NavLink className={({isActive}) => `px-3 py-1.5 rounded-md transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-100'}`} to="/book">Create Booking</NavLink>
          <NavLink className={({isActive}) => `px-3 py-1.5 rounded-md transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-100'}`} to="/vehicles">All Vehicles</NavLink>
          <NavLink className={({isActive}) => `px-3 py-1.5 rounded-md transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-100'}`} to="/bookings">All Bookings</NavLink>
          {!token ? (
            <>
              <NavLink className={({isActive}) => `px-3 py-1.5 rounded-md transition-colors ${isActive ? 'bg-green-50 text-green-700' : 'hover:bg-slate-100'}`} to="/signup">Sign Up</NavLink>
              <NavLink className={({isActive}) => `px-3 py-1.5 rounded-md transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-100'}`} to="/login">Log In</NavLink>
            </>
          ) : (
            <button onClick={logout} className="px-3 py-1.5 rounded-md bg-red-50 text-red-700 hover:bg-red-100">Log Out</button>
          )}
        </nav>
      </div>
    </header>
  );
}


