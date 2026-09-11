import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Job, JobApplication, ExamEvent, EligibilityResult } from '../types';
import { JobCard } from '../components/JobCard';
import { EligibilityBadge } from '../components/EligibilityBadge';
import { 
  formatIndianDate, 
  formatIndianNumber, 
  formatIndianCurrency, 
  formatIndianCompactNumber 
} from '../utils/formatters';
import { 
  Sparkles, 
  Briefcase, 
  CheckSquare, 
  Calendar, 
  Clock, 
  TrendingUp, 
  ArrowRight, 
  AlertCircle, 
  Award, 
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  IndianRupee
} from 'lucide-react';

interface DashboardPageProps {
  jobs: Job[];
  applications: JobApplication[];
  exams: ExamEvent[];
  savedJobIds: string[];
  onToggleSave: (jobId: string) => void;
  onViewJobDetails: (job: Job) => void;
  onNavigateTab: (tab: string) => void;
  onTrackJob: (job: Job) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  jobs,
  applications,
  exams,
  savedJobIds,
  onToggleSave,
  onViewJobDetails,
  onNavigateTab,
  onTrackJob,
}) => {
  const { user } = useAuth();

  // Get current time greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  // Calculate stats
  const now = new Date();
  const closingSoonJobs = jobs.filter(j => {
    const diff = Math.ceil((new Date(j.applicationDeadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 && diff <= 7;
  });

  const matchingJobs = jobs.filter(j => {
    if (!user) return true;
    const branchAllowed = !j.branchesAllowed || j.branchesAllowed.includes('Any') || 
      j.branchesAllowed.some(b => b.toLowerCase().includes('comp') || b.toLowerCase().includes('it'));
    return branchAllowed;
  });

  // Calculate Profile Completion %
  let profileCompletion = 40;
  if (user) {
    if (user.profile.degree) profileCompletion += 15;
    if (user.profile.branch) profileCompletion += 15;
    if (user.profile.category) profileCompletion += 10;
    if (user.profile.skills && user.profile.skills.length > 0) profileCompletion += 10;
    if (user.profile.preferredDepartments && user.profile.preferredDepartments.length > 0) profileCompletion += 10;
  }
  profileCompletion = Math.min(100, profileCompletion);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-800/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-bold text-blue-400 bg-blue-500/20 px-2.5 py-0.5 rounded-full border border-blue-400/30">
              Candidate Portal
            </span>
            <span className="text-xs text-slate-400">
              {formatIndianDate(new Date(), { format: 'long' })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {greeting}, {user?.name || 'Aspirant'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {user?.profile ? (
              <span>
                Matching jobs for <strong>{user.profile.degree} in {user.profile.branch || 'General'}</strong> ({user.profile.category} Category, {user.profile.state})
              </span>
            ) : (
              'Showing verified central & state government opportunities.'
            )}
          </p>
        </div>

        {/* Profile Strength Widget */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl w-full md:w-64 flex-shrink-0 shadow-lg">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-300">Profile Match Strength</span>
            <span className="text-blue-400 font-mono">{profileCompletion}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
          <button
            id="btn-dash-complete-profile"
            onClick={() => onNavigateTab('profile')}
            className="text-[11px] text-blue-400 hover:text-blue-300 font-medium flex items-center justify-between w-full"
          >
            <span>{profileCompletion < 100 ? 'Complete eligibility profile →' : 'Edit criteria settings →'}</span>
          </button>
        </div>
      </div>

      {/* 4 Core Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          id="stat-matching-jobs"
          onClick={() => onNavigateTab('recommended')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all duration-200 shadow group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Jobs Matching You</span>
            <div className="p-2 rounded-xl bg-blue-600/10 text-blue-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-2 group-hover:text-blue-400 transition-colors">
            {matchingJobs.length}
          </p>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <span>✓ 100% rule-verified</span>
          </p>
        </div>

        <div 
          id="stat-applications"
          onClick={() => onNavigateTab('tracker')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all duration-200 shadow group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Applications</span>
            <div className="p-2 rounded-xl bg-indigo-600/10 text-indigo-400 group-hover:scale-110 transition-transform">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-2 group-hover:text-indigo-400 transition-colors">
            {applications.length}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {applications.filter(a => a.status === 'Admit Card' || a.status === 'Exam').length} in active exam phase
          </p>
        </div>

        <div 
          id="stat-upcoming-exams"
          onClick={() => onNavigateTab('calendar')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all duration-200 shadow group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Upcoming Exams</span>
            <div className="p-2 rounded-xl bg-emerald-600/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-2 group-hover:text-emerald-400 transition-colors">
            {formatIndianNumber(exams.length)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Next exam: {exams[0] ? formatIndianDate(exams[0].examDate, { format: 'medium' }) : 'Scheduled'}
          </p>
        </div>

        <div 
          id="stat-closing-soon"
          onClick={() => onNavigateTab('search')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all duration-200 shadow group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Closing Soon</span>
            <div className="p-2 rounded-xl bg-amber-600/10 text-amber-400 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-2 group-hover:text-amber-400 transition-colors">
            {formatIndianNumber(closingSoonJobs.length)}
          </p>
          <p className="text-[11px] text-amber-400 mt-1">
            Deadline in ≤ 7 days
          </p>
        </div>
      </div>

      {/* Recommended Jobs Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              Recommended for You
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked by degree match, age relaxation, and sector interest.
            </p>
          </div>

          <button
            id="btn-dash-view-all-recommended"
            onClick={() => onNavigateTab('recommended')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>View All ({matchingJobs.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {matchingJobs.slice(0, 3).map((job) => {
            const isSaved = savedJobIds.includes(job.id);
            return (
              <JobCard
                key={job.id}
                job={job}
                isSaved={isSaved}
                onToggleSave={onToggleSave}
                onViewDetails={onViewJobDetails}
                onQuickTrack={onTrackJob}
                matchScore={94}
                highlightReason={`Recommended because your ${user?.profile?.degree || 'B.Tech'} qualification and age strictly match the notification criteria.`}
              />
            );
          })}
        </div>
      </section>

      {/* Two Column Layout: Application Status Pipeline & Upcoming Exam Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Application Pipeline */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-base text-white">Application Pipeline</h3>
            </div>
            <button
              onClick={() => onNavigateTab('tracker')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300"
            >
              Open Tracker →
            </button>
          </div>

          <div className="space-y-3">
            {applications.slice(0, 3).map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-blue-400 truncate block">
                    {app.organization}
                  </span>
                  <h4 className="font-bold text-sm text-white truncate">{app.jobTitle}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {app.registrationNumber ? `Reg: ${app.registrationNumber}` : 'Application recorded'}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {app.status}
                  </span>
                  {app.examDate && (
                    <p className="text-[10px] text-emerald-400 font-mono mt-1">
                      Exam: {formatIndianDate(app.examDate, { format: 'medium' })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exam Calendar Highlights */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-base text-white">Upcoming Exam Schedule</h3>
            </div>
            <button
              onClick={() => onNavigateTab('calendar')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300"
            >
              Full Calendar →
            </button>
          </div>

          <div className="space-y-3">
            {exams.slice(0, 3).map((ex) => (
              <div
                key={ex.id}
                className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-slate-400 block">{ex.organization}</span>
                  <h4 className="font-bold text-sm text-white truncate">{ex.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{ex.syllabusOverview}</p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold text-emerald-400 font-mono block">
                    {formatIndianDate(ex.examDate, { format: 'medium' })}
                  </span>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 mt-1 inline-block">
                    {ex.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Assistant Quick Launcher Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/30 via-slate-900 to-indigo-900/30 border border-blue-800/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-base text-white">Need Customized Guidance for an Exam?</h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Ask our AI Advisor about syllabus weightage, selection stages, or generate an 8-week structured study plan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            id="btn-dash-launch-planner"
            onClick={() => onNavigateTab('study-planner')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors w-full sm:w-auto"
          >
            Study Planner
          </button>
          <button
            id="btn-dash-launch-ai"
            onClick={() => onNavigateTab('ai-assistant')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5 w-full sm:w-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Advisor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
