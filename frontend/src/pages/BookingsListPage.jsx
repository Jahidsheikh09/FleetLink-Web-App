import { useEffect, useState } from 'react';
import { getAllBookings } from '../api/client.js';

export default function BookingsListPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllBookings();
        setBookings(data);
      } catch (e) {
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">All Bookings</h2>
      {loading && <div className="text-sm text-slate-600">Loading...</div>}
      {error && <div className="text-sm text-red-700">{error}</div>}
      {!loading && !error && (
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left px-3 py-2">Vehicle</th>
                <th className="text-left px-3 py-2">From</th>
                <th className="text-left px-3 py-2">To</th>
                <th className="text-left px-3 py-2">Start</th>
                <th className="text-left px-3 py-2">End</th>
                <th className="text-left px-3 py-2">Customer</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b._id} className="border-t">
                  <td className="px-3 py-2">{b.vehicleId?.name || b.vehicleId}</td>
                  <td className="px-3 py-2">{b.fromPincode}</td>
                  <td className="px-3 py-2">{b.toPincode}</td>
                  <td className="px-3 py-2">{new Date(b.startTime).toLocaleString()}</td>
                  <td className="px-3 py-2">{new Date(b.endTime).toLocaleString()}</td>
                  <td className="px-3 py-2">{b.customerId}</td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-4 text-center text-slate-600">No bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


