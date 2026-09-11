import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { api } from './utils/api';
import { Job, JobApplication, ExamEvent, NotificationItem, EligibilityResult } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { JobDetailsModal } from './components/JobDetailsModal';
import { AuthModal } from './components/AuthModal';
import { SavedExamsDeadlinePrompt } from './components/SavedExamsDeadlinePrompt';
import { evaluateJobEligibility } from './utils/eligibilityEngine';
import { getUpcoming7DayDeadlines, generateDeadlineNotifications } from './utils/deadlineAlertEngine';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { JobSearchPage } from './pages/JobSearchPage';
import { RecommendedJobsPage } from './pages/RecommendedJobsPage';
import { SavedJobsPage } from './pages/SavedJobsPage';
import { ApplicationTrackerPage } from './pages/ApplicationTrackerPage';
import { ExamCalendarPage } from './pages/ExamCalendarPage';
import { AiCareerAssistantPage } from './pages/AiCareerAssistantPage';
import { StudyPlannerPage } from './pages/StudyPlannerPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

function AppContent() {
  const { user, isLoading } = useAuth();

  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [tabHistory, setTabHistory] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // App Data State
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [exams, setExams] = useState<ExamEvent[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Modal State
  const [selectedJobForModal, setSelectedJobForModal] = useState<Job | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // AI context bridge
  const [aiJobContext, setAiJobContext] = useState<Job | null>(null);
  const [studyPlanExamName, setStudyPlanExamName] = useState<string>('SSC CGL 2026 Tier-1 & Tier-2');

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleNavigateTab = (newTab: string) => {
    if (newTab !== activeTab) {
      setTabHistory(prev => [...prev, activeTab]);
      setActiveTab(newTab);
    }
  };

  const handleGoBack = () => {
    if (selectedJobForModal) {
      setSelectedJobForModal(null);
      return;
    }
    if (tabHistory.length > 0) {
      const prevTab = tabHistory[tabHistory.length - 1];
      setTabHistory(prev => prev.slice(0, -1));
      setActiveTab(prevTab);
    } else if (activeTab !== 'dashboard') {
      setActiveTab('dashboard');
    }
  };

  const canGoBack = Boolean(
    selectedJobForModal || 
    tabHistory.length > 0 || 
    (user && activeTab !== 'dashboard') || 
    (!user && activeTab !== 'landing')
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Initial Data Fetching
  const loadInitialData = async () => {
    try {
      const [jobsData, savedData, appsData, examsData, notifsData] = await Promise.allSettled([
        api.getJobs(),
        api.getSavedJobs(),
        api.getApplications(),
        api.getExams(),
        api.getNotifications(),
      ]);

      if (jobsData.status === 'fulfilled') {
        const loadedJobs = jobsData.value.jobs;
        setJobs(loadedJobs);

        // Check if a jobId was provided in the URL query string
        const urlParams = new URLSearchParams(window.location.search);
        const sharedJobId = urlParams.get('jobId');
        if (sharedJobId) {
          const found = loadedJobs.find(j => j.id === sharedJobId);
          if (found) {
            setSelectedJobForModal(found);
          }
        }
      }
      if (savedData.status === 'fulfilled') setSavedJobIds(savedData.value.savedIds || []);
      if (appsData.status === 'fulfilled') setApplications(appsData.value.applications || []);
      if (examsData.status === 'fulfilled') setExams(examsData.value.exams || []);
      if (notifsData.status === 'fulfilled') setNotifications(notifsData.value.notifications || []);
    } catch (err) {
      console.error('Error fetching initial app data:', err);
    }
  };

  useEffect(() => {
    loadInitialData();

    // Register Service Worker for PWA and Push Notifications
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.warn('Service worker registration error:', err);
      });
    }
  }, [user]);

  // Saved Jobs Toggle Handler
  const handleToggleSaveJob = async (jobId: string) => {
    try {
      const res = await api.toggleSaveJob(jobId);
      setSavedJobIds(res.savedIds);
      showToast(res.isSaved ? 'Bookmark added to Saved Jobs' : 'Bookmark removed');
    } catch (err) {
      // Local fallback
      setSavedJobIds(prev => {
        const isSaved = prev.includes(jobId);
        const next = isSaved ? prev.filter(id => id !== jobId) : [...prev, jobId];
        showToast(!isSaved ? 'Bookmark added to Saved Jobs' : 'Bookmark removed');
        return next;
      });
    }
  };

  // Application Tracker Handlers
  const handleCreateApplication = async (payload: Partial<JobApplication> & { jobId: string }) => {
    try {
      const res = await api.createApplication(payload);
      setApplications(prev => [res.application, ...prev]);
      showToast('Application added to Tracker successfully');
    } catch (err: any) {
      showToast(`Failed to add application: ${err.message}`);
    }
  };

  const handleUpdateApplication = async (id: string, payload: Partial<JobApplication>) => {
    try {
      const res = await api.updateApplication(id, payload);
      setApplications(prev => prev.map(a => a.id === id ? res.application : a));
      showToast('Application status updated');
    } catch (err: any) {
      showToast(`Failed to update application: ${err.message}`);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    try {
      await api.deleteApplication(id);
      setApplications(prev => prev.filter(a => a.id !== id));
      showToast('Application record removed');
    } catch (err: any) {
      showToast(`Failed to delete application: ${err.message}`);
    }
  };

  // Exam Calendar Handlers
  const handleToggleSaveExam = async (id: string) => {
    try {
      const res = await api.toggleSaveExam(id);
      setExams(prev => prev.map(e => e.id === id ? res.exam : e));
      showToast(res.exam.isSaved ? 'Exam bookmarked' : 'Bookmark removed');
    } catch (err) {
      setExams(prev => prev.map(e => e.id === id ? { ...e, isSaved: !e.isSaved } : e));
    }
  };

  // Notifications Handlers
  const handleMarkNotificationRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      showToast('All notifications marked as read');
    } catch {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  // Admin Job Handlers
  const handleAdminCreateJob = async (jobPayload: Partial<Job>) => {
    try {
      const res = await api.createJob(jobPayload);
      setJobs(prev => [res.job, ...prev]);
      showToast('New verified government job gazette published!');
    } catch (err: any) {
      showToast(`Error publishing job: ${err.message}`);
    }
  };

  const handleAdminUpdateJob = async (id: string, jobPayload: Partial<Job>) => {
    try {
      const res = await api.updateJob(id, jobPayload);
      setJobs(prev => prev.map(j => j.id === id ? res.job : j));
      showToast('Recruitment gazette updated successfully');
    } catch (err: any) {
      showToast(`Error updating job: ${err.message}`);
    }
  };

  const handleAdminDeleteJob = async (id: string) => {
    try {
      await api.deleteJob(id);
      setJobs(prev => prev.filter(j => j.id !== id));
      showToast('Recruitment gazette removed');
    } catch (err: any) {
      showToast(`Error deleting job: ${err.message}`);
    }
  };

  // Navigation & Modal triggers
  const handleOpenAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleViewJobDetails = (job: Job) => {
    setSelectedJobForModal(job);
  };

  const handleAskAiAboutJob = (job: Job) => {
    setAiJobContext(job);
    setActiveTab('ai-assistant');
  };

  const handleLaunchStudyPlanForExam = (examName: string) => {
    setStudyPlanExamName(examName);
    setActiveTab('study-planner');
  };

  const handleTrackFromJob = (job: Job, initialStatus: string = 'Interested') => {
    handleCreateApplication({
      jobId: job.id,
      jobTitle: job.title,
      organization: job.organization,
      status: initialStatus as any,
      appliedDate: new Date().toISOString().split('T')[0],
      notes: `Targeting recruitment under ${job.sector} sector.`
    });
    setSelectedJobForModal(null);
  };

  // Calculate Urgent 7-Day Deadlines across Saved Exams & Jobs
  const upcoming7DayDeadlines = useMemo(() => {
    return getUpcoming7DayDeadlines(exams, jobs, savedJobIds, applications);
  }, [exams, jobs, savedJobIds, applications]);

  // Sync deadline notifications when exams or saved jobs change
  useEffect(() => {
    if (upcoming7DayDeadlines.length > 0) {
      const generatedNotifs = generateDeadlineNotifications(upcoming7DayDeadlines, user?.id || 'guest');
      setNotifications(prev => {
        const existingIds = new Set(prev.map(n => n.id));
        const newNotifs = generatedNotifs.filter(gn => !existingIds.has(gn.id));
        return newNotifs.length > 0 ? [...newNotifs, ...prev] : prev;
      });
    }
  }, [upcoming7DayDeadlines, user?.id]);

  const handleTriggerDeadlineScan = () => {
    const freshDeadlines = getUpcoming7DayDeadlines(exams, jobs, savedJobIds, applications);
    if (freshDeadlines.length > 0) {
      const generatedNotifs = generateDeadlineNotifications(freshDeadlines, user?.id || 'guest');
      setNotifications(prev => {
        const existingIds = new Set(prev.map(n => n.id));
        const newNotifs = generatedNotifs.filter(gn => !existingIds.has(gn.id));
        return newNotifs.length > 0 ? [...newNotifs, ...prev] : prev;
      });
      showToast(`🚨 Found ${freshDeadlines.length} saved exam deadline(s) within 7 days! Prompt triggered.`);
    } else {
      showToast('✅ All saved exam deadlines are beyond 7 days.');
    }
  };

  const currentEligibility = selectedJobForModal && user
    ? evaluateJobEligibility(selectedJobForModal, user.profile)
    : undefined;

  // Render Landing page when explicitly in 'landing' mode or user logged out
  const showLanding = activeTab === 'landing' || (!user && activeTab !== 'search');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-blue-600 text-white font-medium text-xs shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-blue-200 hover:text-white font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        onOpenAuth={() => handleOpenAuthModal('login')}
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onMarkAllRead={handleMarkAllNotificationsRead}
        canGoBack={canGoBack}
        onGoBack={handleGoBack}
      />

      {/* 7-Day Deadline Notification Trigger Prompt Banner */}
      <SavedExamsDeadlinePrompt
        alerts={upcoming7DayDeadlines}
        onLaunchStudyPlan={handleLaunchStudyPlanForExam}
        onViewJobById={(jobId) => {
          const found = jobs.find(j => j.id === jobId);
          if (found) setSelectedJobForModal(found);
        }}
        onNavigateToCalendar={() => handleNavigateTab('calendar')}
      />

      {showLanding ? (
        <LandingPage
          jobs={jobs}
          onOpenAuth={handleOpenAuthModal}
          onExploreJobs={() => handleNavigateTab('search')}
          onViewJobDetails={handleViewJobDetails}
          onOpenAiAdvisor={() => handleNavigateTab('ai-assistant')}
        />
      ) : (
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          {/* Persistent Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={handleNavigateTab}
            isOpenMobile={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
            savedCount={savedJobIds.length}
            unreadNotifsCount={notifications.filter(n => !n.read).length}
            activeAppsCount={applications.length}
          />

          {/* Main Content Workspace */}
          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
            {activeTab === 'dashboard' && (
              <DashboardPage
                jobs={jobs}
                applications={applications}
                exams={exams}
                savedJobIds={savedJobIds}
                onToggleSave={handleToggleSaveJob}
                onViewJobDetails={handleViewJobDetails}
                onNavigateTab={handleNavigateTab}
                onTrackJob={handleTrackFromJob}
              />
            )}

            {activeTab === 'search' && (
              <JobSearchPage
                jobs={jobs}
                savedJobIds={savedJobIds}
                onToggleSave={handleToggleSaveJob}
                onViewJobDetails={handleViewJobDetails}
                onTrackJob={handleTrackFromJob}
                onBack={handleGoBack}
              />
            )}

            {activeTab === 'recommended' && (
              <RecommendedJobsPage
                jobs={jobs}
                savedJobIds={savedJobIds}
                onToggleSave={handleToggleSaveJob}
                onViewJobDetails={handleViewJobDetails}
                onTrackJob={handleTrackFromJob}
                onNavigateProfile={() => handleNavigateTab('profile')}
                onBack={handleGoBack}
              />
            )}

            {activeTab === 'saved' && (
              <SavedJobsPage
                jobs={jobs}
                savedJobIds={savedJobIds}
                onToggleSave={handleToggleSaveJob}
                onViewJobDetails={handleViewJobDetails}
                onTrackJob={handleTrackFromJob}
                onExploreJobs={() => handleNavigateTab('search')}
                onBack={handleGoBack}
              />
            )}

            {activeTab === 'tracker' && (
              <ApplicationTrackerPage
                applications={applications}
                jobs={jobs}
                onCreateApplication={handleCreateApplication}
                onUpdateApplication={handleUpdateApplication}
                onDeleteApplication={handleDeleteApplication}
                onBack={handleGoBack}
              />
            )}

            {activeTab === 'calendar' && (
              <ExamCalendarPage
                exams={exams}
                onToggleSaveExam={handleToggleSaveExam}
                onLaunchStudyPlan={handleLaunchStudyPlanForExam}
                onBack={handleGoBack}
                onTriggerDeadlineScan={handleTriggerDeadlineScan}
              />
            )}

            {activeTab === 'ai-assistant' && (
              <AiCareerAssistantPage
                initialJobContext={aiJobContext}
                onClearJobContext={() => setAiJobContext(null)}
                onNavigateStudyPlanner={(examName) => {
                  if (examName) setStudyPlanExamName(examName);
                  handleNavigateTab('study-planner');
                }}
                onBack={handleGoBack}
              />
            )}

            {activeTab === 'study-planner' && (
              <StudyPlannerPage
                initialExamName={studyPlanExamName}
                onBack={handleGoBack}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationsPage
                notifications={notifications}
                onMarkRead={handleMarkNotificationRead}
                onMarkAllRead={handleMarkAllNotificationsRead}
                onViewJobById={(jobId) => {
                  const found = jobs.find(j => j.id === jobId);
                  if (found) setSelectedJobForModal(found);
                }}
                onBack={handleGoBack}
              />
            )}

            {activeTab === 'profile' && (
              <ProfilePage
                onSavedToast={() => showToast('Eligibility profile updated! Recommendations refreshed.')}
                onBack={handleGoBack}
              />
            )}

            {activeTab === 'admin' && (
              <AdminDashboardPage
                jobs={jobs}
                onCreateJob={handleAdminCreateJob}
                onUpdateJob={handleAdminUpdateJob}
                onDeleteJob={handleAdminDeleteJob}
                onViewJobDetails={handleViewJobDetails}
                onBack={handleGoBack}
              />
            )}
          </main>
        </div>
      )}

      {/* Recruitment Job Details Dossier Modal */}
      <JobDetailsModal
        job={selectedJobForModal}
        eligibility={currentEligibility}
        userProfile={user?.profile}
        isSaved={selectedJobForModal ? savedJobIds.includes(selectedJobForModal.id) : false}
        onToggleSave={handleToggleSaveJob}
        onClose={() => setSelectedJobForModal(null)}
        onTrackApplication={handleTrackFromJob}
        onAskAi={handleAskAiAboutJob}
        onShare={(job) => showToast(`Link for "${job.organization} - ${job.title}" copied to clipboard!`)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}
