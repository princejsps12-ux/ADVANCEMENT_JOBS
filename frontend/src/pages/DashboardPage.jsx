import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCareer, USER_NAME } from '../context/CareerContext.jsx';
import ResumeUploadZone from '../components/ResumeUploadZone.jsx';
import { SkillsBarChart } from '../components/charts/SkillsBarChart.jsx';

function StatCard({ label, value, sub }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-card"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold tabular-nums text-slate-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </motion.div>
  );
}

export default function DashboardPage() {
  const {
    filters,
    jobs,
    careerData,
    stats,
    isLoading,
    handleCareerAnalysis
  } = useCareer();

  const preview = jobs.slice(0, 4);

  return (
    <div className="space-y-10">
      <div>
        <motion.h1
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-display text-2xl sm:text-3xl font-bold text-slate-900"
        >
          Hi {USER_NAME} 👋
        </motion.h1>
        <p className="mt-2 text-slate-600 max-w-xl">
          Your command center for AI matches, skill signals, and next steps.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Jobs matched"
          value={stats.jobsMatched}
          sub={careerData ? 'From last analysis' : 'In current list'}
        />
        <StatCard
          label="Skills detected"
          value={careerData ? stats.skillsDetected : '—'}
          sub={careerData ? 'Lexicon + NLP phrases' : 'Upload resume to analyze'}
        />
        <StatCard
          label="Avg match"
          value={stats.matchAccuracy != null ? `${stats.matchAccuracy}%` : '—'}
          sub={careerData ? 'Across scored roles' : 'Run analysis first'}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-3">
          <h2 className="font-display text-lg font-semibold text-slate-900">Resume upload</h2>
          <ResumeUploadZone filters={filters} onAnalysis={handleCareerAnalysis} />
        </div>
        <div className="lg:col-span-2">
          <SkillsBarChart skills={careerData?.extractedSkills || []} title="Skill signals" />
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-slate-900">Recent job matches</h2>
          <Link
            to="/app/jobs"
            className="text-sm font-semibold text-sky-600 hover:text-sky-700"
          >
            View all →
          </Link>
        </div>
        {isLoading && !preview.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl bg-slate-200/60"
              />
            ))}
          </div>
        ) : preview.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 px-6 py-12 text-center">
            <p className="text-slate-600">No jobs loaded yet.</p>
            <Link to="/app/jobs" className="mt-3 inline-block text-sm font-semibold text-indigo-600">
              Open job matches
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {preview.map((job, idx) => (
              <motion.div
                key={job._id || idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-card hover:shadow-soft transition-shadow"
              >
                <p className="font-semibold text-slate-900 line-clamp-1">{job.title}</p>
                <p className="text-sm text-slate-500 mt-0.5">
                  {job.company} · {job.location}
                </p>
                {job._careerInsight?.matchPercent != null && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs font-medium text-slate-500">
                      <span>Match</span>
                      <span>{Math.round(job._careerInsight.matchPercent)}%</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${job._careerInsight.matchPercent}%` }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
