import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCareer } from '../context/CareerContext.jsx';
import { MatchRing } from '../components/ui/MatchRing.jsx';
import ResumeUploadZone from '../components/ResumeUploadZone.jsx';
import { SkillsBarChart } from '../components/charts/SkillsBarChart.jsx';

export default function ResumeAnalysisPage() {
  const { careerData, filters, handleCareerAnalysis, topAnalysisResult } = useCareer();
  const asArray = (value) => (Array.isArray(value) ? value : []);

  if (!careerData) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <h1 className="font-display text-2xl font-bold text-slate-900">Resume analysis</h1>
        <p className="mt-3 text-slate-600">
          Upload a resume on the dashboard to see skills, match score, and gaps.
        </p>
        <Link
          to="/app/dashboard"
          className="mt-8 inline-flex rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-slate-800"
        >
          Go to dashboard
        </Link>
      </div>
    );
  }

  const top = topAnalysisResult;
  const pct = top?.matchPercent ?? 0;
  const missing = asArray(top?.missingSkills);
  const matched = asArray(top?.matchedSkills);
  const skills = asArray(careerData?.extractedSkills);
  const bySrc = careerData.skillsBySource || {};
  const lex = asArray(bySrc?.lexicon);
  const nlp = asArray(bySrc?.nlpTfidfNgrams);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Resume analysis</h1>
        <p className="mt-1 text-slate-600">
          Top role alignment · {top?.job?.title ? `${top.job.title} at ${top.job.company}` : 'Best match'}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 items-start">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/90 bg-white p-10 shadow-card"
        >
          <MatchRing value={pct} size={200} stroke={12} />
          <p className="mt-6 text-center text-sm text-slate-500 max-w-xs">
            Blended document similarity (TF-IDF + LSA) and structured skill overlap vs this role.
          </p>
        </motion.div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-card">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Extracted skills
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-800 border border-slate-200/80 capitalize"
                >
                  {s}
                </span>
              ))}
            </div>
            {(lex.length > 0 || nlp.length > 0) && (
              <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                {lex.length > 0 && <p>Lexicon / tags: {lex.join(', ')}</p>}
                {nlp.length > 0 && <p>NLP phrases: {nlp.join(', ')}</p>}
              </div>
            )}
          </div>

          <ResumeUploadZone filters={filters} onAnalysis={handleCareerAnalysis} variant="compact" />

          <SkillsBarChart skills={skills} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-red-100 bg-gradient-to-br from-red-50/90 to-white p-6 shadow-card"
        >
          <h2 className="font-display text-lg font-semibold text-red-900">Missing skills</h2>
          <p className="mt-1 text-sm text-red-800/80">Gaps vs this job’s skill tags</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {missing.length === 0 && (
              <li className="text-sm text-red-700/70">None flagged—strong overlap.</li>
            )}
            {missing.map((s) => (
              <li
                key={s}
                className="rounded-full bg-red-100/90 px-3 py-1 text-xs font-semibold text-red-800 border border-red-200/80 capitalize"
              >
                {s}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/90 to-white p-6 shadow-card"
        >
          <h2 className="font-display text-lg font-semibold text-emerald-900">Recommended / aligned</h2>
          <p className="mt-1 text-sm text-emerald-800/80">Skills that match the posting</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {matched.length === 0 && (
              <li className="text-sm text-emerald-700/70">Upload more detail or pick another role.</li>
            )}
            {matched.map((s) => (
              <li
                key={s}
                className="rounded-full bg-emerald-100/90 px-3 py-1 text-xs font-semibold text-emerald-900 border border-emerald-200/80 capitalize"
              >
                {s}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <div className="flex justify-center">
        <Link
          to="/app/roadmap"
          className="inline-flex rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25"
        >
          View learning roadmap
        </Link>
      </div>
    </div>
  );
}
