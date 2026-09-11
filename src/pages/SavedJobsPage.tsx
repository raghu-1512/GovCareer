import React from 'react';
import { Job, EligibilityResult } from '../types';
import { JobCard } from '../components/JobCard';
import { Bookmark, ArrowRight, Search, ArrowLeft, Clock, AlertTriangle, ExternalLink } from 'lucide-react';
import { evaluateJobEligibility } from '../utils/eligibilityEngine';
import { calculateDaysRemaining } from '../utils/deadlineAlertEngine';
import { formatIndianDate } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

interface SavedJobsPageProps {
  jobs: Job[];
  savedJobIds: string[];
  onToggleSave: (jobId: string) => void;
  onViewJobDetails: (job: Job) => void;
  onTrackJob: (job: Job) => void;
  onExploreJobs: () => void;
  onBack?: () => void;
}

export const SavedJobsPage: React.FC<SavedJobsPageProps> = ({
  jobs,
  savedJobIds,
  onToggleSave,
  onViewJobDetails,
  onTrackJob,
  onExploreJobs,
  onBack,
}) => {
  const { user } = useAuth();
  const savedJobs = jobs.filter((j) => savedJobIds.includes(j.id));

  // Find saved jobs with application deadline within 7 days
  const urgentSavedJobs = savedJobs.filter((j) => {
    const days = calculateDaysRemaining(j.applicationDeadline);
    return days >= 0 && days <= 7;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          {onBack && (
            <button
              id="btn-saved-back"
              onClick={onBack}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm group mt-0.5"
              title="Go back"
            >
              <ArrowLeft className="w-4 h-4 text-blue-400 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Bookmark className="w-6 h-6 text-blue-400 fill-blue-400/20" />
              <span>Saved Government Jobs & Notifications</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Recruitment notifications you have bookmarked with automated 7-day deadline tracking.
            </p>
          </div>
        </div>

        <div className="text-xs bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-full text-slate-300 font-medium">
          <strong className="text-blue-400 font-bold">{savedJobs.length}</strong> Saved Vacancies
        </div>
      </div>

      {/* Urgent 7-Day Deadline Callout */}
      {urgentSavedJobs.length > 0 && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-rose-950/60 border border-amber-500/40 shadow-xl space-y-3">
          <div className="flex items-center gap-2.5 text-amber-400">
            <Clock className="w-5 h-5 animate-pulse" />
            <h3 className="text-sm font-extrabold text-white">
              ⚡ Action Needed: {urgentSavedJobs.length} Saved Vacanc{urgentSavedJobs.length > 1 ? 'ies' : 'y'} Closing Within 7 Days!
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {urgentSavedJobs.map((job) => {
              const days = calculateDaysRemaining(job.applicationDeadline);
              return (
                <div
                  key={job.id}
                  className="p-3.5 rounded-2xl bg-slate-950/60 border border-amber-500/30 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{job.title}</p>
                    <p className="text-[11px] text-amber-300 font-semibold mt-0.5">
                      Deadline: {days === 0 ? 'CLOSES TODAY!' : `${days} Days Left`} ({formatIndianDate(job.applicationDeadline)})
                    </p>
                  </div>
                  <button
                    onClick={() => onViewJobDetails(job)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shrink-0 transition-colors"
                  >
                    View & Apply
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Content */}
      {savedJobs.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">No Saved Jobs Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            When exploring government vacancies, click the bookmark icon on any job card to save it for quick access and automated deadline alerts.
          </p>
          <button
            id="btn-saved-explore-jobs"
            onClick={onExploreJobs}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all inline-flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Explore Active Vacancies</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedJobs.map((job) => {
            const eligibility = user ? evaluateJobEligibility(job, user.profile) : undefined;
            return (
              <JobCard
                key={job.id}
                job={job}
                eligibility={eligibility}
                isSaved={true}
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
