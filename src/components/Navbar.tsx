import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Briefcase, 
  Bell, 
  Sparkles, 
  ShieldCheck, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X,
  Search,
  ChevronDown,
  Globe,
  Languages,
  Check,
  ArrowLeft
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NavbarProps {
  onOpenAuth: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenMobileMenu: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onMarkAllRead: () => void;
  canGoBack?: boolean;
  onGoBack?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  activeTab,
  setActiveTab,
  onOpenMobileMenu,
  notifications,
  onMarkNotificationRead,
  onMarkAllRead,
  canGoBack,
  onGoBack,
}) => {
  const { user, logout, demoLogin } = useAuth();
  const { 
    language, 
    setLanguage, 
    supportedLanguages, 
    currentLanguageOption,
    t 
  } = useLanguage();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Mobile Toggle & Back Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="btn-mobile-sidebar-toggle"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 focus:outline-none"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {canGoBack && onGoBack && (
            <button
              id="btn-navbar-back"
              onClick={onGoBack}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all group shadow-sm"
              title={language === 'te' ? 'వెనక్కి వెళ్ళండి' : 'Go back to previous page'}
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4 text-blue-400 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">{language === 'te' ? 'వెనక్కి' : 'Back'}</span>
            </button>
          )}

          <div 
            id="brand-logo"
            onClick={() => setActiveTab(user ? 'dashboard' : 'landing')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold text-lg group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
                  {t('brand.name', 'GovCareer')}
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 px-1.5 py-0.2 rounded">
                  {t('brand.aiBadge', 'AI')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none hidden sm:block">
                {t('brand.tagline', 'National Government Career Engine')}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Quick Search / Action Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div 
            onClick={() => setActiveTab('search')}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-400 text-sm cursor-pointer hover:border-blue-500/50 hover:bg-slate-800 transition-all shadow-inner"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span className="truncate">{t('nav.searchPlaceholder', 'Search 10th, 12th, Diploma, Degree, B.Tech, SSC, UPSC jobs...')}</span>
            <kbd className="ml-auto text-[10px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
              /
            </kbd>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Multi-Language Selector Dropdown */}
          <div className="relative" ref={langMenuRef}>
            <button
              id="btn-nav-language-toggle"
              onClick={() => setShowLangMenu(!showLangMenu)}
              title="Change Language / భాష మార్చండి"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition-all hover:border-blue-500/50 shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-medium">{currentLanguageOption.nativeName}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5 text-blue-400" />
                    {t('lang.title', 'Select Language')}
                  </span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-mono font-semibold">
                    11 Languages
                  </span>
                </div>

                <div className="mt-1 max-h-72 overflow-y-auto space-y-1 py-1 pr-1">
                  {supportedLanguages.map((langOpt) => {
                    const isSelected = language === langOpt.code;
                    return (
                      <button
                        key={langOpt.code}
                        id={`nav-lang-item-${langOpt.code}`}
                        onClick={() => {
                          setLanguage(langOpt.code);
                          setShowLangMenu(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors ${
                          isSelected
                            ? 'bg-blue-600/20 text-blue-300 font-bold border border-blue-500/40'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">{langOpt.nativeName}</span>
                          <span className="text-[10px] text-slate-400">{langOpt.name}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* AI Career Assistant Button */}
          <button
            id="btn-nav-ai-assistant"
            onClick={() => setActiveTab('ai-assistant')}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'ai-assistant'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-blue-950/80 text-blue-300 border border-blue-800/60 hover:bg-blue-900/80 hover:text-blue-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>{t('nav.aiAdvisor', 'AI Career Advisor')}</span>
          </button>

          {user ? (
            <>
              {/* Notification Bell */}
              <div className="relative">
                <button
                  id="btn-nav-notifications"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label="View notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-white">{t('nav.notifications', 'Notifications')}</h4>
                        {unreadCount > 0 && (
                          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-medium">
                            {unreadCount} {language === 'te' ? 'కొత్తవి' : 'new'}
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={onMarkAllRead}
                          className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
                        >
                          {t('nav.markAllRead', 'Mark all as read')}
                        </button>
                      )}
                    </div>

                    <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-6">
                          {language === 'te' ? 'ప్రస్తుతం నోటిఫికేషన్లు లేవు.' : 'No notifications yet.'}
                        </p>
                      ) : (
                        notifications.map(item => {
                          const isDeadline = item.type === 'deadline';
                          return (
                            <div
                              key={item.id}
                              onClick={() => {
                                onMarkNotificationRead(item.id);
                                if (item.jobId) {
                                  setActiveTab('search');
                                } else if (isDeadline) {
                                  setActiveTab('calendar');
                                }
                                setShowNotifications(false);
                              }}
                              className={`p-3 rounded-xl text-xs cursor-pointer transition-colors border ${
                                item.read 
                                  ? 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800/70' 
                                  : isDeadline
                                  ? 'bg-amber-950/40 border-amber-500/50 text-slate-200 hover:bg-amber-900/40'
                                  : 'bg-blue-950/40 border-blue-900/50 text-slate-200 hover:bg-blue-900/40'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className={`font-semibold ${isDeadline ? 'text-amber-200' : 'text-white'}`}>{item.title}</p>
                                {!item.read && <span className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${isDeadline ? 'bg-amber-400 ring-2 ring-amber-400/40 animate-pulse' : 'bg-blue-400'}`} />}
                              </div>
                              <p className="mt-1 text-slate-300 line-clamp-2">{item.message}</p>
                              <p className="mt-1 text-[10px] text-slate-500">
                                {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </p>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-800 text-center">
                      <button
                        onClick={() => {
                          setActiveTab('notifications');
                          setShowNotifications(false);
                        }}
                        className="text-xs font-medium text-blue-400 hover:text-blue-300"
                      >
                        {t('nav.viewAllAlerts', 'View all recruitment alerts →')}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  id="btn-nav-user-menu"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center shadow">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left hidden xl:block">
                    <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
                    <p className="text-[10px] text-slate-400 leading-tight flex items-center gap-1">
                      {user.role === 'admin' ? (
                        <span className="text-amber-400 font-semibold">Admin</span>
                      ) : (
                        <span>{user.profile.educationLevel}</span>
                      )}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 text-xs">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="font-semibold text-white">{user.name}</p>
                      <p className="text-slate-400 truncate">{user.email}</p>
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>{user.profile.educationLevel} ({user.profile.branch || 'General'})</span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setActiveTab('profile');
                          setShowUserDropdown(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 text-left"
                      >
                        <UserIcon className="w-4 h-4 text-blue-400" />
                        <span>{t('nav.myProfile', 'My Eligibility Profile & Settings')}</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('tracker');
                          setShowUserDropdown(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 text-left"
                      >
                        <Briefcase className="w-4 h-4 text-indigo-400" />
                        <span>{t('nav.myApplications', 'My Applications')}</span>
                      </button>

                      {user.role === 'admin' ? (
                        <button
                          onClick={() => {
                            setActiveTab('admin');
                            setShowUserDropdown(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-amber-300 hover:text-amber-200 hover:bg-amber-950/30 text-left font-medium"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-400" />
                          <span>{t('nav.adminCenter', 'Admin Control Center')}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            demoLogin('admin');
                            setShowUserDropdown(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 text-left"
                        >
                          <ShieldCheck className="w-4 h-4 text-slate-500" />
                          <span>{t('nav.switchAdmin', 'Switch to Admin Mode')}</span>
                        </button>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-800">
                      <button
                        onClick={() => {
                          logout();
                          setShowUserDropdown(false);
                          setActiveTab('landing');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('nav.signOut', 'Sign Out')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="btn-demo-quick-login"
                onClick={() => demoLogin('user')}
                className="hidden sm:inline-flex px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                {t('nav.demoCandidate', 'Demo Candidate')}
              </button>
              <button
                id="btn-open-login"
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-600/30 transition-all"
              >
                {t('nav.signIn', 'Sign In')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
