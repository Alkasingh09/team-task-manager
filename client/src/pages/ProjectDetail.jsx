import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api.js';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Toast from '../components/Toast.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const statuses = ['To Do', 'In Progress', 'Completed'];
const priorities = ['Low', 'Medium', 'High'];

export default function ProjectDetail() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'To Do',
    dueDate: '',
    assignedUser: ''
  });

  const loadProject = async () => {
    const { data } = await api.get(`/projects/${id}`);
    setDetail(data);
    setTaskForm((current) => ({
      ...current,
      assignedUser: current.assignedUser || data.project.members?.[0]?._id || ''
    }));
  };

  useEffect(() => {
    loadProject().catch((err) => setError(err.response?.data?.message || 'Could not load project'));
  }, [id]);

  const submitTask = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await api.post('/tasks', { ...taskForm, project: id });
      setTaskForm({ title: '', description: '', priority: 'Medium', status: 'To Do', dueDate: '', assignedUser: taskForm.assignedUser });
      await loadProject();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create task');
    }
  };

  if (!detail) {
    return <Toast message={error || 'Loading project...'} tone={error ? 'error' : 'success'} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">{detail.project.title}</h1>
        <p className="mt-2 max-w-3xl text-slate-500">{detail.project.description}</p>
      </div>
      <Toast message={error} />
      {isAdmin && (
        <form onSubmit={submitTask} className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-panel lg:grid-cols-3">
          <label>
            <span className="text-sm font-semibold text-slate-700">Task title</span>
            <input required value={taskForm.title} onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })} className="mt-1 h-11 w-full rounded-md border border-slate-200 bg-field px-3 outline-none focus:border-brand" />
          </label>
          <label>
            <span className="text-sm font-semibold text-slate-700">Assigned user</span>
            <select required value={taskForm.assignedUser} onChange={(event) => setTaskForm({ ...taskForm, assignedUser: event.target.value })} className="mt-1 h-11 w-full rounded-md border border-slate-200 bg-field px-3 outline-none focus:border-brand">
              {detail.project.members.map((member) => (
                <option key={member._id} value={member._id}>{member.name}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-sm font-semibold text-slate-700">Due date</span>
            <input type="date" required value={taskForm.dueDate} onChange={(event) => setTaskForm({ ...taskForm, dueDate: event.target.value })} className="mt-1 h-11 w-full rounded-md border border-slate-200 bg-field px-3 outline-none focus:border-brand" />
          </label>
          <label>
            <span className="text-sm font-semibold text-slate-700">Priority</span>
            <select value={taskForm.priority} onChange={(event) => setTaskForm({ ...taskForm, priority: event.target.value })} className="mt-1 h-11 w-full rounded-md border border-slate-200 bg-field px-3 outline-none focus:border-brand">
              {priorities.map((priority) => <option key={priority}>{priority}</option>)}
            </select>
          </label>
          <label>
            <span className="text-sm font-semibold text-slate-700">Status</span>
            <select value={taskForm.status} onChange={(event) => setTaskForm({ ...taskForm, status: event.target.value })} className="mt-1 h-11 w-full rounded-md border border-slate-200 bg-field px-3 outline-none focus:border-brand">
              {statuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <label>
            <span className="text-sm font-semibold text-slate-700">Description</span>
            <input required value={taskForm.description} onChange={(event) => setTaskForm({ ...taskForm, description: event.target.value })} className="mt-1 h-11 w-full rounded-md border border-slate-200 bg-field px-3 outline-none focus:border-brand" />
          </label>
          <button className="h-11 rounded-md bg-brand font-semibold text-white lg:col-span-3">Create task</button>
        </form>
      )}
      <div className="grid gap-4 lg:grid-cols-3">
        {statuses.map((status) => (
          <section key={status} className="status-column rounded-md border border-slate-200 bg-white p-4 shadow-panel">
            <h2 className="font-bold text-ink">{status}</h2>
            <div className="mt-4 space-y-3">
              {detail.tasks.filter((task) => task.status === status).length === 0 ? (
                <EmptyState title="No tasks" body="Tasks in this status will appear here." />
              ) : (
                detail.tasks.filter((task) => task.status === status).map((task) => (
                  <article key={task._id} className="rounded-md border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-ink">{task.title}</h3>
                      <Badge tone={task.priority}>{task.priority}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">{task.description}</p>
                    <p className="mt-3 text-sm text-slate-600">Assigned to {task.assignedUser?.name}</p>
                    <p className="text-sm text-slate-500">Due {new Date(task.dueDate).toLocaleDateString()}</p>
                  </article>
                ))
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
