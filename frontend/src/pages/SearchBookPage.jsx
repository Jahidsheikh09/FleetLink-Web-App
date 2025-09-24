import { useState } from 'react';
import { searchAvailable, createBooking } from '../api/client.js';

export default function SearchBookPage() {
  const [form, setForm] = useState({ capacityRequired: '', fromPincode: '', toPincode: '', startTime: '' });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [duration, setDuration] = useState(null);
  const [message, setMessage] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const params = {
        capacityRequired: Number(form.capacityRequired),
        fromPincode: form.fromPincode.trim(),
        toPincode: form.toPincode.trim(),
        startTime: new Date(form.startTime).toISOString()
      };
      const data = await searchAvailable(params);
      setResults(data.vehicles || []);
      setDuration(data.estimatedRideDurationHours ?? null);
    } catch (err) {
      const text = err?.response?.data?.message || 'Search failed';
      setMessage({ type: 'error', text });
    } finally {
      setLoading(false);
    }
  }

  async function handleBook(vehicleId) {
    setMessage(null);
    try {
      const payload = {
        vehicleId,
        fromPincode: form.fromPincode.trim(),
        toPincode: form.toPincode.trim(),
        startTime: new Date(form.startTime).toISOString(),
        customerId: 'demo-customer-1'
      };
      const booking = await createBooking(payload);
      setMessage({ type: 'success', text: `Booked! ID: ${booking._id}` });
    } catch (err) {
      const text = err?.response?.data?.message || 'Booking failed';
      setMessage({ type: 'error', text });
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Search & Book</h2>
      <form onSubmit={handleSearch} className="grid sm:grid-cols-2 gap-4 mb-3">
        <label className="flex flex-col gap-1 text-sm">
          Capacity Required (Kg)
          <input className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" name="capacityRequired" type="number" value={form.capacityRequired} onChange={handleChange} min="0" required />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          From Pincode
          <input className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" name="fromPincode" value={form.fromPincode} onChange={handleChange} required />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          To Pincode
          <input className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" name="toPincode" value={form.toPincode} onChange={handleChange} required />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Start Time
          <input className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" name="startTime" type="datetime-local" value={form.startTime} onChange={handleChange} required />
        </label>
        <div className="sm:col-span-2">
          <button type="submit" disabled={loading} className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-70">
            {loading ? 'Searching...' : 'Search Availability'}
          </button>
        </div>
      </form>

      {typeof duration === 'number' && (
        <div className="text-sm text-slate-700 mb-2">Estimated ride duration: {duration} hours</div>
      )}

      {message && (
        <div className={`text-sm ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{message.text}</div>
      )}

      <div className="mt-4 grid gap-3">
        {results.map(v => (
          <div className="flex items-center justify-between border border-slate-200 rounded-md p-3 bg-slate-50" key={v._id}>
            <div>
              <div className="font-medium">{v.name}</div>
              <div className="text-xs text-slate-600">Capacity: {v.capacityKg} Kg • Tyres: {v.tyres}</div>
            </div>
            <div>
              <button className="px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700" onClick={() => handleBook(v._id)}>Book Now</button>
            </div>
          </div>
        ))}
        {results.length === 0 && !loading && (
          <div className="text-sm text-slate-600">No results yet. Try searching.</div>
        )}
      </div>
    </div>
  );
}

