import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../api.js';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Toast from '../components/Toast.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const statuses = ['', 'To Do', 'In Progress', 'Completed'];
const priorities = ['', 'Low', 'Medium', 'High'];

export default function Tasks() {
  const { user, isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [error, setError] = useState('');

  const loadTasks = async () => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
    const { data } = await api.get('/tasks', { params });
    setTasks(data.data);
    setPagination(data.pagination);
  };

  useEffect(() => {
    loadTasks().catch((err) => setError(err.response?.data?.message || 'Could not load tasks'));
  }, []);

  const applyFilters = (event) => {
    event.preventDefault();
    loadTasks().catch((err) => setError(err.response?.data?.message || 'Could not load tasks'));
  };

  const updateStatus = async (task, status) => {
    setError('');
    try {
      const { data } = await api.put(`/tasks/${task._id}`, isAdmin ? { status } : { status });
      setTasks((current) => current.map((item) => (item._id === task._id ? data : item)));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update task');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Tasks</h1>
        <p className="mt-1 text-slate-500">
          {isAdmin ? 'View and update every task across the team.' : 'View assigned work and update your task status.'}
        </p>
      </div>
      <Toast message={error} />
      <form onSubmit={applyFilters} className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-panel sm:flex-row">
        <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} className="h-11 rounded-md border border-slate-200 bg-field px-3 outline-none focus:border-brand">
          {statuses.map((status) => <option key={status} value={status}>{status || 'All statuses'}</option>)}
        </select>
        <select value={filters.priority} onChange={(event) => setFilters({ ...filters, priority: event.target.value })} className="h-11 rounded-md border border-slate-200 bg-field px-3 outline-none focus:border-brand">
          {priorities.map((priority) => <option key={priority} value={priority}>{priority || 'All priorities'}</option>)}
        </select>
        <button className="flex h-11 items-center justify-center gap-2 rounded-md bg-ink px-5 font-semibold text-white">
          <Search size={18} />
          Filter
        </button>
      </form>
      {tasks.length === 0 ? (
        <EmptyState title="No tasks found" body="Try a different filter or ask an admin to assign work." />
      ) : (
        <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-panel">
          <div className="hidden grid-cols-[1.4fr_1fr_0.75fr_0.8fr_1fr] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold uppercase text-slate-500 md:grid">
            <span>Task</span>
            <span>Project</span>
            <span>Priority</span>
            <span>Due</span>
            <span>Status</span>
          </div>
          {tasks.map((task) => {
            const canUpdate = isAdmin || task.assignedUser?._id === user._id;
            const overdue = task.status !== 'Completed' && new Date(task.dueDate) < new Date();

            return (
              <article key={task._id} className="grid gap-3 border-b border-slate-100 px-4 py-4 last:border-b-0 md:grid-cols-[1.4fr_1fr_0.75fr_0.8fr_1fr] md:items-center">
                <div>
                  <h2 className="font-semibold text-ink">{task.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{task.description}</p>
                  <p className="mt-2 text-xs text-slate-500">Assigned to {task.assignedUser?.name}</p>
                </div>
                <p className="text-sm font-medium text-slate-700">{task.project?.title}</p>
                <Badge tone={task.priority}>{task.priority}</Badge>
                <p className={`text-sm font-semibold ${overdue ? 'text-coral' : 'text-slate-600'}`}>
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>
                {canUpdate ? (
                  <select value={task.status} onChange={(event) => updateStatus(task, event.target.value)} className="h-10 rounded-md border border-slate-200 bg-field px-3 text-sm outline-none focus:border-brand">
                    {statuses.filter(Boolean).map((status) => <option key={status}>{status}</option>)}
                  </select>
                ) : (
                  <Badge tone={task.status}>{task.status}</Badge>
                )}
              </article>
            );
          })}
        </div>
      )}
      {pagination && (
        <p className="text-sm text-slate-500">
          Showing {tasks.length} of {pagination.total} tasks
        </p>
      )}
    </div>
  );
}
