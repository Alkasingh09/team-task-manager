import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import EmptyState from '../components/EmptyState.jsx';
import Toast from '../components/Toast.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const initialProject = { title: '', description: '', members: [] };

export default function Projects() {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialProject);
  const [error, setError] = useState('');

  const loadProjects = async () => {
    const { data } = await api.get('/projects');
    setProjects(data);
  };

  useEffect(() => {
    loadProjects().catch((err) => setError(err.response?.data?.message || 'Could not load projects'));
    if (isAdmin) {
      api.get('/projects/users').then(({ data }) => setUsers(data)).catch(() => {});
    }
  }, [isAdmin]);

  const submitProject = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await api.post('/projects', form);
      setForm(initialProject);
      await loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create project');
    }
  };

  const deleteProject = async (id) => {
    await api.delete(`/projects/${id}`);
    setProjects(projects.filter((project) => project._id !== id));
  };

  const toggleMember = (id) => {
    setForm((current) => ({
      ...current,
      members: current.members.includes(id)
        ? current.members.filter((memberId) => memberId !== id)
        : [...current.members, id]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold text-ink">Projects</h1>
          <p className="mt-1 text-slate-500">Manage workspaces, members, and project ownership.</p>
        </div>
      </div>
      <Toast message={error} />
      {isAdmin && (
        <form onSubmit={submitProject} className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-panel lg:grid-cols-[1fr_1fr_auto]">
          <label>
            <span className="text-sm font-semibold text-slate-700">Title</span>
            <input
              required
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              className="mt-1 h-11 w-full rounded-md border border-slate-200 bg-field px-3 outline-none focus:border-brand"
            />
          </label>
          <label>
            <span className="text-sm font-semibold text-slate-700">Description</span>
            <input
              required
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              className="mt-1 h-11 w-full rounded-md border border-slate-200 bg-field px-3 outline-none focus:border-brand"
            />
          </label>
          <button className="mt-6 flex h-11 items-center justify-center gap-2 rounded-md bg-brand px-5 font-semibold text-white">
            <Plus size={18} />
            Create
          </button>
          <div className="lg:col-span-3">
            <p className="mb-2 text-sm font-semibold text-slate-700">Team members</p>
            <div className="flex flex-wrap gap-2">
              {users.map((user) => (
                <button
                  type="button"
                  key={user._id}
                  onClick={() => toggleMember(user._id)}
                  className={`rounded border px-3 py-2 text-sm ${
                    form.members.includes(user._id)
                      ? 'border-brand bg-blue-50 text-brand'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  {user.name}
                </button>
              ))}
            </div>
          </div>
        </form>
      )}
      {projects.length === 0 ? (
        <EmptyState title="No projects found" body="Admins can create projects and add team members." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article key={project._id} className="rounded-md border border-slate-200 bg-white p-5 shadow-panel">
              <div className="flex items-start justify-between gap-3">
                <Link to={`/projects/${project._id}`} className="text-xl font-bold text-ink hover:text-brand">
                  {project.title}
                </Link>
                {isAdmin && (
                  <button onClick={() => deleteProject(project._id)} className="rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-coral">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <p className="mt-2 line-clamp-3 text-sm text-slate-500">{project.description}</p>
              <p className="mt-4 text-xs font-semibold uppercase text-slate-400">Owner</p>
              <p className="text-sm text-slate-700">{project.owner?.name}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.members?.slice(0, 5).map((member) => (
                  <span key={member._id} className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                    {member.name}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
