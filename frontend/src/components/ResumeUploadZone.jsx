import React, { useCallback, useRef, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_BASE } from '../api.js';

export default function ResumeUploadZone({ filters, onAnalysis, variant = 'default' }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [drag, setDrag] = useState(false);

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (filters.city) params.set('city', filters.city);
    if (filters.skills?.length) params.set('skills', filters.skills.join(','));
    if (filters.experienceLevel) params.set('experienceLevel', filters.experienceLevel);
    if (filters.jobType) params.set('jobType', filters.jobType);
    if (filters.salaryRange) params.set('salaryRange', filters.salaryRange);
    if (filters.industry) params.set('industry', filters.industry);
    if (filters.search) params.set('search', filters.search);
    params.set('limit', '120');
    return params.toString();
  };

  const runAnalysis = async () => {
    setError('');
    if (!file) {
      setError('Drop a PDF resume or click to browse.');
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('resume', file);
      const q = buildQuery();
      const { data } = await axios.post(`${API_BASE}/career/match?${q}`, fd, {
        timeout: 120000
      });
      onAnalysis(data);
      setFile(null);
    } catch (err) {
      const d = err.response?.data;
      const msg =
        (typeof d?.message === 'string' && d.message) ||
        (typeof d?.detail === 'string' && d.detail.slice(0, 300)) ||
        err.message ||
        'Analysis failed';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f && (f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'))) {
      setFile(f);
      setError('');
    } else {
      setError('Please upload a PDF file.');
    }
  }, []);

  const compact = variant === 'compact';

  return (
    <motion.div
      layout
      className={`rounded-2xl border border-slate-200/90 bg-white shadow-card overflow-hidden ${
        compact ? '' : 'p-1'
      }`}
    >
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          if (!e.currentTarget.contains(e.relatedTarget)) setDrag(false);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 ${
          drag
            ? 'border-sky-400 bg-sky-50/80 scale-[1.01]'
            : 'border-slate-200 bg-gradient-to-br from-slate-50/80 via-white to-sky-50/40 hover:border-sky-300/80 hover:bg-sky-50/30'
        } ${compact ? 'p-6' : 'p-10'}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            setError('');
          }}
        />
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <div>
            <p className="font-display text-base font-semibold text-slate-900">
              {file ? file.name : 'Drop your resume here'}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              PDF only · AI extracts skills and matches roles
            </p>
          </div>
        </div>
      </div>
      <div className={`flex flex-wrap items-center justify-center gap-3 ${compact ? 'p-4 pt-0' : 'p-6 pt-2'}`}>
        <button
          type="button"
          disabled={busy || !file}
          onClick={(e) => {
            e.stopPropagation();
            runAnalysis();
          }}
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-slate-800 disabled:opacity-45 disabled:pointer-events-none"
        >
          {busy ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Analyzing…
            </span>
          ) : (
            'Run AI match'
          )}
        </button>
      </div>
      {error && (
        <p className="mx-6 mb-4 rounded-xl bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}
    </motion.div>
  );
}
