import React from 'react';

const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
      <div>
        Page <span className="font-semibold text-slate-900">{page}</span> of{' '}
        <span className="font-semibold text-slate-900">{totalPages}</span>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={prevDisabled}
          onClick={() => !prevDisabled && onChange(page - 1)}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            prevDisabled
              ? 'cursor-not-allowed bg-slate-100 text-slate-400'
              : 'bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50'
          }`}
        >
          Previous
        </button>
        <button
          type="button"
          disabled={nextDisabled}
          onClick={() => !nextDisabled && onChange(page + 1)}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            nextDisabled
              ? 'cursor-not-allowed bg-slate-100 text-slate-400'
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
