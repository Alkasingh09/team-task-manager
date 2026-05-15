import { Lock, Mail, ShieldCheck, User, UserPlus, Users, Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }
    setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <AuthShell title="Create account" subtitle="Start your journey with TaskFlow">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Toast message={error} />

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Full name</label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <User size={18} />
            </div>
            <input
              required
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="field-control pl-11"
              placeholder="John Doe"
            />
          </div>
        </div>
        
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
          <label className="text-sm font-medium text-slate-700">Password</label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              className="field-control pl-11 pr-11"
              placeholder="Minimum 6 characters"
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

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Account type</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'member', label: 'Member', icon: Users, desc: 'Manage tasks' },
              { value: 'admin', label: 'Admin', icon: ShieldCheck, desc: 'Full access' }
            ].map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => setForm({ ...form, role: role.value })}
                className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                  form.role === role.value
                    ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className={`p-2 rounded-lg mb-2 ${
                  form.role === role.value ? 'bg-indigo-100' : 'bg-slate-100'
                }`}>
                  <role.icon size={20} />
                </div>
                <span className="text-sm font-semibold">{role.label}</span>
                <span className="text-xs text-slate-500 mt-0.5">{role.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="terms"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="terms" className="text-sm text-slate-600">
            I agree to the{' '}
            <Link to="/terms" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Privacy Policy
            </Link>
          </label>
        </div>

        <button 
          disabled={loading} 
          className="w-full h-11 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span>Creating account...</span>
          ) : (
            <>
              <UserPlus size={18} />
              <span>Create account</span>
            </>
          )}
        </button>
        
        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthShell>
  );
}