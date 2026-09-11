import React from 'react';
import { Job, EligibilityResult } from '../types';
import { JobCard } from '../components/JobCard';
import { useAuth } from '../context/AuthContext';
import { evaluateJobEligibility } from '../utils/eligibilityEngine';
import { formatIndianNumber } from '../utils/formatters';
import { 
  Sparkles, 
  UserCheck, 
  ShieldCheck, 
  Sliders, 
  ArrowRight,
  TrendingUp,
  Award,
  ArrowLeft
} from 'lucide-react';

interface RecommendedJobsPageProps {
  jobs: Job[];
  savedJobIds: string[];
  onToggleSave: (jobId: string) => void;
  onViewJobDetails: (job: Job) => void;
  onTrackJob: (job: Job) => void;
  onNavigateProfile: () => void;
  onBack?: () => void;
}

export const RecommendedJobsPage: React.FC<RecommendedJobsPageProps> = ({
  jobs,
  savedJobIds,
  onToggleSave,
  onViewJobDetails,
  onTrackJob,
  onNavigateProfile,
  onBack,
}) => {
  const { user } = useAuth();

  // Evaluate each job and sort by match score
  const recommendedList = jobs.map((job) => {
    const eligibility = user ? evaluateJobEligibility(job, user.profile) : {
      status: 'eligible' as const,
      isEligible: true,
      score: 85,
      reason: 'General match for your profile',
      checks: []
    };

    // Calculate match score
    let score = eligibility.score;
    let highlight = '';

    if (user?.profile) {
      if (job.degreesAllowed.some(d => d.toLowerCase().includes((user.profile.degree || '').toLowerCase()))) {
        score += 5;
        highlight = `Direct match for your ${user.profile.degree} degree in ${job.sector}.`;
      }
      if (user.profile.preferredDepartments?.includes(job.sector)) {
        score += 5;
        highlight = `Matches your preferred career sector (${job.sector}).`;
      }
    }
    score = Math.min(99, Math.max(40, score));

    return {
      job,
      eligibility,
      score,
      highlight: highlight || eligibility.reason,
    };
  })
  .filter(item => item.eligibility.status !== 'not_eligible')
  .sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-blue-950/40 border border-emerald-800/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            {onBack && (
              <button
                id="btn-rec-back"
                onClick={onBack}
                className="p-1.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm group"
                title="Go back"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-emerald-400 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Automated Eligibility Matching
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Matching Government Careers
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            These jobs have been filtered through our rule engine to verify qualification, age limits with reservation relaxation, and state eligibility.
          </p>
        </div>

        {/* Profile Settings CTA */}
        <button
          id="btn-rec-tune-profile"
          onClick={onNavigateProfile}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors flex-shrink-0"
        >
          <Sliders className="w-4 h-4 text-blue-400" />
          <span>Tune Eligibility Criteria</span>
        </button>
      </div>

      {/* Matching summary pill banner */}
      {user && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-slate-400">Current Filters:</span>
            <span className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-slate-200">
              🎓 {user.profile.educationLevel} ({user.profile.degree})
            </span>
            <span className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-slate-200">
              🏛️ {user.profile.category} Category
            </span>
            <span className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-slate-200">
              📍 {user.profile.state}
            </span>
          </div>
          <span className="text-emerald-400 font-semibold font-mono">
            {formatIndianNumber(recommendedList.length)} Qualified Vacancies
          </span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {recommendedList.map(({ job, eligibility, score, highlight }) => {
          const isSaved = savedJobIds.includes(job.id);
          return (
            <JobCard
              key={job.id}
              job={job}
              eligibility={eligibility}
              isSaved={isSaved}
              onToggleSave={onToggleSave}
              onViewDetails={onViewJobDetails}
              onQuickTrack={onTrackJob}
              matchScore={score}
              highlightReason={highlight}
            />
          );
        })}
      </div>
    </div>
  );
};
