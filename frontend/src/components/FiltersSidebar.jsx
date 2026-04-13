import React from 'react';

const cities = [
  '',
  'Bangalore',
  'Hyderabad',
  'Pune',
  'Delhi',
  'Mumbai',
  'Chennai',
  'Gurgaon',
  'Noida',
  'Kolkata',
  'Ahmedabad'
];

const skillsOptions = [
  'Machine Learning',
  'Python',
  'TensorFlow',
  'PyTorch',
  'NLP',
  'Data Science',
  'SQL',
  'Deep Learning',
  'Computer Vision',
  'Pandas',
  'NumPy',
  'Scikit-learn',
  'MLOps',
  'Flask',
  'FastAPI',
  'Statistics',
  'Big Data'
];

const experienceLevels = ['', '0-1 years', '1-3 years', '3-5 years', '5+ years'];

const jobTypes = ['', 'Full Time', 'Internship', 'Remote', 'Contract'];

const salaryRanges = [
  '',
  '3-5 LPA',
  '5-8 LPA',
  '8-12 LPA',
  '12-18 LPA',
  '18-25 LPA',
  '25+ LPA'
];

const industries = [
  '',
  'Information Technology',
  'E-commerce',
  'Healthcare',
  'Finance',
  'EdTech',
  'Consulting',
  'SaaS',
  'Analytics'
];

const selectClass =
  'w-full rounded-xl border border-slate-200/90 bg-white py-2.5 px-3 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition';

const FiltersSidebar = ({ filters, onFilterChange, onApplyRecommendations }) => {
  const handleSelectChange = (key) => (e) => {
    onFilterChange({ ...filters, [key]: e.target.value, page: 1 });
  };

  const handleSkillToggle = (skill) => {
    const current = filters.skills || [];
    const exists = current.includes(skill);
    const updated = exists ? current.filter((s) => s !== skill) : [...current, skill];
    onFilterChange({ ...filters, skills: updated, page: 1 });
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-5 shadow-card backdrop-blur-sm lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
      <h2 className="font-display text-base font-semibold text-slate-900">Filters</h2>
      <p className="mt-1 text-xs text-slate-500 leading-relaxed">
        Location, experience, and skills power recommendations.
      </p>

      <div className="mt-5 space-y-4 text-sm">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Location
          </label>
          <select className={selectClass} value={filters.city || ''} onChange={handleSelectChange('city')}>
            {cities.map((c) => (
              <option key={c || 'any'} value={c}>
                {c || 'Any city'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Experience level
          </label>
          <select
            className={selectClass}
            value={filters.experienceLevel || ''}
            onChange={handleSelectChange('experienceLevel')}
          >
            {experienceLevels.map((e) => (
              <option key={e || 'any'} value={e}>
                {e || 'Any level'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Job type
          </label>
          <select className={selectClass} value={filters.jobType || ''} onChange={handleSelectChange('jobType')}>
            {jobTypes.map((t) => (
              <option key={t || 'any'} value={t}>
                {t || 'Any type'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Salary range
          </label>
          <select
            className={selectClass}
            value={filters.salaryRange || ''}
            onChange={handleSelectChange('salaryRange')}
          >
            {salaryRanges.map((s) => (
              <option key={s || 'any'} value={s}>
                {s || 'Any salary'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Industry
          </label>
          <select
            className={selectClass}
            value={filters.industry || ''}
            onChange={handleSelectChange('industry')}
          >
            {industries.map((i) => (
              <option key={i || 'any'} value={i}>
                {i || 'Any industry'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Skills
          </label>
          <div className="flex flex-wrap gap-1.5">
            {skillsOptions.map((skill) => {
              const active = (filters.skills || []).includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                    active
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onApplyRecommendations}
        className="mt-6 w-full rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-95"
      >
        AI recommend for me
      </button>
    </div>
  );
};

export default FiltersSidebar;
