import { FolderKanban, LayoutDashboard, ListTodo, LogOut, CheckSquare, ChevronRight } from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/tasks', label: 'Tasks', icon: ListTodo }
];

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const getPageTitle = () => {
    if (location.pathname === '/') return 'Dashboard';
    if (location.pathname === '/projects') return 'Projects';
    if (location.pathname.startsWith('/projects/')) return 'Project Details';
    if (location.pathname === '/tasks') return 'Tasks';
    return '';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col z-30 hidden lg:flex">
        <div className="h-16 flex items-center px-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 shadow-md">
              <CheckSquare size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">TaskFlow</span>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
          <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Menu</p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
              >
                <item.icon size={18} />
                {item.label}
                {location.pathname === item.to && (
                  <ChevronRight size={14} className="ml-auto" />
                )}
              </NavLink>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600 text-sm font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 h-10 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>
      
      <header className="sticky top-0 z-20 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 text-white">
              <CheckSquare size={16} />
            </div>
            <span className="font-bold text-slate-900">TaskFlow</span>
          </div>
          <div className="hidden lg:block">
            <h1 className="text-lg font-bold text-slate-900">{getPageTitle()}</h1>
          </div>
        </div>
        <button onClick={logout} className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100">
          <LogOut size={20} />
        </button>
      </header>
      
      <nav className="sticky top-16 z-20 bg-white border-b border-slate-200 grid grid-cols-3 lg:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center justify-center gap-2 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                isActive ? 'text-indigo-600 border-brand' : 'text-slate-500 border-transparent'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      
      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}