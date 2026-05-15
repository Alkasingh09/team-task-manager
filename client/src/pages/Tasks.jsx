import { Plus, Search, Filter, Calendar, Flag, User, X, Layers, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../api.js';
import EmptyState from '../components/EmptyState.jsx';
import Toast from '../components/Toast.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const statuses = ['', 'To Do', 'In Progress', 'Completed'];
const priorities = ['', 'Low', 'Medium', 'High'];
const taskStatuses = ['To Do', 'In Progress', 'Completed'];
const taskPriorities = ['Low', 'Medium', 'High'];
const initialTaskForm = {
  title: '',
  description: '',
  priority: 'Medium',
  status: 'To Do',
  dueDate: '',
  project: '',
  assignedUser: ''
};

export default function Tasks() {
  const { user, isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [taskForm, setTaskForm] = useState(initialTaskForm);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const loadTasks = async () => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
    const { data } = await api.get('/tasks', { params });
    setTasks(data.data);
    setPagination(data.pagination);
  };

  useEffect(() => {
    loadTasks().catch((err) => setError(err.response?.data?.message || 'Could not load tasks'));
    if (isAdmin) {
      api
        .get('/projects')
        .then(({ data }) => {
          setProjects(data);
          const firstProject = data[0];
          setTaskForm((current) => ({
            ...current,
            project: current.project || firstProject?._id || '',
            assignedUser: current.assignedUser || firstProject?.members?.[0]?._id || ''
          }));
        })
        .catch(() => {});
    }
  }, [isAdmin]);

  const applyFilters = (event) => {
    event.preventDefault();
    loadTasks().catch((err) => setError(err.response?.data?.message || 'Could not load tasks'));
  };

  const updateStatus = async (task, status) => {
    setError('');
    try {
      const { data } = await api.put(`/tasks/${task._id}`, { status });
      setTasks((current) => current.map((item) => (item._id === task._id ? data : item)));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update task');
    }
  };

  const selectedProject = projects.find((project) => project._id === taskForm.project);

  const updateTaskProject = (projectId) => {
    const project = projects.find((item) => item._id === projectId);
    setTaskForm((current) => ({
      ...current,
      project: projectId,
      assignedUser: project?.members?.[0]?._id || ''
    }));
  };

  const submitTask = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await api.post('/tasks', taskForm);
      setTaskForm((current) => ({
        ...initialTaskForm,
        project: current.project,
        assignedUser: current.assignedUser
      }));
      setShowCreateForm(false);
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create task');
    }
  };

  const clearFilters = () => {
    setFilters({ status: '', priority: '' });
    loadTasks();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-50 text-red-600 border-red-200';
      case 'Medium': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'Low': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'In Progress': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'To Do': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="page-eyebrow">Task Queue</p>
          <h1 className="page-title">Tasks</h1>
          <p className="page-copy">
            {isAdmin ? 'Manage and track all tasks across your team.' : 'View and update your assigned tasks.'}
          </p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)} 
            className="h-10 px-4 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Plus size={17} />
            <span>{showCreateForm ? 'Cancel' : 'Add Task'}</span>
          </button>
        )}
      </div>
      <Toast message={error} />
      
      {isAdmin && showCreateForm && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
          <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Create New Task</h2>
              <p className="text-sm text-slate-500">Add a new task to the queue</p>
            </div>
            <button 
              onClick={() => setShowCreateForm(false)} 
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <form onSubmit={submitTask} className="p-6">
            {projects.length === 0 ? (
              <div className="py-8 text-center">
                <Layers size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-slate-500">Create a project before assigning tasks.</p>
              </div>
            ) : (
              <div className="grid gap-5">
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  <label className="md:col-span-2">
                    <span className="label-text">Task Title</span>
                    <input 
                      required 
                      value={taskForm.title} 
                      onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })} 
                      className="field-control mt-1.5" 
                      placeholder="Enter task title" 
                    />
                  </label>
                  <label>
                    <span className="label-text">Project</span>
                    <select 
                      required 
                      value={taskForm.project} 
                      onChange={(event) => updateTaskProject(event.target.value)} 
                      className="field-control mt-1.5"
                    >
                      {projects.map((project) => (
                        <option key={project._id} value={project._id}>{project.title}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="label-text">Assigned To</span>
                    <select 
                      required 
                      value={taskForm.assignedUser} 
                      onChange={(event) => setTaskForm({ ...taskForm, assignedUser: event.target.value })} 
                      className="field-control mt-1.5"
                    >
                      {selectedProject?.members?.map((member) => (
                        <option key={member._id} value={member._id}>{member.name}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="label-text">Due Date</span>
                    <input 
                      type="date" 
                      required 
                      value={taskForm.dueDate} 
                      onChange={(event) => setTaskForm({ ...taskForm, dueDate: event.target.value })} 
                      className="field-control mt-1.5" 
                    />
                  </label>
                  <label>
                    <span className="label-text">Priority</span>
                    <select 
                      value={taskForm.priority} 
                      onChange={(event) => setTaskForm({ ...taskForm, priority: event.target.value })} 
                      className="field-control mt-1.5"
                    >
                      {taskPriorities.map((priority) => <option key={priority}>{priority}</option>)}
                    </select>
                  </label>
                  <label>
                    <span className="label-text">Status</span>
                    <select 
                      value={taskForm.status} 
                      onChange={(event) => setTaskForm({ ...taskForm, status: event.target.value })} 
                      className="field-control mt-1.5"
                    >
                      {taskStatuses.map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </label>
                  <label className="md:col-span-2 lg:col-span-3">
                    <span className="label-text">Description</span>
                    <input 
                      required 
                      value={taskForm.description} 
                      onChange={(event) => setTaskForm({ ...taskForm, description: event.target.value })} 
                      className="field-control mt-1.5" 
                      placeholder="Task description" 
                    />
                  </label>
                </div>
                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowCreateForm(false)} 
                    className="h-10 px-4 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="h-10 px-4 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-md"
                    disabled={!taskForm.project || !taskForm.assignedUser}
                  >
                    <Plus size={17} />
                    <span>Create Task</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex gap-2 flex-1">
            <div className="relative flex-1 sm:max-w-44">
              <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select 
                value={filters.status} 
                onChange={(event) => setFilters({ ...filters, status: event.target.value })} 
                className="field-control pl-9 h-10 text-sm"
              >
                {statuses.map((status) => <option key={status} value={status}>{status || 'All Status'}</option>)}
              </select>
            </div>
            <div className="relative flex-1 sm:max-w-44">
              <Flag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select 
                value={filters.priority} 
                onChange={(event) => setFilters({ ...filters, priority: event.target.value })} 
                className="field-control pl-9 h-10 text-sm"
              >
                {priorities.map((priority) => <option key={priority} value={priority}>{priority || 'All Priority'}</option>)}
              </select>
            </div>
            {(filters.status || filters.priority) && (
              <button 
                onClick={clearFilters} 
                className="h-10 px-3 text-sm font-medium text-slate-500 hover:text-ink flex items-center gap-1"
              >
                <X size={14} />
                Clear
              </button>
            )}
          </div>
          <button 
            onClick={applyFilters} 
            className="h-10 px-4 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-md"
          >
            <Search size={15} />
            <span>Apply</span>
          </button>
        </div>
      </div>
      
      {tasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
          <div className="h-16 w-16 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center mb-4">
            <Layers size={28} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No tasks found</h3>
          <p className="text-slate-500 mt-1">Try adjusting your filters or create a new task.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="hidden grid-cols-[1.5fr_1fr_0.7fr_0.7fr_1fr] gap-4 bg-slate-50/50 px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider md:grid">
            <span>Task</span>
            <span>Project</span>
            <span>Priority</span>
            <span>Due Date</span>
            <span>Status</span>
          </div>
          {tasks.map((task, i) => {
            const canUpdate = isAdmin || task.assignedUser?._id === user._id;
            const dueDateObj = task.dueDate ? new Date(task.dueDate) : null;
            const overdue = dueDateObj && task.status !== 'Completed' && dueDateObj < new Date();

            return (
              <article 
                key={task._id} 
                className="grid gap-3 border-b border-slate-100 px-5 py-4 last:border-b-0 hover:bg-slate-50/50 transition-colors animate-fade-in md:grid-cols-[1.5fr_1fr_0.7fr_0.7fr_1fr] md:items-center"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="min-w-0">
                  <h2 className="font-semibold text-slate-900 truncate">{task.title}</h2>
                  <p className="text-sm text-slate-500 line-clamp-1 mt-0.5">{task.description}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
                    <User size={12} />
                    <span className="truncate">{task.assignedUser?.name}</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-700 truncate">{task.project?.title}</p>
                <span className={`inline-flex w-fit items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <div className="flex items-center gap-2">
                  {overdue ? (
                    <AlertTriangle size={14} className="text-red-500" />
                  ) : (
                    <Calendar size={14} className="text-slate-400" />
                  )}
                  <p className={`text-sm font-medium ${overdue ? 'text-red-600' : 'text-slate-600'}`}>
                    {dueDateObj ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                  </p>
                </div>
                {canUpdate ? (
                  <select 
                    value={task.status} 
                    onChange={(event) => updateStatus(task, event.target.value)} 
                    className="field-control h-9 text-sm"
                  >
                    {statuses.filter(Boolean).map((status) => <option key={status}>{status}</option>)}
                  </select>
                ) : (
                  <span className={`inline-flex w-fit items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                )}
              </article>
            );
          })}
        </div>
      )}
      {pagination && (
        <p className="text-sm text-slate-500 text-center">
          Showing {tasks.length} of {pagination.total} tasks
        </p>
      )}
    </div>
  );
}