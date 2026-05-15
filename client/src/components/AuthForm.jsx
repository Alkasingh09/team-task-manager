import { CheckSquare } from 'lucide-react';

export default function AuthForm({ title, subtitle, children, topPadding = 'pt-8' }) {
  return (
    <section className="flex items-start justify-center px-6 py-10 bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <div className={`w-full max-w-[400px] ${topPadding}`}>
        <div className="flex items-center gap-2 mb-10 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/30">
            <CheckSquare size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">TaskFlow</span>
        </div>

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 mb-2">Get Started</p>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h2>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        </div>

        <div className="space-y-4">
          {children}
        </div>

        
      </div>
    </section>
  );
}