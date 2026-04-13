import React, { useState } from 'react';
import { motion } from 'framer-motion';

const JobCard = ({ job, index = 0 }) => {
  const insight = job._careerInsight;
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const posted = new Date(job.postedDate);
  const postedStr = posted.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const skills = job.skills || [];
  const matchPct = insight?.matchPercent;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className="group flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-card transition-shadow hover:shadow-soft"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-display text-base font-semibold text-slate-900 leading-snug">
            {job.title}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {job.company} · {job.location}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/80">
            {job.jobType}
          </span>
          {matchPct != null && (
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 ring-1 ring-emerald-100">
              {Math.round(matchPct)}% match
            </span>
          )}
        </div>
      </div>

      {matchPct != null && (
        <div>
          <div className="mb-1 flex justify-between text-[11px] font-medium text-slate-500">
            <span>Match strength</span>
            <span>{Math.round(matchPct)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, matchPct)}%` }}
              transition={{ duration: 0.75, delay: 0.1 + index * 0.03, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      )}

      <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">{job.description}</p>

      {detailsOpen && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-700 space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">About this role</p>
            <p className="mt-1 leading-relaxed">{job.description || 'No description provided.'}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 text-xs">
            <p>
              <span className="font-semibold text-slate-600">Company:</span> {job.company || 'N/A'}
            </p>
            <p>
              <span className="font-semibold text-slate-600">Location:</span> {job.location || 'N/A'}
            </p>
            <p>
              <span className="font-semibold text-slate-600">Experience:</span>{' '}
              {job.experienceLevel || 'N/A'}
            </p>
            <p>
              <span className="font-semibold text-slate-600">Type:</span> {job.jobType || 'N/A'}
            </p>
            <p className="sm:col-span-2">
              <span className="font-semibold text-slate-600">Salary:</span> {job.salaryRange || 'N/A'}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        {skills.slice(0, 6).map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200/70"
          >
            {skill}
          </span>
        ))}
        {skills.length > 6 && (
          <span className="self-center text-[11px] text-slate-400">+{skills.length - 6} more</span>
        )}
      </div>

      {insight && (
        <div className="rounded-xl border border-slate-100 bg-slate-50/90 p-3 text-[11px] text-slate-600">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span>
              TF-IDF:{' '}
              <span className="font-semibold text-slate-800">
                {(insight.tfidfSimilarity * 100).toFixed(1)}%
              </span>
            </span>
            {insight.lsaSimilarity != null && (
              <span>
                LSA:{' '}
                <span className="font-semibold text-slate-800">
                  {(insight.lsaSimilarity * 100).toFixed(1)}%
                </span>
              </span>
            )}
            <span>
              Coverage:{' '}
              <span className="font-semibold text-slate-800">
                {(insight.skillCoverage * 100).toFixed(0)}%
              </span>
            </span>
          </div>
          {insight.missingSkills?.length > 0 && (
            <p className="mt-2 text-slate-600">
              <span className="font-semibold text-amber-800">Gaps: </span>
              {insight.missingSkills.slice(0, 8).join(', ')}
              {insight.missingSkills.length > 8 && ` +${insight.missingSkills.length - 8}`}
            </p>
          )}
          {insight.matchedSkills?.length > 0 && (
            <p className="mt-1 text-emerald-800">
              <span className="font-semibold">Aligned: </span>
              {insight.matchedSkills.slice(0, 6).join(', ')}
              {insight.matchedSkills.length > 6 && ` +${insight.matchedSkills.length - 6}`}
            </p>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mt-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            {open ? 'Hide roadmap' : 'Show learning roadmap'}
          </button>
          {open && insight.learningRoadmap?.length > 0 && (
            <ul className="mt-3 space-y-2 border-t border-slate-200 pt-3">
              {insight.learningRoadmap.map((block) => (
                <li key={block.skill}>
                  <p className="font-semibold capitalize text-slate-800">{block.skill}</p>
                  <ol className="ml-4 mt-1 list-decimal space-y-0.5 text-slate-600">
                    {block.steps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
        <div className="flex flex-wrap gap-2">
          <span>{job.industry}</span>
          <span className="text-slate-300">·</span>
          <span>{job.experienceLevel}</span>
          <span className="text-slate-300">·</span>
          <span className="font-semibold text-slate-700">{job.salaryRange}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span>Posted {postedStr}</span>
        <button
          type="button"
          onClick={() => setDetailsOpen((v) => !v)}
          className="rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-slate-800"
        >
          {detailsOpen ? 'Hide details' : 'View details'}
        </button>
      </div>
    </motion.article>
  );
};

export default JobCard;
