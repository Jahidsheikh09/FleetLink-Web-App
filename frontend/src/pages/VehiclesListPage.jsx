import { useEffect, useState } from 'react';
import { getAllVehicles } from '../api/client.js';

export default function VehiclesListPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllVehicles();
        setVehicles(data);
      } catch (e) {
        setError('Failed to load vehicles');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">All Vehicles</h2>
      {loading && <div className="text-sm text-slate-600">Loading...</div>}
      {error && <div className="text-sm text-red-700">{error}</div>}
      {!loading && !error && (
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left px-3 py-2">Name</th>
                <th className="text-left px-3 py-2">Capacity (Kg)</th>
                <th className="text-left px-3 py-2">Tyres</th>
                <th className="text-left px-3 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map(v => (
                <tr key={v._id} className="border-t">
                  <td className="px-3 py-2">{v.name}</td>
                  <td className="px-3 py-2">{v.capacityKg}</td>
                  <td className="px-3 py-2">{v.tyres}</td>
                  <td className="px-3 py-2">{new Date(v.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {vehicles.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-3 py-4 text-center text-slate-600">No vehicles found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


