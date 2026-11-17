import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  MessagesSquare,
  Newspaper,
  Package,
  Settings,
  Store,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import ThemeToggle from '../ThemeToggle.jsx';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/resources', label: 'Resources', icon: BookOpen },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/articles', label: 'Articles', icon: Newspaper },
  { to: '/admin/messages', label: 'Messages', icon: MessagesSquare },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/60">
        <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-5 dark:border-neutral-800">
          <NavLink to="/admin" className="text-base font-bold tracking-tight">
            Ola<span className="text-accent dark:text-accent-dark">Martins</span>
          </NavLink>
          <ThemeToggle />
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-accent/10 text-accent dark:bg-accent-dark/15 dark:text-accent-dark'
                    : 'text-neutral-600 hover:bg-neutral-200/60 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white'
                }`
              }
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-neutral-200 p-3 dark:border-neutral-800">
          <p className="px-3.5 pb-2 text-xs text-neutral-400">{admin?.email}</p>
          <NavLink
            to="/"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-200/60 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            <Store size={17} /> View site
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-red-50 hover:text-red-600 dark:text-neutral-300 dark:hover:bg-red-500/10 dark:hover:text-red-400"
          >
            <LogOut size={17} /> Log out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1 p-5 sm:p-8">
        <Outlet />
      </div>
    </div>
  );
}
