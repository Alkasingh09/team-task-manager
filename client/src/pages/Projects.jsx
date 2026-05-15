import { Plus, Trash2, Users, FolderOpen, X, Building2, ArrowRight } from 'lucide-react';
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
  const [showForm, setShowForm] = useState(false);

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
      setShowForm(false);
      await loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create project');
    }
  };

  const deleteProject = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter((project) => project._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete project');
    }
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
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="page-eyebrow">Workspaces</p>
          <h1 className="page-title">Projects</h1>
          <p className="page-copy">Manage your team&apos;s projects and collaborate with members.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="h-10 px-4 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Plus size={17} />
            <span>New Project</span>
          </button>
        )}
      </div>
      <Toast message={error} />
      
      {isAdmin && showForm && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
          <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Create New Project</h2>
              <p className="text-sm text-slate-500">Add a new project and assign team members</p>
            </div>
            <button 
              onClick={() => setShowForm(false)} 
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <form onSubmit={submitProject} className="p-6">
            <div className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="block">
                    <span className="label-text">Project Name</span>
                    <input
                      required
                      value={form.title}
                      onChange={(event) => setForm({ ...form, title: event.target.value })}
                      className="field-control mt-1.5"
                      placeholder="Enter project name"
                    />
                  </label>
                </div>
                <div>
                  <label className="block">
                    <span className="label-text">Description</span>
                    <input
                      required
                      value={form.description}
                      onChange={(event) => setForm({ ...form, description: event.target.value })}
                      className="field-control mt-1.5"
                      placeholder="Brief description"
                    />
                  </label>
                </div>
              </div>
              <div>
                <span className="label-text block mb-3">Team Members</span>
                <div className="flex flex-wrap gap-2">
                  {users.map((user) => (
                    <button
                      type="button"
                      key={user._id}
                      onClick={() => toggleMember(user._id)}
                      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border-2 transition-all duration-150 ${
                        form.members.includes(user._id)
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      {user.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)} 
                  className="h-10 px-4 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="h-10 px-4 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-md"
                >
                  <Plus size={17} />
                  <span>Create Project</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      
      {projects.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
          <div className="h-16 w-16 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center mb-4">
            <FolderOpen size={28} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No projects found</h3>
          <p className="text-slate-500 mt-1">Admins can create projects to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <article 
              key={project._id} 
              className="group bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all duration-200 animate-slide-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center">
                    <Building2 size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <Link 
                      to={`/projects/${project._id}`} 
                      className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                    >
                      {project.title}
                    </Link>
                    <p className="text-xs text-slate-500">Project</p>
                  </div>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => deleteProject(project._id)}
                    className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={17} />
                  </button>
                )}
              </div>
              
              <p className="text-sm text-slate-500 line-clamp-2 mb-4">{project.description}</p>
              
              <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                  {project.owner?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-slate-500">Owned by {project.owner?.name}</span>
              </div>
              
              {project.members?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {project.members.slice(0, 4).map((member) => (
                    <span 
                      key={member._id} 
                      className="flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
                    >
                      <div className="h-5 w-5 rounded-full bg-slate-200 text-[10px] flex items-center justify-center">
                        {member.name?.charAt(0)}
                      </div>
                      {member.name}
                    </span>
                  ))}
                  {project.members.length > 4 && (
                    <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
                      +{project.members.length - 4}
                    </span>
                  )}
                </div>
              )}
              
              <Link 
                to={`/projects/${project._id}`}
                className="flex items-center justify-center gap-1 mt-4 h-9 rounded-lg text-sm font-medium text-indigo-600 hover:bg-brand/5 transition-colors"
              >
                <span>View Project</span>
                <ArrowRight size={14} />
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}