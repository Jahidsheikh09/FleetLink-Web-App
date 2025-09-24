import { useState } from 'react';
import { createVehicle } from '../api/client.js';

export default function AddVehiclePage() {
  const [form, setForm] = useState({ name: '', capacityKg: '', tyres: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const payload = {
        name: form.name.trim(),
        capacityKg: Number(form.capacityKg),
        tyres: Number(form.tyres)
      };
      const created = await createVehicle(payload);
      setMessage({ type: 'success', text: `Vehicle created: ${created.name}` });
      setForm({ name: '', capacityKg: '', tyres: '' });
    } catch (err) {
      const text = err?.response?.data?.message || 'Failed to create vehicle';
      setMessage({ type: 'error', text });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Add Vehicle</h2>
      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4 mb-3">
        <label className="flex flex-col gap-1 text-sm">
          Name
          <input className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Truck A" required />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Capacity (Kg)
          <input className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" name="capacityKg" type="number" value={form.capacityKg} onChange={handleChange} min="0" required />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Tyres
          <input className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" name="tyres" type="number" value={form.tyres} onChange={handleChange} min="2" required />
        </label>
        <div className="sm:col-span-2">
          <button type="submit" disabled={loading} className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-70">
            {loading ? 'Saving...' : 'Add Vehicle'}
          </button>
        </div>
      </form>
      {message && (
        <div className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{message.text}</div>
      )}
    </div>
  );
}

