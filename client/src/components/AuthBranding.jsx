import { CheckCircle2, CheckSquare, BarChart3, Users, Calendar, ArrowRight } from 'lucide-react';

const features = [
  { icon: CheckCircle2, text: 'Task management & assignment' },
  { icon: CheckCircle2, text: 'Real-time team collaboration' },
  { icon: CheckCircle2, text: 'Project progress tracking' },
  { icon: CheckCircle2, text: 'Deadline & priority alerts' },
];

const stats = [
  { label: 'Projects', value: '150+', color: 'bg-blue-500/20 text-blue-400' },
  { label: 'Tasks Done', value: '2.4k+', color: 'bg-purple-500/20 text-purple-400' },
  { label: 'Teams', value: '50+', color: 'bg-emerald-500/20 text-emerald-400' },
];

const tasks = [
  { name: 'Dashboard Redesign', status: 'In Progress', priority: 'High', color: 'bg-indigo-400' },
  { name: 'API Integration', status: 'Review', priority: 'Medium', color: 'bg-amber-400' },
  { name: 'User Research', status: 'Completed', priority: 'Low', color: 'bg-emerald-400' },
];

export default function AuthBranding() {
  return (
    <section className="relative hidden lg:flex flex-col justify-center px-14 py-12 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <div className="absolute inset-0" style={{
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 20% 40%, rgba(99, 102, 241, 0.18) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 80% 60%, rgba(139, 92, 246, 0.12) 0%, transparent 50%)
        `
      }} />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-14">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 border border-indigo-500/30 shadow-lg shadow-indigo-500/20">
            <CheckSquare size={24} className="text-indigo-400" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">TaskFlow</span>
        </div>
        
        <div className="max-w-lg">
          <h1 className="text-4xl font-bold leading-tight text-white">
            Ship projects{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">faster</span> with your team
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-400">
            Track progress, assign tasks, and keep everyone aligned — all in one beautiful workspace.
          </p>
        </div>

        <div className="mt-10 max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Activity</p>
            <span className="text-xs text-indigo-400 font-medium">Today</span>
          </div>
          
          <div className="rounded-xl bg-white/95 backdrop-blur shadow-2xl p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Sprint 24</p>
                <p className="mt-0.5 text-sm font-bold text-slate-800">Website Launch</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700">On Track</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2.5 mb-4">
              {stats.map((stat, i) => (
                <div key={i} className={`rounded-lg p-2.5 ${stat.color}`}>
                  <p className="text-base font-bold">{stat.value}</p>
                  <p className="text-[10px] opacity-80">{stat.label}</p>
                </div>
              ))}
            </div>
            
            <div className="space-y-1.5">
              {tasks.map((task, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full ${task.color}`} />
                    <span className="text-xs font-medium text-slate-700">{task.name}</span>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    task.priority === 'High' ? 'bg-red-100 text-red-700' :
                    task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>{task.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 max-w-md">
          {features.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 border border-indigo-500/30">
                <item.icon size={12} className="text-indigo-400" />
              </div>
              <span className="text-sm font-medium text-slate-300">{item.text}</span>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-2">
          <span className="text-sm text-slate-400">Learn more</span>
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20">
            <ArrowRight size={12} className="text-indigo-400" />
          </div>
        </div>
      </div>
    </section>
  );
}