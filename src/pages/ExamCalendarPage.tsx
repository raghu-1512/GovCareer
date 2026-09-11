import React, { useState } from 'react';
import { ExamEvent } from '../types';
import { formatIndianDate, formatIndianNumber } from '../utils/formatters';
import { calculateDaysRemaining } from '../utils/deadlineAlertEngine';
import { 
  Calendar as CalendarIcon, 
  Search, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  Building2, 
  Bookmark, 
  CheckCircle2, 
  ChevronRight, 
  BookOpen,
  ArrowLeft,
  Flame,
  BellRing,
  AlertTriangle,
  ShieldAlert
} from 'lucide-react';

interface ExamCalendarPageProps {
  exams: ExamEvent[];
  onToggleSaveExam: (id: string) => void;
  onLaunchStudyPlan: (examName: string) => void;
  onBack?: () => void;
  onTriggerDeadlineScan?: () => void;
}

export const ExamCalendarPage: React.FC<ExamCalendarPageProps> = ({
  exams,
  onToggleSaveExam,
  onLaunchStudyPlan,
  onBack,
  onTriggerDeadlineScan,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlySaved, setOnlySaved] = useState(false);

  const categories = ['All', '7-Day Deadlines 🚨', 'UPSC', 'Staff Selection', 'Engineering & Research', 'Banking', 'Railways', 'State PSC', 'Regulatory'];

  // Check how many saved exams have deadlines within 7 days
  const urgentSavedExams = exams.filter((e) => {
    if (!e.isSaved) return false;
    const appDays = calculateDaysRemaining(e.applicationDeadline);
    const examDays = calculateDaysRemaining(e.examDate);
    return (appDays >= 0 && appDays <= 7) || (examDays >= 0 && examDays <= 7);
  });

  const filteredExams = exams.filter((e) => {
    if (onlySaved && !e.isSaved) return false;

    if (selectedCategory === '7-Day Deadlines 🚨') {
      const appDays = calculateDaysRemaining(e.applicationDeadline);
      const examDays = calculateDaysRemaining(e.examDate);
      const isUrgent = (appDays >= 0 && appDays <= 7) || (examDays >= 0 && examDays <= 7);
      if (!isUrgent) return false;
    } else if (selectedCategory !== 'All' && e.category !== selectedCategory) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return e.title.toLowerCase().includes(q) || e.organization.toLowerCase().includes(q) || e.syllabusOverview.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-blue-950/40 border border-indigo-800/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            {onBack && (
              <button
                id="btn-calendar-back"
                onClick={onBack}
                className="p-1.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm group"
                title="Go back"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-indigo-400 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              <CalendarIcon className="w-3.5 h-3.5" />
              National Government Exam Schedule
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            2026 Examination Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Track official application deadlines, admit card releases, and exam dates across Central, State PSC, SSC, and Banking bodies with automatic 7-day alert prompts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onTriggerDeadlineScan && (
            <button
              onClick={onTriggerDeadlineScan}
              className="px-3.5 py-2 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="Scan all saved exams for deadlines within 7 days"
            >
              <BellRing className="w-4 h-4 text-amber-400" />
              <span>Trigger 7-Day Scan</span>
            </button>
          )}

          <div className="text-xs bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl text-slate-300">
            <strong className="text-indigo-400 font-bold font-mono">{formatIndianNumber(filteredExams.length)}</strong> Confirmed Dates
          </div>
        </div>
      </div>

      {/* Urgent Saved Exam Deadline Notification Callout */}
      {urgentSavedExams.length > 0 && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-rose-950/60 border border-amber-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-white">
                  🚨 {urgentSavedExams.length} Saved Exam{urgentSavedExams.length > 1 ? 's' : ''} with Deadlines Within 7 Days
                </h3>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {urgentSavedExams.map(e => e.title).join(', ')} application window is closing soon.
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedCategory('7-Day Deadlines 🚨')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow shrink-0"
          >
            Filter 7-Day Deadlines
          </button>
        </div>
      )}

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exam (e.g. UPSC Prelims, ISRO ICRB, SSC CGL Tier-1)..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setOnlySaved(!onlySaved)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              onlySaved
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${onlySaved ? 'fill-white' : ''}`} />
            <span>Saved Only</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? cat.includes('7-Day')
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'bg-indigo-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Exam Events List */}
      <div className="space-y-4">
        {filteredExams.length === 0 ? (
          <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-sm">
            No exams match your selected filters.
          </div>
        ) : (
          filteredExams.map((exam) => {
            const exDate = new Date(exam.examDate);
            const daysToExam = calculateDaysRemaining(exam.examDate);
            const daysToAppDeadline = calculateDaysRemaining(exam.applicationDeadline);
            const isDeadlineWithin7Days = daysToAppDeadline >= 0 && daysToAppDeadline <= 7;

            return (
              <div
                key={exam.id}
                id={`exam-event-${exam.id}`}
                className={`p-5 sm:p-6 rounded-3xl border transition-all shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-5 group ${
                  isDeadlineWithin7Days
                    ? 'bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border-amber-500/40 hover:border-amber-500'
                    : 'bg-slate-900 border-slate-800 hover:border-indigo-500/40'
                }`}
              >
                {/* Left Date Block */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className={`w-16 h-16 rounded-2xl border flex flex-col items-center justify-center text-center flex-shrink-0 shadow-inner ${
                    isDeadlineWithin7Days
                      ? 'bg-amber-950/60 border-amber-500/50'
                      : 'bg-gradient-to-br from-indigo-950 to-slate-900 border-indigo-800/60'
                  }`}>
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${
                      isDeadlineWithin7Days ? 'text-amber-400' : 'text-indigo-400'
                    }`}>
                      {exDate.toLocaleDateString(undefined, { month: 'short' })}
                    </span>
                    <span className="text-xl font-black text-white font-mono leading-none mt-0.5">
                      {exDate.getDate()}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">
                      {exDate.getFullYear()}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-indigo-400">
                        {exam.organization}
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                        {exam.category}
                      </span>
                      
                      {/* Application Deadline Countdown */}
                      {daysToAppDeadline >= 0 ? (
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                          daysToAppDeadline <= 2
                            ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                            : daysToAppDeadline <= 7
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          <Clock className="w-3 h-3" />
                          Apply Deadline: {daysToAppDeadline === 0 ? 'TODAY!' : `${daysToAppDeadline} Days Left`} ({formatIndianDate(exam.applicationDeadline)})
                        </span>
                      ) : (
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                          Application Closed
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-base text-white mt-1 group-hover:text-indigo-300 transition-colors">
                      {exam.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {exam.syllabusOverview}
                    </p>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2.5 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-800 shrink-0">
                  <button
                    id={`btn-exam-save-${exam.id}`}
                    onClick={() => onToggleSaveExam(exam.id)}
                    className={`p-2.5 rounded-xl border transition-all ${
                      exam.isSaved
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                    title={exam.isSaved ? 'Bookmarked' : 'Bookmark Exam'}
                  >
                    <Bookmark className={`w-4 h-4 ${exam.isSaved ? 'fill-indigo-400' : ''}`} />
                  </button>

                  <a
                    href={exam.officialUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <span>Apply / Notice</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>

                  <button
                    id={`btn-exam-plan-${exam.id}`}
                    onClick={() => onLaunchStudyPlan(exam.title)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/25 flex items-center gap-1.5 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Study Plan</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
