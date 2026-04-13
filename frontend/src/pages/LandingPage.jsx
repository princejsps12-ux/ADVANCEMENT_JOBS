import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'AI job matching',
    desc: 'TF-IDF, LSA, and skill overlap score every role against your resume—no keyword stuffing.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    )
  },
  {
    title: 'Skill gap analysis',
    desc: 'See what each posting expects vs your profile, with clear “missing” and “aligned” signals.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    )
  },
  {
    title: 'Personalized roadmap',
    desc: 'Actionable steps per gap so you know what to learn next—not generic career advice.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    )
  }
];

const fade = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-mesh">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
        <span className="font-display text-xl font-semibold tracking-tight text-slate-900">
          Advancer
        </span>
        <Link
          to="/app/dashboard"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-slate-800 transition"
        >
          Open app
        </Link>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
        <motion.div {...fade} className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-sky-600/90">
            Career intelligence
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] leading-[1.1]">
            Find the right job with{' '}
            <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
              AI
            </span>
          </h1>
          <p className="mt-5 text-lg text-slate-600 leading-relaxed max-w-xl">
            Upload your resume once. We parse skills, compare you to real openings, and show match scores,
            gaps, and a learning path—built for serious job seekers.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/app/dashboard"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 hover:opacity-95 transition"
            >
              Upload resume
            </Link>
            <Link
              to="/app/jobs"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/80 px-8 py-3.5 text-base font-semibold text-slate-700 shadow-sm hover:bg-white transition"
            >
              Browse jobs
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 grid gap-6 sm:grid-cols-3"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ y: -4 }}
              className="group rounded-2xl border border-slate-200/90 bg-white/90 p-6 shadow-card backdrop-blur-sm transition-shadow hover:shadow-soft"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {f.icon}
                </svg>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
