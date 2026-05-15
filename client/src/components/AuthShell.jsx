import { CheckCircle2 } from 'lucide-react';

export default function AuthShell({ title, subtitle, children }) {
  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[0.95fr_1.05fr]">
      <section className="hidden bg-ink px-12 py-14 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-xl font-bold">Team Task Manager</p>
          <h1 className="mt-20 max-w-xl text-5xl font-bold leading-tight">
            Organize projects, tasks, and team accountability in one secure workspace.
          </h1>
        </div>
        <div className="grid gap-4 text-sm text-slate-200">
          {['Admin and member permissions', 'Project progress dashboard', 'Overdue task tracking'].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <CheckCircle2 className="text-mint" size={20} />
              {item}
            </div>
          ))}
        </div>
      </section>
      <section className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-ink">{title}</h2>
          <p className="mt-2 text-slate-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </section>
    </main>
  );
}
