import { useState } from 'react';
import { login } from '../api/client.js';

export default function AuthLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  function handleChange(e) { const { name, value } = e.target; setForm(p => ({ ...p, [name]: value })); }

  async function handleSubmit(e) {
    e.preventDefault(); setLoading(true); setMessage(null);
    try {
      const res = await login(form);
      setMessage({ type: 'success', text: 'Login successful.' });
      localStorage.setItem('token', res.token);
    } catch (err) {
      const text = err?.response?.data?.message || 'Login failed';
      setMessage({ type: 'error', text });
    } finally { setLoading(false); }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Log In</h2>
      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4 mb-3">
        <label className="flex flex-col gap-1 text-sm">Email<input className="border rounded-md px-3 py-2" name="email" type="email" value={form.email} onChange={handleChange} required /></label>
        <label className="flex flex-col gap-1 text-sm">Password<input className="border rounded-md px-3 py-2" name="password" type="password" value={form.password} onChange={handleChange} required /></label>
        <div className="sm:col-span-2"><button className="px-4 py-2 rounded-md bg-indigo-600 text-white" disabled={loading}>{loading ? 'Logging in...' : 'Log In'}</button></div>
      </form>
      {message && <div className={`text-sm ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{message.text}</div>}
    </div>
  );
}


