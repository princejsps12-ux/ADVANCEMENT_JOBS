import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../api.js';

const CareerContext = createContext(null);

export const USER_NAME = 'Prince';

const defaultFilters = {
  city: '',
  skills: [],
  experienceLevel: '',
  jobType: '',
  salaryRange: '',
  industry: '',
  search: '',
  page: 1
};

function mapCareerResultsToJobs(careerData) {
  const ranked = (careerData?.results || []).filter((r) => r.job);
  const rows = ranked
    .filter((r) => Number(r.matchPercent || 0) > 0)
    .map((r) => {
      const { job, ...insight } = r;
      return { ...job, _careerInsight: insight };
    });

  // Fallback: if every result scores 0, still show top few ranked jobs.
  return rows.length > 0
    ? rows
    : ranked.slice(0, 5).map((r) => {
        const { job, ...insight } = r;
        return { ...job, _careerInsight: insight };
      });
}

export function CareerProvider({ children }) {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(defaultFilters);
  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [usingRecommendations, setUsingRecommendations] = useState(false);
  const [careerData, setCareerData] = useState(null);
  const [loadError, setLoadError] = useState('');

  const buildFilterParams = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.city) params.set('city', filters.city);
    if (filters.skills?.length) params.set('skills', filters.skills.join(','));
    if (filters.experienceLevel) params.set('experienceLevel', filters.experienceLevel);
    if (filters.jobType) params.set('jobType', filters.jobType);
    if (filters.salaryRange) params.set('salaryRange', filters.salaryRange);
    if (filters.industry) params.set('industry', filters.industry);
    if (filters.search) params.set('search', filters.search);
    params.set('page', filters.page.toString());
    params.set('limit', '10');
    return params;
  }, [filters]);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setUsingRecommendations(false);
    setLoadError('');
    try {
      const params = buildFilterParams();
      const { data } = await axios.get(`${API_BASE}/jobs/filter`, { params });
      setJobs(data.jobs || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching jobs', err);
      setLoadError(
        err.code === 'ERR_NETWORK'
          ? 'Cannot reach the API. Run the backend on port 5000 and npm run dev.'
          : err.response?.data?.message || err.message || 'Failed to load jobs.'
      );
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, [buildFilterParams]);

  const fetchRecommendations = useCallback(async () => {
    setIsLoading(true);
    setUsingRecommendations(true);
    setCareerData(null);
    try {
      const params = new URLSearchParams();
      if (filters.city) params.set('city', filters.city);
      if (filters.skills?.length) params.set('skills', filters.skills.join(','));
      if (filters.experienceLevel) params.set('experienceLevel', filters.experienceLevel);
      params.set('limit', '20');
      const { data } = await axios.get(`${API_BASE}/jobs/recommend`, { params });
      setJobs(data.jobs || []);
      setTotalPages(1);
      setFilters((prev) => ({ ...prev, page: 1 }));
    } catch (err) {
      console.error('Error fetching recommendations', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters.city, filters.skills, filters.experienceLevel]);

  useEffect(() => {
    if (!usingRecommendations && !careerData) {
      fetchJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.city,
    filters.skills,
    filters.experienceLevel,
    filters.jobType,
    filters.salaryRange,
    filters.industry,
    filters.search,
    filters.page,
    careerData,
    usingRecommendations
  ]);

  const handlePageChange = useCallback((page) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handleCareerAnalysis = useCallback(
    (data) => {
      setCareerData(data);
      setUsingRecommendations(false);
      setJobs(mapCareerResultsToJobs(data));
      setTotalPages(1);
      setFilters((prev) => ({ ...prev, page: 1 }));
      navigate('/app/analysis');
    },
    [navigate]
  );

  useEffect(() => {
    if (!careerData) return;
    setUsingRecommendations(false);
    setJobs(mapCareerResultsToJobs(careerData));
    setTotalPages(1);
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, [careerData]);

  const clearCareer = useCallback(() => {
    setCareerData(null);
  }, []);

  const resetSession = useCallback(() => {
    setFilters(defaultFilters);
    setJobs([]);
    setTotalPages(1);
    setIsLoading(false);
    setUsingRecommendations(false);
    setCareerData(null);
    setLoadError('');
  }, []);

  const stats = useMemo(() => {
    const matched = careerData?.results?.filter((r) => r.job)?.length ?? jobs.length;
    const skillsCount = careerData?.extractedSkills?.length ?? 0;
    const results = careerData?.results?.filter((r) => r.job && r.matchPercent != null) || [];
    const avgMatch =
      results.length > 0
        ? Math.round(
            results.reduce((a, r) => a + (r.matchPercent || 0), 0) / results.length
          )
        : null;
    return {
      jobsMatched: careerData ? matched : null,
      skillsDetected: skillsCount,
      matchAccuracy: avgMatch
    };
  }, [careerData, jobs.length]);

  const topAnalysisResult = useMemo(() => {
    const list = careerData?.results?.filter((r) => r.job) || [];
    return list[0] || null;
  }, [careerData]);

  const value = useMemo(
    () => ({
      USER_NAME,
      filters,
      setFilters,
      jobs,
      totalPages,
      isLoading,
      usingRecommendations,
      careerData,
      loadError,
      stats,
      topAnalysisResult,
      fetchJobs,
      fetchRecommendations,
      handleCareerAnalysis,
      clearCareer,
      resetSession,
      handlePageChange,
      buildFilterParams
    }),
    [
      filters,
      jobs,
      totalPages,
      isLoading,
      usingRecommendations,
      careerData,
      loadError,
      stats,
      topAnalysisResult,
      fetchJobs,
      fetchRecommendations,
      handleCareerAnalysis,
      clearCareer,
      resetSession,
      handlePageChange,
      buildFilterParams
    ]
  );

  return (
    <CareerContext.Provider value={value}>{children}</CareerContext.Provider>
  );
}

export function useCareer() {
  const ctx = useContext(CareerContext);
  if (!ctx) throw new Error('useCareer must be used within CareerProvider');
  return ctx;
}
