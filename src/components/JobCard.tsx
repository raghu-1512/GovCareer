import React from 'react';
import { Job, EligibilityResult } from '../types';
import { EligibilityBadge } from './EligibilityBadge';
import { 
  formatIndianSalaryRange, 
  formatIndianNumber, 
  formatIndianDate, 
  formatIndianRelativeDeadline,
  formatIndianVacancies
} from '../utils/formatters';
import { 
  Building2, 
  MapPin, 
  IndianRupee, 
  Users, 
  Clock, 
  CheckCircle, 
  Bookmark, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface JobCardProps {
  job: Job;
  eligibility?: EligibilityResult;
  isSaved?: boolean;
  onToggleSave?: (jobId: string) => void;
  onViewDetails: (job: Job) => void;
  onQuickTrack?: (job: Job) => void;
  matchScore?: number;
  highlightReason?: string;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  eligibility,
  isSaved = false,
  onToggleSave,
  onViewDetails,
  onQuickTrack,
  matchScore,
  highlightReason,
}) => {
  // Calculate remaining days to deadline
  const today = new Date();
  const deadline = new Date(job.applicationDeadline);
  const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isClosingSoon = diffDays > 0 && diffDays <= 7;
  const isClosed = diffDays < 0;

  return (
    <div 
      id={`job-card-${job.id}`}
      className="group relative bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-2xl p-5 shadow-lg hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-200 flex flex-col justify-between"
    >
      <div>
        {/* Top Header: Organization & Badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center text-blue-400 font-bold text-base flex-shrink-0 group-hover:border-blue-500/40 transition-colors">
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-slate-300 truncate max-w-[200px]">
                  {job.organization}
                </span>
                {job.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Official
                  </span>
                )}
                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                  {job.sector}
                </span>
              </div>
              <h3 
                onClick={() => onViewDetails(job)}
                className="font-bold text-base text-white group-hover:text-blue-400 transition-colors mt-0.5 cursor-pointer line-clamp-1"
              >
                {job.title}
              </h3>
            </div>
          </div>

          {/* Save Button */}
          {onToggleSave && (
            <button
              id={`btn-save-job-${job.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(job.id);
              }}
              className={`p-2 rounded-xl border transition-all ${
                isSaved
                  ? 'bg-blue-600/20 border-blue-500 text-blue-400 hover:bg-blue-600/30'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save job notification'}
              aria-label={isSaved ? 'Saved' : 'Save'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-400' : ''}`} />
            </button>
          )}
        </div>

        {/* Highlight Recommendation Reason if provided */}
        {highlightReason && (
          <div className="mb-3.5 px-3 py-2 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="line-clamp-2 leading-relaxed">{highlightReason}</p>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-3.5 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 bg-slate-800/50 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="truncate font-medium text-emerald-300">
              {formatIndianSalaryRange(job.salary.min, job.salary.max, { payLevel: job.salary.payLevel })}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800/50 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <Users className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            <span className="truncate font-medium">
              <strong className="text-white">{formatIndianVacancies(job.vacancies).formatted}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800/50 px-2.5 py-1.5 rounded-lg border border-slate-800 col-span-2 sm:col-span-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
        </div>

        {/* Qualification & Eligibility Snapshot */}
        <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-400">Required:</span>
            <span className="text-slate-200 font-medium truncate max-w-[240px]">
              {job.degreesAllowed.slice(0, 2).join(', ')} {job.degreesAllowed.length > 2 ? `+${job.degreesAllowed.length - 2} more` : ''}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-400">Age Bracket:</span>
            <span className="text-slate-200 font-medium">
              {job.minAge} - {job.maxAge} Years {job.ageRelaxation ? '(+Cat. Relaxation)' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Footer: Eligibility Status & Action Buttons */}
      <div className="mt-4 pt-3.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
        <div>
          {eligibility ? (
            <EligibilityBadge
              status={eligibility.status}
              score={matchScore || eligibility.score}
              showScore={true}
              onClick={() => onViewDetails(job)}
            />
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {(() => {
                  const rel = formatIndianRelativeDeadline(job.applicationDeadline);
                  if (rel.isExpired) {
                    return <span className="text-rose-400 font-semibold">{rel.text}</span>;
                  }
                  if (rel.isUrgent) {
                    return <span className="text-amber-400 font-semibold">{rel.text}</span>;
                  }
                  return <span>{rel.text}</span>;
                })()}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onQuickTrack && (
            <button
              id={`btn-track-job-${job.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onQuickTrack(job);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-colors"
            >
              Track
            </button>
          )}

          <button
            id={`btn-view-job-details-${job.id}`}
            onClick={() => onViewDetails(job)}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all group-hover:translate-x-0.5"
          >
            <span>View & Apply</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
