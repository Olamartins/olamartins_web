import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  MessagesSquare,
  Newspaper,
  Package,
  Settings,
  Store,
  X,
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
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const sidebarBody = (
    <>
      <div className="flex h-16 items-center justify-between border-b border-blue-100 px-5 dark:border-blue-900/50">
        <NavLink to="/admin" className="font-display text-base font-bold tracking-tight">
          Ola<span className="text-accent dark:text-accent-dark">Martins</span>
        </NavLink>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-[12px] text-neutral-500 transition hover:bg-blue-50 dark:text-neutral-400 dark:hover:bg-white/5 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-[12px] px-3.5 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-accent/10 text-accent dark:bg-accent-dark/15 dark:text-accent-dark'
                  : 'text-neutral-600 hover:bg-blue-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-white/5 dark:hover:text-white'
              }`
            }
          >
            <item.icon size={17} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-blue-100 p-3 dark:border-blue-900/50">
        <p className="truncate px-3.5 pb-2 text-xs text-neutral-400">{admin?.email}</p>
        <NavLink
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-3 rounded-[12px] px-3.5 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-blue-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-white/5 dark:hover:text-white"
        >
          <Store size={17} /> View site
        </NavLink>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-[12px] px-3.5 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-red-50 hover:text-red-600 dark:text-neutral-300 dark:hover:bg-red-500/10 dark:hover:text-red-400"
        >
          <LogOut size={17} /> Log out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar — static, always visible from lg up */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-blue-100 bg-blue-50/50 dark:border-blue-900/50 dark:bg-navy-950/60 lg:flex">
        {sidebarBody}
      </aside>

      {/* Mobile drawer + backdrop */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-navy-950/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-blue-100 bg-white shadow-glow dark:border-blue-900/50 dark:bg-navy-950 lg:hidden"
            >
              {sidebarBody}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="min-w-0 flex-1">
        {/* Mobile top bar with hamburger */}
        <div className="glass sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-blue-100 bg-white/70 text-neutral-700 dark:border-blue-900/60 dark:bg-white/5 dark:text-neutral-200"
          >
            <Menu size={19} />
          </button>
          <NavLink to="/admin" className="font-display text-base font-bold tracking-tight">
            Ola<span className="text-accent dark:text-accent-dark">Martins</span>
            <span className="ml-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-400">admin</span>
          </NavLink>
          <ThemeToggle />
        </div>
        <main className="p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
