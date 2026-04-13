import React from 'react';
import { motion } from 'framer-motion';
import JobCard from './JobCard.jsx';

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card overflow-hidden">
      <div className="flex justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 animate-pulse rounded-lg bg-slate-200/80" />
          <div className="h-3 w-1/3 animate-pulse rounded-lg bg-slate-100" />
        </div>
        <div className="h-6 w-16 shrink-0 animate-pulse rounded-full bg-slate-100" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-slate-100" />
      </div>
      <div className="mt-4 flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-6 w-14 animate-pulse rounded-full bg-slate-100" />
        ))}
      </div>
    </div>
  );
}

const JobList = ({ jobs, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-8 py-16 text-center"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="mt-4 font-medium text-slate-800">No jobs found</p>
        <p className="mt-1 text-sm text-slate-500">
          Try different filters, role keywords, or clear AI resume mode.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {jobs.map((job, i) => (
        <JobCard key={job._id || i} job={job} index={i} />
      ))}
    </div>
  );
};

export default JobList;
