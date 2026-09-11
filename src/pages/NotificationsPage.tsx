import React, { useState, useEffect } from 'react';
import { NotificationItem } from '../types';
import { 
  Bell, 
  CheckCheck, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  ExternalLink, 
  ArrowLeft,
  Smartphone,
  Radio,
  Send,
  CheckCircle2,
  XCircle,
  Sparkles
} from 'lucide-react';
import { 
  getPushSubscriptionStatus, 
  subscribeToPushNotifications, 
  unsubscribeFromPushNotifications, 
  sendTestPushAlert,
  PushStatus 
} from '../utils/pushNotificationService';
import { useAuth } from '../context/AuthContext';

interface NotificationsPageProps {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onViewJobById?: (jobId: string) => void;
  onBack?: () => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onViewJobById,
  onBack,
}) => {
  const { user } = useAuth();
  const unreadCount = notifications.filter(n => !n.read).length;

  const [pushStatus, setPushStatus] = useState<PushStatus>({
    isSupported: false,
    permission: 'default',
    isSubscribed: false,
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const status = await getPushSubscriptionStatus();
    setPushStatus(status);
  };

  const handleSubscribe = async () => {
    setLoading(true);
    setStatusMessage(null);
    const res = await subscribeToPushNotifications(user?.id);
    await checkStatus();
    setStatusMessage(res.message);
    setLoading(false);
  };

  const handleUnsubscribe = async () => {
    setLoading(true);
    setStatusMessage(null);
    const res = await unsubscribeFromPushNotifications();
    await checkStatus();
    setStatusMessage(res.message);
    setLoading(false);
  };

  const handleTestPush = async () => {
    setLoading(true);
    setStatusMessage(null);
    const res = await sendTestPushAlert();
    setStatusMessage(res.message);
    setLoading(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          {onBack && (
            <button
              id="btn-notif-back"
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
              <Bell className="w-6 h-6 text-blue-400" />
              <span>Recruitment Alerts & Bulletins</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real-time updates regarding official deadline alerts, admit card releases, and newly published vacancies.
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            id="btn-mark-all-read-page"
            onClick={onMarkAllRead}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Browser & Mobile Web Push Notification Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/50 via-slate-900 to-blue-950/50 border border-indigo-800/40 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-base text-white">
                  Real-Time Browser & Mobile Push Alerts
                </h3>
                {pushStatus.isSubscribed ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Push Active
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase">
                    Not Subscribed
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Get native lockscreen notifications on your phone or desktop the second an administrator or national portal publishes a new vacancy or admit card.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
            {!pushStatus.isSubscribed ? (
              <button
                id="btn-enable-push-notifs"
                disabled={loading}
                onClick={handleSubscribe}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Smartphone className="w-4 h-4" />
                <span>{loading ? 'Registering...' : 'Enable Instant Push Alerts'}</span>
              </button>
            ) : (
              <>
                <button
                  id="btn-test-push-notif"
                  disabled={loading}
                  onClick={handleTestPush}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-blue-400" />
                  <span>Send Test Alert</span>
                </button>
                <button
                  id="btn-disable-push-notifs"
                  disabled={loading}
                  onClick={handleUnsubscribe}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-red-950/40 text-slate-400 hover:text-red-300 text-xs font-semibold border border-slate-800 transition-colors"
                >
                  Disable
                </button>
              </>
            )}
          </div>
        </div>

        {statusMessage && (
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-indigo-800/40 text-xs text-indigo-200 flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-sm">
            No notifications available.
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onMarkRead(item.id);
                if (item.jobId && onViewJobById) {
                  onViewJobById(item.jobId);
                }
              }}
              className={`p-5 rounded-3xl border transition-all cursor-pointer shadow flex items-start justify-between gap-4 ${
                item.read
                  ? 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900'
                  : item.type === 'deadline'
                  ? 'bg-gradient-to-r from-amber-950/30 to-slate-900 border-amber-600/50 text-slate-200 hover:border-amber-500'
                  : 'bg-gradient-to-r from-blue-950/40 to-slate-900 border-blue-800/60 text-slate-200 hover:border-blue-700'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-2xl mt-0.5 ${
                  item.type === 'deadline'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : item.type === 'admit_card'
                    ? 'bg-indigo-500/10 text-indigo-400'
                    : item.type === 'result'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-blue-500/10 text-blue-400'
                }`}>
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`font-bold text-sm ${item.type === 'deadline' ? 'text-amber-200' : 'text-white'}`}>
                      {item.title}
                    </h3>
                    {!item.read && (
                      <span className={`w-2 h-2 rounded-full ${item.type === 'deadline' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.message}</p>
                  <p className="text-[11px] text-slate-500 mt-2 font-mono">
                    {new Date(item.date).toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {item.jobId && (
                <span className="text-xs text-blue-400 hover:underline flex items-center gap-1 flex-shrink-0">
                  <span>View Vacancy</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
