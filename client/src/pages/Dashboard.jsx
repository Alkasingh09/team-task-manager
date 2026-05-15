import { useEffect, useState } from 'react';
import { api } from '../api.js';
import EmptyState from '../components/EmptyState.jsx';
import StatCard from '../components/StatCard.jsx';
import Toast from '../components/Toast.jsx';
import { useAuth } from '../context/AuthContext.jsx';

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

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">{user.role}</p>
        <h1 className="mt-1 text-3xl font-bold text-ink">Dashboard</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total tasks" value={dashboard.totalTasks} />
        <StatCard label="Completed" value={dashboard.completedTasks} tone="mint" />
        <StatCard label="Pending" value={dashboard.pendingTasks} tone="amber" />
        <StatCard label="In progress" value={dashboard.inProgressTasks} />
        <StatCard label="Overdue" value={dashboard.overdueTasks} tone="coral" />
      </div>
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-panel">
        <h2 className="text-xl font-bold text-ink">Project Progress</h2>
        <div className="mt-5 space-y-4">
          {dashboard.projectProgress.length === 0 ? (
            <EmptyState title="No projects yet" body="Create or join a project to see progress here." />
          ) : (
            dashboard.projectProgress.map((project) => (
              <div key={project.projectId}>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="font-semibold text-slate-700">{project.title}</span>
                  <span className="text-slate-500">{project.completed}/{project.total} tasks</span>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded bg-slate-100">
                  <div className="h-full rounded bg-mint" style={{ width: `${project.progress}%` }} />
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
