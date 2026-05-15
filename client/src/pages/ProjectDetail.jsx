import { Calendar, Flag, User, GripVertical, MoreHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api.js';
import EmptyState from '../components/EmptyState.jsx';
import Toast from '../components/Toast.jsx';

const statusConfig = {
  'To Do': { 
    color: 'bg-slate-100 border-slate-200', 
    header: 'bg-slate-100', 
    dot: 'bg-slate-400',
    icon: 'text-slate-500'
  },
  'In Progress': { 
    color: 'bg-blue-50 border-blue-100', 
    header: 'bg-blue-50', 
    dot: 'bg-blue-500',
    icon: 'text-blue-500'
  },
  'Completed': { 
    color: 'bg-emerald-50 border-emerald-100', 
    header: 'bg-emerald-50', 
    dot: 'bg-emerald-500',
    icon: 'text-emerald-500'
  }
};

const priorityConfig = {
  'High': 'bg-red-100 text-red-700 border-red-200',
  'Medium': 'bg-amber-100 text-amber-700 border-amber-200',
  'Low': 'bg-emerald-100 text-emerald-700 border-emerald-200'
};

export default function ProjectDetail() {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');

  const loadProject = async () => {
    const { data } = await api.get(`/projects/${id}`);
    setDetail(data);
  };

  useEffect(() => {
    loadProject().catch((err) => setError(err.response?.data?.message || 'Could not load project'));
  }, [id]);

  if (!detail) {
    return <Toast message={error || 'Loading project...'} tone={error ? 'error' : 'success'} />;
  }

  const tasks = detail.tasks || [];
  const todoTasks = tasks.filter(t => t.status === 'To Do');
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
  const completedTasks = tasks.filter(t => t.status === 'Completed');

  const columnData = [
    { status: 'To Do', tasks: todoTasks, count: todoTasks.length },
    { status: 'In Progress', tasks: inProgressTasks, count: inProgressTasks.length },
    { status: 'Completed', tasks: completedTasks, count: completedTasks.length }
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="page-eyebrow">Project Detail</p>
        <h1 className="page-title">{detail.project.title}</h1>
        <p className="page-copy">{detail.project.description}</p>
      </div>
      <Toast message={error} />
      
      <div className="grid gap-5 lg:grid-cols-3">
        {columnData.map((column) => {
          const config = statusConfig[column.status];
          
          return (
            <section 
              key={column.status} 
              className={`rounded-xl border ${config.color} overflow-hidden`}
            >
              <div className={`flex items-center justify-between px-4 py-3 ${config.header}`}>
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${config.dot}`} />
                  <h2 className="font-bold text-slate-800">{column.status}</h2>
                </div>
                <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm">
                  {column.count}
                </div>
              </div>
              
              <div className="p-3 space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
                {column.tasks.length === 0 ? (
                  <div className="py-8 px-2 text-center">
                    <div className="h-10 w-10 rounded-lg bg-white/50 mx-auto mb-2 flex items-center justify-center">
                      <div className="h-2 w-8 bg-slate-200 rounded-full" />
                    </div>
                    <p className="text-xs text-slate-400">No tasks</p>
                  </div>
                ) : (
                  column.tasks.map((task, i) => (
                    <div 
                      key={task._id} 
                      className="group bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2">{task.title}</h3>
                        <button className="p-1 rounded text-slate-300 hover:text-slate-500 hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
                          <GripVertical size={14} />
                        </button>
                      </div>
                      
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">{task.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full border ${priorityConfig[task.priority]}`}>
                          {task.priority}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">
                            {task.assignedUser?.name?.charAt(0)}
                          </div>
                          <span>{task.assignedUser?.name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-400 ml-auto">
                          <Calendar size={12} />
                          <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>
      
      {tasks.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
          <div className="h-16 w-16 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center mb-4">
            <Flag size={28} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No tasks yet</h3>
          <p className="text-slate-500 mt-1">Add tasks to this project from the Tasks page.</p>
        </div>
      )}
    </div>
  );
}