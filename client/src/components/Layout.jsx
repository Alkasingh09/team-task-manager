import { FolderKanban, LayoutDashboard, ListTodo, LogOut } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/tasks', label: 'Tasks', icon: ListTodo }
];

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white px-5 py-6 lg:block">
        <div>
          <p className="text-lg font-bold text-ink">Team Task Manager</p>
          <p className="mt-1 text-sm text-slate-500">{user?.role === 'admin' ? 'Admin workspace' : 'Member workspace'}</p>
        </div>
        <nav className="mt-8 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition ${
                  isActive ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-ink'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={logout}
          className="absolute bottom-6 left-5 right-5 flex h-11 items-center justify-center gap-2 rounded-md border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          <LogOut size={17} />
          Sign out
        </button>
      </aside>
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <span className="font-bold">Team Task Manager</span>
        <button onClick={logout} className="rounded-md border border-slate-200 p-2 text-slate-600">
          <LogOut size={18} />
        </button>
      </header>
      <nav className="sticky top-[57px] z-20 grid grid-cols-3 border-b border-slate-200 bg-white lg:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center justify-center gap-2 px-2 py-3 text-xs font-semibold ${
                isActive ? 'text-brand' : 'text-slate-500'
              }`
            }
          >
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
