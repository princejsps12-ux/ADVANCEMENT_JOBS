import React from 'react';
import { useCareer } from '../context/CareerContext.jsx';
import FiltersSidebar from '../components/FiltersSidebar.jsx';
import JobList from '../components/JobList.jsx';
import Pagination from '../components/Pagination.jsx';
import SearchBar from '../components/SearchBar.jsx';

export default function JobsPage() {
  const {
    filters,
    setFilters,
    jobs,
    totalPages,
    isLoading,
    usingRecommendations,
    careerData,
    loadError,
    fetchRecommendations,
    handlePageChange,
    clearCareer
  } = useCareer();

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
      <aside className="w-full shrink-0 lg:w-72 lg:sticky lg:top-24">
        <FiltersSidebar
          filters={filters}
          onFilterChange={setFilters}
          onApplyRecommendations={fetchRecommendations}
        />
      </aside>

      <div className="min-w-0 flex-1 space-y-5">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Job recommendations</h1>
          <p className="mt-1 text-sm text-slate-600">
            Filter by role keywords, location, and experience. AI recommendations use your sidebar picks.
          </p>
        </div>

        <SearchBar
          label="Role / keywords"
          value={filters.search}
          onChange={(val) => setFilters((prev) => ({ ...prev, search: val, page: 1 }))}
        />

        {careerData && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/50 px-4 py-3">
            <p className="text-sm text-indigo-900">
              Showing AI-ranked matches from your resume.{' '}
              <button
                type="button"
                onClick={clearCareer}
                className="font-semibold underline decoration-indigo-300 hover:text-indigo-950"
              >
                Clear
              </button>{' '}
              to return to browse mode.
            </p>
          </div>
        )}

        {loadError && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">
            {loadError}
          </div>
        )}

        {usingRecommendations && !careerData && (
          <div className="rounded-2xl border border-sky-100 bg-sky-50/80 px-4 py-3 text-sm text-sky-900">
            Recommended from your selected filters and skills.
          </div>
        )}

        <JobList jobs={jobs} isLoading={isLoading} />

        {!usingRecommendations && !careerData && (
          <Pagination
            page={filters.page}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
