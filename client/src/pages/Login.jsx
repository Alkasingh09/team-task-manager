import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell.jsx';
import Toast from '../components/Toast.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to manage projects and deadlines.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Toast message={error} />
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
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            className="mt-1 h-11 w-full rounded-md border border-slate-200 bg-field px-3 outline-none focus:border-brand"
          />
        </label>
        <button disabled={loading} className="h-11 w-full rounded-md bg-brand font-semibold text-white disabled:opacity-60">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <p className="mt-6 text-sm text-slate-500">
        New here? <Link className="font-semibold text-brand" to="/signup">Create an account</Link>
      </p>
    </AuthShell>
  );
}
