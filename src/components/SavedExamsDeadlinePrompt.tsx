import React, { useState, useEffect } from 'react';
import { UrgentDeadlineAlert } from '../utils/deadlineAlertEngine';
import { formatIndianDate } from '../utils/formatters';
import { 
  AlertTriangle, 
  Clock, 
  ExternalLink, 
  Sparkles, 
  X, 
  BellRing, 
  CheckCircle2, 
  ChevronRight, 
  Calendar, 
  ShieldAlert,
  Flame,
  Volume2
} from 'lucide-react';

interface SavedExamsDeadlinePromptProps {
  alerts: UrgentDeadlineAlert[];
  onLaunchStudyPlan: (examName: string) => void;
  onViewJobById?: (jobId: string) => void;
  onNavigateToCalendar?: () => void;
}

export const SavedExamsDeadlinePrompt: React.FC<SavedExamsDeadlinePromptProps> = ({
  alerts,
  onLaunchStudyPlan,
  onViewJobById,
  onNavigateToCalendar,
}) => {
  const [dismissed, setDismissed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pushStatus, setPushStatus] = useState<'default' | 'granted' | 'denied'>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPushStatus(Notification.permission);
    }
  }, []);

  // Request browser push notification permission
  const handleRequestPushPermission = async () => {
    if (!('Notification' in window)) {
      alert('Browser notifications are not supported in this browser.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPushStatus(permission);
      if (permission === 'granted') {
        const topAlert = alerts[0];
        if (topAlert) {
          new Notification(`🚨 Urgent: ${topAlert.title}`, {
            body: `Deadline in ${topAlert.daysRemaining} days (${formatIndianDate(topAlert.deadlineDate)}). Tap to complete your application.`,
            icon: '/icon-192.png',
          });
        }
      }
    } catch (err) {
      console.warn('Push permission request failed:', err);
    }
  };

  if (alerts.length === 0 || dismissed) {
    return null;
  }

  const primaryAlert = alerts[0]; // The most urgent deadline

  const getUrgencyBadge = (days: number) => {
    if (days === 0) {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-red-600/30 text-red-300 border border-red-500/50 text-[11px] font-extrabold animate-pulse flex items-center gap-1">
          <Flame className="w-3 h-3 text-red-400" />
          CLOSES TODAY!
        </span>
      );
    }
    if (days === 1) {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-300 border border-amber-500/50 text-[11px] font-extrabold animate-pulse flex items-center gap-1">
          <Clock className="w-3 h-3 text-amber-400" />
          CLOSES TOMORROW!
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1">
        <Clock className="w-3 h-3 text-amber-400" />
        {days} Days Remaining
      </span>
    );
  };

  return (
    <>
      {/* High-Visibility Sticky Top Prompt Banner */}
      <div className="relative z-30 bg-gradient-to-r from-amber-950/80 via-slate-900 to-rose-950/80 border-y border-amber-500/40 px-4 py-3 shadow-2xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          {/* Left: Icon & Alert Message */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/10">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                  ⚡ 7-Day Deadline Trigger
                </span>
                {getUrgencyBadge(primaryAlert.daysRemaining)}
                {alerts.length > 1 && (
                  <span className="text-[11px] font-medium text-slate-300">
                    (+{alerts.length - 1} other saved exam{alerts.length > 2 ? 's' : ''})
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                <span className="text-amber-200">{primaryAlert.title}</span>
                <span className="text-slate-300 font-normal"> — {primaryAlert.deadlineTypeLabel} on {formatIndianDate(primaryAlert.deadlineDate)}</span>
              </p>
            </div>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
            {primaryAlert.officialUrl && (
              <a
                href={primaryAlert.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0"
              >
                <span>Official Apply Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={() => onLaunchStudyPlan(primaryAlert.title)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all border border-indigo-400/40 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>7-Day Prep Plan</span>
            </button>

            <button
              onClick={() => setModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1 transition-all shrink-0"
            >
              <span>View All ({alerts.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Dismiss prompt for this session"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Urgent Deadlines Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-white">
                      Saved Exam Deadline Alerts
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-black">
                      {alerts.length} Within 7 Days
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Action required! The following bookmarked recruitment applications and exams are closing within the next 7 days.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Permission Banner if not granted */}
            {pushStatus !== 'granted' && (
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <BellRing className="w-5 h-5 text-indigo-400 shrink-0" />
                  <p className="text-xs text-indigo-200">
                    Enable browser deadline push prompts to get alerted even when GovCareer is closed.
                  </p>
                </div>
                <button
                  onClick={handleRequestPushPermission}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 transition-colors shadow"
                >
                  Enable Alerts
                </button>
              </div>
            )}

            {/* List of Alerts */}
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    alert.daysRemaining <= 2
                      ? 'bg-red-950/20 border-red-800/50 shadow-lg shadow-red-950/20'
                      : 'bg-slate-950/50 border-amber-800/40'
                  }`}
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                        {alert.organization}
                      </span>
                      {getUrgencyBadge(alert.daysRemaining)}
                    </div>
                    <h3 className="text-sm font-bold text-white truncate">
                      {alert.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-slate-300">
                      <span className="flex items-center gap-1 text-amber-300 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        {alert.deadlineTypeLabel}: {formatIndianDate(alert.deadlineDate)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                    {alert.officialUrl && (
                      <a
                        href={alert.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow"
                      >
                        <span>Apply Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <button
                      onClick={() => {
                        setModalOpen(false);
                        onLaunchStudyPlan(alert.title);
                      }}
                      className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                      <span>7-Day Prep</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-400">
              <span>All deadline timestamps verified against official gazette notices.</span>
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
              >
                Close Prompt
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
