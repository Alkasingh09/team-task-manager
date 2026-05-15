import { Lock, LogIn, Mail, Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);

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
    <AuthShell title="Welcome back" subtitle="Sign in to your account to continue" formPadding="pt-20">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Toast message={error} />
        
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Email</label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Mail size={18} />
            </div>
            <input
              type="email"
              required
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="field-control pl-11"
              placeholder="name@company.com"
            />
          </div>
        </div>
        
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <Link to="/forgot-password" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              className="field-control pl-11 pr-11"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button 
          disabled={loading} 
          className="w-full h-11 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <LogIn size={18} />
              <span>Sign in</span>
            </>
          )}
        </button>
        
        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </form>
    </AuthShell>
  );
}