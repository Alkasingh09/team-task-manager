import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell.jsx';
import Toast from '../components/Toast.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Choose a role and start collaborating.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Toast message={error} />
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Name</span>
          <input
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className="mt-1 h-11 w-full rounded-md border border-slate-200 bg-field px-3 outline-none focus:border-brand"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Email</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className="mt-1 h-11 w-full rounded-md border border-slate-200 bg-field px-3 outline-none focus:border-brand"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Password</span>
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            className="mt-1 h-11 w-full rounded-md border border-slate-200 bg-field px-3 outline-none focus:border-brand"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Role</span>
          <select
            value={form.role}
            onChange={(event) => setForm({ ...form, role: event.target.value })}
            className="mt-1 h-11 w-full rounded-md border border-slate-200 bg-field px-3 outline-none focus:border-brand"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <button disabled={loading} className="h-11 w-full rounded-md bg-brand font-semibold text-white disabled:opacity-60">
          {loading ? 'Creating...' : 'Create account'}
        </button>
      </form>
      <p className="mt-6 text-sm text-slate-500">
        Already have an account? <Link className="font-semibold text-brand" to="/login">Sign in</Link>
      </p>
    </AuthShell>
  );
}
