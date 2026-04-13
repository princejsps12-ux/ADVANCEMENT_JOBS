import React from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const nav = [
  { to: '/app/dashboard', label: 'Dashboard' },
  { to: '/app/analysis', label: 'Resume analysis' },
  { to: '/app/jobs', label: 'Job matches' },
  { to: '/app/roadmap', label: 'Learning roadmap' }
];

export default function AppShell() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-mesh font-sans text-slate-800">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 text-white text-sm font-bold shadow-md shadow-indigo-500/25">
              A
            </span>
            <div>
              <span className="font-display text-lg font-semibold text-slate-900 tracking-tight">
                Advancer
              </span>
              <span className="hidden sm:block text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                Career intelligence
              </span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {nav.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-soft'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <Link
            to="/"
            className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            Log out
          </Link>
        </div>
        <div className="md:hidden border-t border-slate-100 px-4 py-2 flex gap-1 overflow-x-auto">
          {nav.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${
                  isActive ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-50'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
