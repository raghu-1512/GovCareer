import React, { useState, useMemo } from 'react';
import { Job } from '../types';
import { JobCard } from '../components/JobCard';
import { evaluateJobEligibility } from '../utils/eligibilityEngine';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  CheckCircle2, 
  ArrowUpDown,
  RotateCcw,
  ArrowLeft
} from 'lucide-react';

interface JobSearchPageProps {
  jobs: Job[];
  savedJobIds: string[];
  onToggleSave: (jobId: string) => void;
  onViewJobDetails: (job: Job) => void;
  onTrackJob: (job: Job) => void;
  onBack?: () => void;
}

export const JobSearchPage: React.FC<JobSearchPageProps> = ({
  jobs,
  savedJobIds,
  onToggleSave,
  onViewJobDetails,
  onTrackJob,
  onBack,
}) => {
  const { user } = useAuth();
  const { t, translateEducation, translateSector } = useLanguage();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedEducation, setSelectedEducation] = useState<string>('All');
  const [selectedJobType, setSelectedJobType] = useState<string>('All');
  const [onlyEligible, setOnlyEligible] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'latest' | 'salary' | 'deadline' | 'vacancies'>('latest');
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  const sectors: string[] = [
    'All',
    'Defense & Aerospace',
    'Civil Services',
    'Staff Selection',
    'Banking & Insurance',
    'Railways',
    'Engineering & Tech PSUs',
    'State PSC',
    'Regulatory Bodies',
    'Police & Paramilitary',
  ];

  const educationLevels: string[] = [
    'All',
    '10th Pass',
    '12th Pass',
    'Diploma',
    'Graduation / Bachelor\'s',
    'B.Tech / B.E.',
    'Post Graduation / Master\'s',
    'LLB / Law',
    'MBBS / Medical',
    'PhD / Doctorate'
  ];

  const jobTypes: string[] = ['All', 'Central', 'State', 'PSU', 'Autonomous'];

  // Filter & Sort Logic
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // 1. Text Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesOrg = job.organization.toLowerCase().includes(q);
        const matchesDept = job.department.toLowerCase().includes(q);
        const matchesLocation = job.location.toLowerCase().includes(q);
        const matchesDegree = job.degreesAllowed.some(d => d.toLowerCase().includes(q));
        const matchesKeywords = job.tags?.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesOrg && !matchesDept && !matchesLocation && !matchesDegree && !matchesKeywords) {
          return false;
        }
      }

      // 2. Sector Filter
      if (selectedSector !== 'All' && job.sector !== selectedSector) {
        return false;
      }

      // 3. Education Filter
      if (selectedEducation !== 'All') {
        const matchesEducation = job.degreesAllowed.some(d => 
          d.toLowerCase().includes(selectedEducation.toLowerCase()) ||
          (selectedEducation.includes('B.Tech') && (d.includes('B.Tech') || d.includes('B.E.')))
        );
        if (!matchesEducation) return false;
      }

      // 4. Job Type Filter
      if (selectedJobType !== 'All' && job.jobType !== selectedJobType) {
        return false;
      }

      // 5. Only Eligible Filter
      if (onlyEligible && user?.profile) {
        const evalResult = evaluateJobEligibility(job, user.profile);
        if (evalResult.status === 'not_eligible') {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'salary') {
        return b.salary.max - a.salary.max;
      }
      if (sortBy === 'vacancies') {
        return b.vacancies - a.vacancies;
      }
      if (sortBy === 'deadline') {
        return new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime();
      }
      // default: latest (created date or ID)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [jobs, searchQuery, selectedSector, selectedEducation, selectedJobType, onlyEligible, sortBy, user]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedSector('All');
    setSelectedEducation('All');
    setSelectedJobType('All');
    setOnlyEligible(false);
    setSortBy('latest');
  };

  const hasActiveFilters = searchQuery || selectedSector !== 'All' || selectedEducation !== 'All' || selectedJobType !== 'All' || onlyEligible;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          {onBack && (
            <button
              id="btn-job-search-back"
              onClick={onBack}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm group mt-0.5"
              title="Go back"
            >
              <ArrowLeft className="w-4 h-4 text-blue-400 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t('jobs.exploreTitle', 'Explore Government Jobs')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {t('jobs.exploreSubtitle', 'Search verified recruitment notifications for 10th, 12th, Diploma, Degree, B.Tech, Master\'s and PhD across Central Ministries, PSUs, and State PSCs.')}
            </p>
          </div>
        </div>

        {/* Quick count badge */}
        <div className="text-xs bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-full text-slate-300 font-medium">
          {t('jobs.showing', 'Showing')} <strong className="text-blue-400 font-bold">{filteredJobs.length}</strong> {t('jobs.of', 'of')} {jobs.length} {t('jobs.opportunities', 'Opportunities')}
        </div>
      </div>

      {/* Main Search Bar & Quick Filters */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              id="job-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('jobs.searchBoxPlaceholder', 'Search 10th, 12th, Diploma, SSC, UPSC, Railways, Postal, Banking...')}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-48">
              <select
                id="select-sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-3.5 py-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-medium appearance-none cursor-pointer"
              >
                <option value="latest">{t('jobs.sortLatest', 'Sort: Latest Added')}</option>
                <option value="salary">{t('jobs.sortSalary', 'Sort: Highest Salary')}</option>
                <option value="vacancies">{t('jobs.sortVacancies', 'Sort: Most Vacancies')}</option>
                <option value="deadline">{t('jobs.sortDeadline', 'Sort: Closing Soonest')}</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-4 pointer-events-none" />
            </div>

            {/* Mobile Filter Toggle */}
            <button
              id="btn-toggle-filters-mobile"
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="md:hidden p-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex-shrink-0"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Filter Bar (Desktop + Toggled Mobile) */}
        <div className={`pt-3 border-t border-slate-800/80 ${showFiltersMobile ? 'block' : 'hidden md:block'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Sector Dropdown */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                {t('jobs.filterSector', 'Recruitment Sector')}
              </label>
              <select
                id="filter-sector"
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {sectors.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec === 'All' ? t('jobs.allSectors', 'All Sectors') : translateSector(sec)}
                  </option>
                ))}
              </select>
            </div>

            {/* Education Qualification Dropdown */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                {t('jobs.filterEdu', 'Required Qualification')}
              </label>
              <select
                id="filter-education"
                value={selectedEducation}
                onChange={(e) => setSelectedEducation(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {educationLevels.map((edu) => (
                  <option key={edu} value={edu}>
                    {edu === 'All' ? t('jobs.allEdu', 'All Qualifications (10th to Higher)') : translateEducation(edu)}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Type Dropdown */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                {t('jobs.filterCadre', 'Cadre / Job Type')}
              </label>
              <select
                id="filter-job-type"
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === 'All' ? t('jobs.allTypes', 'All Types') : type}
                  </option>
                ))}
              </select>
            </div>

            {/* Only Eligible Switch */}
            <div className="flex flex-col justify-end">
              <label 
                id="label-toggle-only-eligible"
                className={`flex items-center justify-between px-3.5 py-2 rounded-xl border cursor-pointer transition-all ${
                  onlyEligible
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${onlyEligible ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="text-xs font-semibold">{t('jobs.onlyEligible', 'Only Jobs I\'m Eligible For')}</span>
                </div>
                <input
                  type="checkbox"
                  checked={onlyEligible}
                  onChange={(e) => setOnlyEligible(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Active Filters Row */}
        {hasActiveFilters && (
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">{t('jobs.activeFilters', 'Active filters:')}</span>
            {searchQuery && (
              <span className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5">
                Query: "{searchQuery}"
                <button onClick={() => setSearchQuery('')}><X className="w-3 h-3 text-slate-400 hover:text-white" /></button>
              </span>
            )}
            {selectedSector !== 'All' && (
              <span className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5">
                Sector: {translateSector(selectedSector)}
                <button onClick={() => setSelectedSector('All')}><X className="w-3 h-3 text-slate-400 hover:text-white" /></button>
              </span>
            )}
            {selectedEducation !== 'All' && (
              <span className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5">
                Education: {translateEducation(selectedEducation)}
                <button onClick={() => setSelectedEducation('All')}><X className="w-3 h-3 text-slate-400 hover:text-white" /></button>
              </span>
            )}
            {selectedJobType !== 'All' && (
              <span className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5">
                Type: {selectedJobType}
                <button onClick={() => setSelectedJobType('All')}><X className="w-3 h-3 text-slate-400 hover:text-white" /></button>
              </span>
            )}
            {onlyEligible && (
              <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/40 flex items-center gap-1.5 font-medium">
                {t('jobs.onlyEligible', 'Only Eligible Matches')}
                <button onClick={() => setOnlyEligible(false)}><X className="w-3 h-3 text-emerald-300 hover:text-white" /></button>
              </span>
            )}

            <button
              id="btn-clear-all-filters"
              onClick={clearAllFilters}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('jobs.resetAll', 'Reset all')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Jobs Results Grid */}
      {filteredJobs.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">{t('jobs.noJobsFound', 'No Government Vacancies Found')}</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {t('jobs.noJobsDesc', 'No vacancies match your current combination of keyword, sector, and eligibility filters. Try clearing some criteria.')}
          </p>
          <button
            onClick={clearAllFilters}
            className="mt-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
          >
            {t('jobs.resetAll', 'Clear All Filters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map((job) => {
            const isSaved = savedJobIds.includes(job.id);
            const eligibility = user ? evaluateJobEligibility(job, user.profile) : undefined;
            return (
              <JobCard
                key={job.id}
                job={job}
                eligibility={eligibility}
                isSaved={isSaved}
                onToggleSave={onToggleSave}
                onViewDetails={onViewJobDetails}
                onQuickTrack={onTrackJob}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
