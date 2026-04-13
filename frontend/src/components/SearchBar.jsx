import React from 'react';

const SearchBar = ({ value, onChange, label, placeholder }) => {
  return (
    <div className="mb-0">
      {label && (
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'Search by job title, company, skill…'}
          className="w-full rounded-2xl border border-slate-200/90 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-300 transition"
        />
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default SearchBar;
