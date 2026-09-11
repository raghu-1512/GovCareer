import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard,
  Search,
  Sparkles,
  Bookmark,
  CheckSquare,
  Calendar,
  GraduationCap,
  Bell,
  User,
  ShieldCheck,
  Globe,
  Sliders,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  savedCount?: number;
  unreadNotifsCount?: number;
  activeAppsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  onCloseMobile,
  savedCount = 0,
  unreadNotifsCount = 0,
  activeAppsCount = 0,
}) => {
  const { user } = useAuth();
  const { language, t, translateEducation, translateCategory } = useLanguage();

  const mainNavItems = [
    { id: 'dashboard', label: t('nav.dashboard', 'Dashboard'), icon: LayoutDashboard },
    { id: 'search', label: t('nav.exploreJobs', 'Explore Jobs'), icon: Search, badge: language === 'te' ? '12+ కొత్తవి' : '12+ New' },
    { id: 'recommended', label: t('nav.matchingJobs', 'Matching Jobs'), icon: Sparkles, badgeColor: 'bg-emerald-500/20 text-emerald-300' },
    { id: 'tracker', label: t('nav.tracker', 'Application Tracker'), icon: CheckSquare, count: activeAppsCount },
    { id: 'saved', label: t('nav.savedJobs', 'Saved Jobs'), icon: Bookmark, count: savedCount },
    { id: 'calendar', label: t('nav.examCalendar', 'Exam Calendar'), icon: Calendar },
  ];

  const aiNavItems = [
    { id: 'ai-assistant', label: t('nav.aiAdvisor', 'AI Career Advisor'), icon: Sparkles, highlight: true },
    { id: 'study-planner', label: t('nav.studyPlanner', 'AI Study Planner'), icon: GraduationCap },
  ];

  const systemNavItems = [
    { id: 'notifications', label: t('nav.recruitmentAlerts', 'Recruitment Alerts'), icon: Bell, count: unreadNotifsCount },
    { id: 'profile', label: t('nav.myProfile', 'Eligibility Profile & Settings'), icon: User },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-200 ease-in-out overflow-y-auto ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 flex flex-col h-full justify-between">
          <div className="space-y-6">
            {/* User Mini Card in Sidebar */}
            {user && (
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-sm flex items-center justify-center shadow">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-blue-400 truncate">
                      {translateEducation(user.profile.educationLevel || 'Graduation / Bachelor\'s')}
                    </p>
                  </div>
                </div>
                <div className="mt-2.5 pt-2.5 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{language === 'te' ? 'కేటగిరీ:' : 'Category:'} <strong className="text-slate-200">{translateCategory(user.profile.category)}</strong></span>
                  <span>{language === 'te' ? 'శాఖ:' : 'Branch:'} <strong className="text-slate-200">{user.profile.branch ? user.profile.branch.split(' ')[0] : 'General'}</strong></span>
                </div>
              </div>
            )}

            {/* Main Navigation */}
            <div>
              <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {t('sidebar.discoverySection', 'Discovery & Tracking')}
              </p>
              <nav className="space-y-1">
                {mainNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-item-${item.id}`}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${item.badgeColor || 'bg-blue-500/20 text-blue-300'}`}>
                          {item.badge}
                        </span>
                      )}
                      {item.count !== undefined && item.count > 0 && (
                        <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-1.5 py-0.5 rounded-full font-mono">
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* AI Powered Features */}
            <div>
              <p className="px-3 text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span>{t('sidebar.aiSection', 'AI Intelligence')}</span>
              </p>
              <nav className="space-y-1">
                {aiNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-item-${item.id}`}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md font-semibold'
                          : 'text-blue-200 bg-blue-950/30 hover:bg-blue-900/40 hover:text-white border border-blue-900/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-blue-400" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Account & Alerts */}
            <div>
              <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {t('sidebar.accountSection', 'Account & Preferences')}
              </p>
              <nav className="space-y-1">
                {systemNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-item-${item.id}`}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md font-semibold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.count !== undefined && item.count > 0 && (
                        <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded-full font-mono font-bold">
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}

                {/* Admin Menu Entry */}
                <button
                  id="nav-item-admin"
                  onClick={() => handleSelect('admin')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    activeTab === 'admin'
                      ? 'bg-amber-600 text-white font-semibold'
                      : 'text-amber-300/90 hover:bg-amber-950/40 hover:text-amber-200 border border-amber-900/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>{t('nav.adminCenter', 'Admin Control Center')}</span>
                  </div>
                  {user?.role === 'admin' && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold">
                      {language === 'te' ? 'సక్రియం' : 'Active'}
                    </span>
                  )}
                </button>
              </nav>
            </div>
          </div>

          {/* Footer Info */}
          <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-400">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-300 font-medium">
                {language === 'te' ? 'అధికారిక గెజిట్ ధృవీకరించబడింది' : 'Official Sources Verified'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              {language === 'te'
                ? 'UPSC, SSC, NTA, ISRO, IBPS మరియు రాష్ట్ర గెజిట్ల నుండి సమాచారం ధృవీకరించబడుతుంది.'
                : 'Data verified against UPSC, SSC, NTA, ISRO, IBPS & State Gazettes.'}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

