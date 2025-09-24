import { useState } from 'react';
import { createBooking } from '../api/client.js';

export default function BookingPage() {
  const [form, setForm] = useState({
    vehicleId: '',
    vehicleName: '',
    fromPincode: '',
    toPincode: '',
    startTime: '',
    customerId: '',
    customerName: ''
  });
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
        fromPincode: form.fromPincode.trim(),
        toPincode: form.toPincode.trim(),
        startTime: new Date(form.startTime).toISOString()
      };

      const vehicleId = form.vehicleId.trim();
      const vehicleName = form.vehicleName.trim();
      if (vehicleId) payload.vehicleId = vehicleId;
      if (!vehicleId && vehicleName) payload.vehicleName = vehicleName;

      const customerId = form.customerId.trim();
      const customerName = form.customerName.trim();
      if (customerId) payload.customerId = customerId;
      if (!customerId && customerName) payload.customerName = customerName;
      const created = await createBooking(payload);
      setMessage({ type: 'success', text: `Booking created. ID: ${created._id}` });
      setForm({ vehicleId: '', vehicleName: '', fromPincode: '', toPincode: '', startTime: '', customerId: '', customerName: '' });
    } catch (err) {
      const text = err?.response?.data?.message || err?.message || 'Failed to create booking';
      setMessage({ type: 'error', text });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Create Booking</h2>
      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4 mb-3">
        <label className="flex flex-col gap-1 text-sm">
          Vehicle ID (optional)
          <input className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" name="vehicleId" value={form.vehicleId} onChange={handleChange} placeholder="Paste a Vehicle _id" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Vehicle Name (optional)
          <input className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" name="vehicleName" value={form.vehicleName} onChange={handleChange} placeholder="e.g. Truck A" />
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
        <label className="flex flex-col gap-1 text-sm">
          Customer ID (optional)
          <input className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" name="customerId" value={form.customerId} onChange={handleChange} placeholder="Existing Customer _id" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Customer Name (optional)
          <input className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" name="customerName" value={form.customerName} onChange={handleChange} placeholder="e.g. Alice" />
        </label>
        <div className="sm:col-span-2">
          <button type="submit" disabled={loading} className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-70">
            {loading ? 'Booking...' : 'Create Booking'}
          </button>
        </div>
      </form>
      {message && (
        <div className={`text-sm ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{message.text}</div>
      )}
      <div className="text-sm text-slate-600 mt-2">Tip: You can get a Vehicle ID by using the Search & Book page.</div>
    </div>
  );
}


