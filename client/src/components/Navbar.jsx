import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { BarChart3, CalendarPlus, Lock, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/resources', label: 'Resources' },
  { to: '/shop', label: 'Shop' },
  { to: '/articles', label: 'Articles' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 24 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? 'glass border-b shadow-sm' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <motion.div
        className="absolute inset-x-0 top-0 h-0.5 origin-left bg-gradient-to-r from-blue-700 via-blue-500 to-sky-400"
        style={{ scaleX: progress }}
      />
      <nav className="container-site flex h-16 items-center justify-between">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 to-blue-500 text-white shadow-lg shadow-blue-600/30 transition group-hover:scale-105">
            <BarChart3 size={18} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            Ola<span className="text-gradient-blue">Martins</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
                    : 'text-neutral-600 hover:bg-blue-50 hover:text-blue-700 dark:text-neutral-300 dark:hover:bg-white/5 dark:hover:text-blue-200'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/contact" className="btn-primary hidden !px-4 !py-2 text-[13px] sm:inline-flex">
            <CalendarPlus size={15} /> Book a call
          </Link>
          <Link
            to="/admin"
            aria-label="Admin dashboard"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition hover:bg-blue-50 hover:text-blue-700 dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-blue-300 lg:flex"
          >
            <Lock size={16} />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-100 bg-white/70 text-neutral-700 dark:border-blue-900/60 dark:bg-white/5 dark:text-neutral-200 lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="glass overflow-hidden border-t lg:hidden"
          >
            <div className="container-site flex flex-col gap-1 py-4">
              {LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-2.5 text-sm font-medium ${
                      isActive
                        ? 'bg-blue-600/10 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
                        : 'text-neutral-700 hover:bg-blue-50 dark:text-neutral-200 dark:hover:bg-white/5'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Link to="/contact" className="btn-primary mt-2 justify-center">
                <CalendarPlus size={15} /> Book a call
              </Link>
              <Link
                to="/admin"
                className="mt-1 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-blue-50 dark:text-neutral-200 dark:hover:bg-white/5"
              >
                <Lock size={14} /> Admin
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
