import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCareer } from '../context/CareerContext.jsx';

export default function RoadmapPage() {
  const { careerData, topAnalysisResult } = useCareer();
  const top = topAnalysisResult;
  const roadmap = top?.learningRoadmap || [];

  if (!careerData || !roadmap.length) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <h1 className="font-display text-2xl font-bold text-slate-900">Learning roadmap</h1>
        <p className="mt-3 text-slate-600">
          Run resume analysis to generate a step-by-step plan from your top match’s skill gaps.
        </p>
        <Link
          to="/app/dashboard"
          className="mt-8 inline-flex rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
        >
          Upload resume
        </Link>
      </div>
    );
  }

  const flatSteps = [];
  let stepNum = 0;
  for (const block of roadmap) {
    for (const text of block.steps || []) {
      stepNum += 1;
      flatSteps.push({ skill: block.skill, text, stepNum });
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Learning roadmap</h1>
        <p className="mt-2 text-slate-600">
          Based on your strongest match{top?.job?.title ? `: ${top.job.title}` : ''}. Tackle gaps in order.
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-[19px] top-3 bottom-3 w-px bg-gradient-to-b from-sky-300 via-indigo-300 to-slate-200" />
        <ul className="space-y-6">
          {flatSteps.map((item, i) => (
            <motion.li
              key={`${item.skill}-${i}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
              className="relative flex gap-5 pl-1"
            >
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-sm font-bold text-white shadow-md shadow-indigo-500/25">
                {item.stepNum}
              </div>
              <div className="flex-1 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 capitalize">
                  {item.skill}
                </p>
                <p className="mt-1 text-sm text-slate-700 leading-relaxed">{item.text}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="text-center">
        <Link to="/app/jobs" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
          ← Back to job matches
        </Link>
      </div>
    </div>
  );
}
