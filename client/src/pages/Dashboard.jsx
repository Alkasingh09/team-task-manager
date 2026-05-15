import { CheckCircle2, Clock, Layers, ListTodo, AlertCircle, TrendingUp, FolderKanban, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../api.js';
import EmptyState from '../components/EmptyState.jsx';
import Toast from '../components/Toast.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const statCards = [
  { label: 'Total Tasks', key: 'totalTasks', icon: ListTodo, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
  { label: 'Completed', key: 'completedTasks', icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
  { label: 'In Progress', key: 'inProgressTasks', icon: Clock, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
  { label: 'Pending', key: 'pendingTasks', icon: Layers, color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
  { label: 'Overdue', key: 'overdueTasks', icon: AlertCircle, color: 'bg-red-50 text-red-600', border: 'border-red-100' }
];

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/dashboard')
      .then(({ data }) => setDashboard(data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load dashboard'));
  }, []);

  if (!dashboard) {
    return <Toast message={error || 'Loading dashboard...'} tone={error ? 'error' : 'success'} />;
  }

  const completionRate = dashboard.totalTasks > 0 
    ? Math.round((dashboard.completedTasks / dashboard.totalTasks) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-slate-500">Good {getTimeOfDay()} 👋</p>
          <h1 className="text-3xl font-bold text-slate-900 mt-1">Welcome back, {user.name?.split(' ')[0]}!</h1>
          <p className="text-slate-500 mt-1">Here&apos;s what&apos;s happening with your projects today.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2.5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="text-right">
            <p className="text-xs text-slate-500">Completion rate</p>
            <p className="text-xl font-bold text-emerald-600">{completionRate}%</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
            <TrendingUp size={20} className="text-emerald-600" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat, i) => {
          const value = dashboard[stat.key] || 0;
          return (
            <div 
              key={stat.key} 
              className={`relative bg-white rounded-xl border ${stat.border} p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
                </div>
                <div className={`h-11 w-11 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Project Progress</h2>
              <p className="text-sm text-slate-500">{dashboard.projectProgress.length} active projects</p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-indigo-100 flex items-center justify-center">
              <FolderKanban size={18} className="text-indigo-600" />
            </div>
          </div>
          
          <div className="space-y-4">
            {dashboard.projectProgress.length === 0 ? (
              <div className="py-8 text-center">
                <div className="h-12 w-12 rounded-xl bg-slate-100 mx-auto flex items-center justify-center mb-3">
                  <FolderKanban size={24} className="text-slate-400" />
                </div>
                <p className="text-sm text-slate-500">No projects yet</p>
              </div>
            ) : (
              dashboard.projectProgress.map((project, i) => (
                <div 
                  key={project.projectId} 
                  className="p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-900">{project.title}</span>
                    <span className={`text-sm font-bold ${
                      project.progress === 100 ? 'text-emerald-600' :
                      project.progress >= 50 ? 'text-slate-700' : 'text-amber-600'
                    }`}>{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        project.progress === 100 ? 'bg-emerald-500' :
                        project.progress >= 50 ? 'bg-indigo-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">{project.completed} of {project.total} tasks</p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Quick Stats</h2>
              <p className="text-sm text-slate-500">Your team at a glance</p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-purple-50 flex items-center justify-center">
              <User size={18} className="text-purple-600" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100">
              <p className="text-xs font-semibold text-blue-600 uppercase">Your Tasks</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{dashboard.inProgressTasks}</p>
              <p className="text-xs text-blue-600/70 mt-1">In progress</p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-100">
              <p className="text-xs font-semibold text-emerald-600 uppercase">Completed</p>
              <p className="text-2xl font-bold text-emerald-900 mt-1">{dashboard.completedTasks}</p>
              <p className="text-xs text-emerald-600/70 mt-1">This month</p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-100">
              <p className="text-xs font-semibold text-amber-600 uppercase">Pending</p>
              <p className="text-2xl font-bold text-amber-900 mt-1">{dashboard.pendingTasks}</p>
              <p className="text-xs text-amber-600/70 mt-1">Waiting</p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-red-50 to-red-100/50 border border-red-100">
              <p className="text-xs font-semibold text-red-600 uppercase">Overdue</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{dashboard.overdueTasks}</p>
              <p className="text-xs text-red-600/70 mt-1">Action needed</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}