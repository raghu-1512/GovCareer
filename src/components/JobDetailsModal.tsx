import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Job, EligibilityResult, UserProfile, CareerImpactAnalysis } from '../types';
import { api } from '../utils/api';
import { EligibilityBadge } from './EligibilityBadge';
import { ApplyGatewayModal } from './ApplyGatewayModal';
import { 
  formatIndianSalaryRange, 
  formatIndianVacancies, 
  formatIndianDate, 
} from '../utils/formatters';
import { 
  X, 
  Building2, 
  MapPin, 
  IndianRupee, 
  Users, 
  Calendar, 
  FileText, 
  ExternalLink, 
  Bookmark, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Clock, 
  Award,
  BookOpen,
  Share2,
  Check,
  ArrowLeft,
  HelpCircle,
  TrendingUp,
  Target,
  BrainCircuit,
  Zap,
  RefreshCw,
  Briefcase,
  ChevronRight,
  Send
} from 'lucide-react';

const getSafeExternalUrl = (url?: string, fallback = 'https://ssc.gov.in'): string => {
  if (!url || !url.trim()) return fallback;
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

interface JobDetailsModalProps {
  job: Job | null;
  eligibility?: EligibilityResult;
  userProfile?: UserProfile | null;
  isSaved?: boolean;
  onToggleSave?: (jobId: string) => void;
  onClose: () => void;
  onTrackApplication: (job, status?: string) => void;
  onAskAi: (job: Job) => void;
  onShare?: (job: Job) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  eligibility,
  userProfile: passedUserProfile,
  isSaved = false,
  onToggleSave,
  onClose,
  onTrackApplication,
  onAskAi,
  onShare,
}) => {
  const { user } = useAuth();
  const { language, translateSector } = useLanguage();
  const [activeSection, setActiveSection] = useState<'overview' | 'impact' | 'eligibility' | 'syllabus' | 'selection'>('overview');
  const [copied, setCopied] = useState(false);
  const [showApplyGateway, setShowApplyGateway] = useState(false);

  // AI Career Impact state
  const [careerImpact, setCareerImpact] = useState<CareerImpactAnalysis | null>(null);
  const [loadingImpact, setLoadingImpact] = useState(false);
  const [impactError, setImpactError] = useState<string | null>(null);

  const activeProfile = passedUserProfile || user?.profile;

  const fetchCareerImpact = async (force = false) => {
    if (!job) return;
    if (careerImpact && !force) return;

    setLoadingImpact(true);
    setImpactError(null);

    try {
      const res = await api.getCareerImpact({
        jobId: job.id,
        job,
        profile: activeProfile || undefined,
        language,
      });

      if (res && res.careerImpact) {
        setCareerImpact(res.careerImpact);
      }
    } catch (err: any) {
      console.error('Failed to fetch career impact summary:', err);
      setImpactError(err?.message || 'Could not load career impact analysis');
    } finally {
      setLoadingImpact(false);
    }
  };

  useEffect(() => {
    if (job) {
      setCareerImpact(null);
      fetchCareerImpact();
    }
  }, [job?.id, language]);

  if (!job) return null;

  const today = new Date();
  const deadline = new Date(job.applicationDeadline);
  const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/?jobId=${encodeURIComponent(job.id)}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      if (onShare) {
        onShare(job);
      }
    } catch (err) {
      console.error('Failed to copy share link:', err);
      if (onShare) {
        onShare(job);
      }
    }
  };

  const primaryApplyUrl = getSafeExternalUrl(job.officialApplicationUrl, job.officialSourceUrl || 'https://ssc.gov.in');

  const renderImpactContent = (isStandaloneTab = false) => {
    if (loadingImpact) {
      return (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/40 border border-blue-500/20 animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20" />
              <div className="space-y-1.5">
                <div className="h-4 w-40 bg-slate-700 rounded" />
                <div className="h-3 w-28 bg-slate-800 rounded" />
              </div>
            </div>
            <div className="h-7 w-24 bg-blue-500/20 rounded-full" />
          </div>
          <div className="h-16 bg-slate-800/80 rounded-xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="h-20 bg-slate-800/60 rounded-xl" />
            <div className="h-20 bg-slate-800/60 rounded-xl" />
          </div>
        </div>
      );
    }

    if (impactError && !careerImpact) {
      return (
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>{language === 'te' ? 'కెరీర్ ఇంపాక్ట్ లోడ్ చేయడంలో సమస్య ఏర్పడింది.' : 'Could not generate Career Impact summary.'}</span>
          </div>
          <button
            id="btn-retry-career-impact"
            onClick={() => fetchCareerImpact(true)}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{language === 'te' ? 'మళ్ళీ ప్రయత్నించండి' : 'Retry'}</span>
          </button>
        </div>
      );
    }

    if (!careerImpact) return null;

    return (
      <div 
        id="ai-career-impact-bridge"
        className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-indigo-950/30 border border-blue-500/30 shadow-xl space-y-4"
      >
        {/* Header with Match Score & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-blue-900/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                  <span>{language === 'te' ? 'AI కెరీర్ ఇంపాక్ట్ & నైపుణ్యాల సరిపోలిక' : 'AI Career Impact & Skill Alignment'}</span>
                  <Sparkles className="w-4 h-4 text-blue-400" />
                </h3>
              </div>
              <p className="text-[11px] text-slate-400">
                {language === 'te' 
                  ? `AI కాంటెక్స్ట్ బ్రిడ్జ్ • ${activeProfile?.name || 'అభ్యర్థి'} ప్రొఫైల్ ఆధారంగా రూపొందించబడింది` 
                  : `AI Context Bridge • Tailored for ${activeProfile?.name || 'Aspirant'}'s specific skill set`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
              <Zap className="w-3.5 h-3.5 fill-emerald-400" />
              <span>{careerImpact.matchScore || 88}% {language === 'te' ? 'నైపుణ్య సరిపోలిక' : 'Skill Match'}</span>
            </span>

            <button
              id="btn-refresh-career-impact"
              onClick={() => fetchCareerImpact(true)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              title={language === 'te' ? 'సారాంశాన్ని రీఫ్రెష్ చేయండి' : 'Refresh analysis'}
              aria-label="Refresh analysis"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* AI Career Impact Narrative Summary */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            {careerImpact.summary}
          </p>
        </div>

        {/* Skill Alignment Matrix */}
        {careerImpact.skillAlignment && careerImpact.skillAlignment.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              <span>{language === 'te' ? 'మీ నైపుణ్యాలు & రిక్రూట్‌మెంట్ అనుసంధానం' : 'Skill Alignment Breakdown'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {careerImpact.skillAlignment.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-white">{item.skill}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      item.level === 'High' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : item.level === 'Advantage'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {item.level === 'High' 
                        ? (language === 'te' ? 'అధిక సరిపోలిక' : 'High Match')
                        : item.level === 'Advantage'
                        ? (language === 'te' ? 'వ్యూహాత్మక ప్రయోజనం' : 'Advantage')
                        : (language === 'te' ? 'సహాయక నైపుణ్యం' : 'Moderate Match')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {item.relevance}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strategic Advantage & Career Growth Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {careerImpact.strategicAdvantage && (
            <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-800/40">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 mb-1">
                <Award className="w-4 h-4 text-indigo-400" />
                <span>{language === 'te' ? 'మీ వ్యూహాత్మక ప్రయోజనం' : 'Your Strategic Advantage'}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {careerImpact.strategicAdvantage}
              </p>
            </div>
          )}

          {careerImpact.growthPotential && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-800/40">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>{language === 'te' ? 'కెరీర్ వృద్ధి & స్థిరత్వం' : 'Growth & Pay Trajectory'}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {careerImpact.growthPotential}
              </p>
            </div>
          )}
        </div>

        {/* Recommended Prep Focus */}
        {careerImpact.recommendedPrepFocus && (
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-2.5">
            <BookOpen className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300">
              <strong className="text-amber-300">{language === 'te' ? 'ప్రిపరేషన్ ఫోకస్:' : 'Recommended Prep Focus:'} </strong>
              <span>{careerImpact.recommendedPrepFocus}</span>
            </div>
          </div>
        )}

        {/* Bridge Action to AI Assistant */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            id="btn-bridge-ask-ai"
            onClick={() => {
              onClose();
              onAskAi(job);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 hover:scale-[1.01]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'te' ? 'AI అసిస్టెంట్‌లో పూర్తి విశ్లేషణను అడగండి' : 'Explore Full Alignment in AI Assistant'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 md:p-6 animate-in fade-in">
      <div 
        id="job-details-modal-container"
        className="relative w-full max-w-4xl bg-slate-900 border-0 sm:border sm:border-slate-800 rounded-none sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-full sm:h-auto sm:max-h-[90vh]"
      >
        {/* Sticky Modal Header */}
        <div className="sticky top-0 z-20 p-3.5 sm:p-5 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 sm:gap-4 flex-1 min-w-0">
            {/* Direct Quick Back Arrow Button */}
            <button
              id="btn-modal-back-arrow"
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 flex items-center justify-center flex-shrink-0 transition-all shadow active:scale-95 group"
              title={language === 'te' ? 'వెనక్కి వెళ్ళండి' : 'Go back'}
              aria-label="Go Back"
            >
              <ArrowLeft className="w-5 h-5 text-blue-400 group-hover:-translate-x-1 transition-transform" />
            </button>

            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg shadow-blue-500/20 flex-shrink-0">
              <Building2 className="w-5 h-5 sm:w-7 sm:h-7" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-xs font-semibold text-blue-400 truncate max-w-[150px] sm:max-w-none">
                  {job.organization}
                </span>
                {job.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                    <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden xs:inline">{language === 'te' ? 'ధృవీకరించబడింది' : 'Verified Source'}</span>
                  </span>
                )}
                <span className="text-[10px] sm:text-[11px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700 hidden sm:inline-block">
                  {translateSector(job.sector)} • {job.jobType}
                </span>
              </div>
              <h2 className="text-base sm:text-2xl font-bold text-white mt-0.5 sm:mt-1 leading-tight line-clamp-2 sm:line-clamp-1">
                {job.title}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">
                {job.department} • <span className="text-emerald-400 font-semibold">{job.salary.payLevel}</span>
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              id="btn-modal-share-header"
              onClick={handleShare}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                copied
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title={language === 'te' ? 'ఉద్యోగ లింక్ షేర్ చేయండి' : 'Share recruitment link'}
              aria-label="Share recruitment link"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="hidden md:inline text-xs text-emerald-300">{language === 'te' ? 'కాపీ అయింది!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-blue-400" />
                  <span className="hidden md:inline text-xs">{language === 'te' ? 'షేర్' : 'Share'}</span>
                </>
              )}
            </button>

            <button
              id="btn-close-job-modal"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={language === 'te' ? 'మూసివేయి / వెనక్కి' : 'Close / Back'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Navigation Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 pt-2.5 border-b border-slate-800 bg-slate-900/60 overflow-x-auto text-xs font-medium scrollbar-none flex-shrink-0">
          {[
            { id: 'overview', label: language === 'te' ? 'వివరాలు & ఇంపాక్ట్' : 'Overview & Impact', icon: Layers },
            { id: 'impact', label: language === 'te' ? 'నైపుణ్య సరిపోలిక (AI)' : 'Skill Match (AI)', icon: BrainCircuit },
            { id: 'eligibility', label: language === 'te' ? 'అర్హత ప్రమాణాలు' : 'Eligibility', icon: CheckCircle2, count: eligibility?.status },
            { id: 'syllabus', label: language === 'te' ? 'సిలబస్' : 'Syllabus', icon: BookOpen },
            { id: 'selection', label: language === 'te' ? 'ఎంపిక ప్రక్రియ' : 'Selection', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 border-b-2 font-semibold transition-all whitespace-nowrap text-xs ${
                  isActive
                    ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{tab.label}</span>
                {tab.id === 'eligibility' && eligibility && (
                  <span className={`w-2 h-2 rounded-full ${
                    eligibility.status === 'eligible' ? 'bg-emerald-400' : eligibility.status === 'warning' ? 'bg-amber-400' : 'bg-rose-400'
                  }`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 flex-1 text-sm text-slate-300">
          {/* TAB 1: OVERVIEW */}
          {activeSection === 'overview' && (
            <div className="space-y-5 sm:space-y-6">
              {/* PRIMARY PROMINENT DIRECT APPLY HERO CARD (Especially helpful on Mobile) */}
              <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-teal-950/40 border border-emerald-500/40 shadow-lg space-y-3.5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>{language === 'te' ? 'అధికారిక రిక్రూట్‌మెంట్ దరఖాస్తు' : 'Official Application Portal'}</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      {language === 'te' 
                        ? 'చివరి తేదీ లోపు అధికారిక వెబ్‌సైట్‌లో దరఖాస్తు పూర్తి చేసుకోండి.' 
                        : `Apply directly on the official ${job.organization} commission portal before deadline.`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <a
                      id="btn-hero-apply-official"
                      href={primaryApplyUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      onClick={() => {
                        if (onTrackApplication) {
                          onTrackApplication(job, 'Interested');
                        }
                      }}
                      className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-900/40 transition-all active:scale-[0.98] text-center"
                    >
                      <Send className="w-4 h-4" />
                      <span>{language === 'te' ? 'అధికారిక పోర్టల్‌లో దరఖాస్తు చేయండి' : 'Apply on Official Portal'}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-90" />
                    </a>
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-900/40 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{language === 'te' ? 'చివరి తేదీ:' : 'Deadline:'} <strong className="text-amber-300">{formatIndianDate(job.applicationDeadline, { format: 'medium' })}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id="btn-hero-apply-guide"
                      onClick={() => setShowApplyGateway(true)}
                      className="text-xs text-blue-400 hover:text-blue-300 underline font-semibold flex items-center gap-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{language === 'te' ? 'దరఖాస్తు విధానం & లింకులు చూడండి' : 'View Step-by-Step Guide'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Context Bridge: Career Impact Summary */}
              {renderImpactContent(false)}

              {/* Highlight summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1 mb-1">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                    {language === 'te' ? 'జీతం & పే స్కేల్' : 'Salary & Pay'}
                  </span>
                  <p className="font-bold text-emerald-300 text-xs sm:text-sm">
                    {formatIndianSalaryRange(job.salary.min, job.salary.max)}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">{job.salary.payLevel}</p>
                </div>

                <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1 mb-1">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    {language === 'te' ? 'మొత్తం ఖాళీలు' : 'Vacancies'}
                  </span>
                  <p className="font-bold text-white text-sm sm:text-base">
                    {formatIndianVacancies(job.vacancies).formatted}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">{language === 'te' ? 'కోటా వర్తిస్తుంది' : 'Quotas Available'}</p>
                </div>

                <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {language === 'te' ? 'పోస్టింగ్' : 'Location'}
                  </span>
                  <p className="font-bold text-white text-xs sm:text-sm truncate">
                    {job.location}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">{job.jobType} Cadre</p>
                </div>

                <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1 mb-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {language === 'te' ? 'గడువు' : 'Time Left'}
                  </span>
                  <p className={`font-bold text-xs sm:text-sm ${diffDays <= 7 ? 'text-amber-400' : 'text-white'}`}>
                    {diffDays < 0 ? (language === 'te' ? 'ముగిసింది' : 'Closed') : `${diffDays} ${language === 'te' ? 'రోజులు మిగిలి ఉన్నాయి' : 'days left'}`}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">{formatIndianDate(job.applicationDeadline, { format: 'medium' })}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  {language === 'te' ? 'ఉద్యోగ పాత్ర & విభాగం వివరాలు' : 'Role & Department Description'}
                </h3>
                <p className="text-slate-300 leading-relaxed bg-slate-800/40 p-3.5 sm:p-4 rounded-2xl border border-slate-800 text-xs sm:text-sm">
                  {job.description}
                </p>
              </div>

              {/* Recruitment Timeline Calendar */}
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  {language === 'te' ? 'ముఖ్యమైన రిక్రూట్‌మెంట్ తేదీలు' : 'Important Recruitment Dates'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                    <p className="text-[11px] text-slate-400">{language === 'te' ? 'దరఖాస్తులు ప్రారంభం' : 'Applications Open'}</p>
                    <p className="font-semibold text-white mt-0.5 text-xs sm:text-sm">{formatIndianDate(job.applicationStartDate, { format: 'medium' })}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                    <p className="text-[11px] text-slate-400">{language === 'te' ? 'దరఖాస్తు చివరి తేదీ' : 'Submission Deadline'}</p>
                    <p className="font-semibold text-amber-400 mt-0.5 text-xs sm:text-sm">{formatIndianDate(job.applicationDeadline, { format: 'medium' })}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                    <p className="text-[11px] text-slate-400">{language === 'te' ? 'హాల్ టికెట్ విడుదల' : 'Admit Card Release'}</p>
                    <p className="font-semibold text-white mt-0.5 text-xs sm:text-sm">{job.admitCardDate ? formatIndianDate(job.admitCardDate, { format: 'medium' }) : (language === 'te' ? 'త్వరలో వెల్లడిస్తారు' : 'To be announced')}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                    <p className="text-[11px] text-slate-400">{language === 'te' ? 'పరీక్ష తేదీ' : 'Exam Date'}</p>
                    <p className="font-semibold text-emerald-400 mt-0.5 text-xs sm:text-sm">{job.examDate ? formatIndianDate(job.examDate, { format: 'medium' }) : (language === 'te' ? 'త్వరలో నిర్ణయిస్తారు' : 'Scheduled in due course')}</p>
                  </div>
                </div>
              </div>

              {/* Official Source & Verification Rules Notice */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-950/30 border border-blue-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-semibold text-xs sm:text-sm text-white">{language === 'te' ? 'అధికారిక నోటిఫికేషన్ ధృవీకరణ' : 'Official Verification & Integrity Guarantee'}</h4>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
                    {language === 'te' ? `చివరిగా ${formatIndianDate(job.lastVerifiedDate, { format: 'medium' })} న అధికారిక వెబ్‌సైట్ నుండి పరిశీలించబడింది.` : `Last audited on ${formatIndianDate(job.lastVerifiedDate, { format: 'medium' })} from official department notification.`}
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    id="btn-view-official-pdf"
                    href={getSafeExternalUrl(job.officialNotificationPdf, job.officialSourceUrl)}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    <span>{language === 'te' ? 'అధికారిక PDF' : 'Official PDF'}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>

                  <a
                    id="btn-open-official-source-site"
                    href={getSafeExternalUrl(job.officialSourceUrl, 'https://ssc.gov.in')}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-colors"
                  >
                    <span>{language === 'te' ? 'పోర్టల్' : 'Source Portal'}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CAREER IMPACT (STANDALONE DETAILED VIEW) */}
          {activeSection === 'impact' && (
            <div className="space-y-6">
              {renderImpactContent(true)}

              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-400" />
                  <span>{language === 'te' ? 'ఈ ఉద్యోగంలో మీ భవిష్యత్ అవకాశాలు' : 'Long-term Prospects in this Department'}</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {language === 'te'
                    ? `${job.organization} లోని ${job.title} పోస్ట్ ద్వారా కేంద్ర / రాష్ట్ర సర్వీసులలో ఉన్నత స్థాయి అధికారిక హోదాలు, పదోన్నతులు మరియు స్థిరమైన కెరీర్ అందుబాటులో ఉంటాయి. మీ ప్రస్తుత నైపుణ్యాలను ఉపయోగించుకుని పరీక్షలో గరిష్ట మార్కులు సాధించవచ్చు.`
                    : `Joining as ${job.title} at ${job.organization} provides structured promotional pathways into senior administrative and technical gazetted grades. Your current skillset aligns strongly with both the selection tiers and departmental mandates.`}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: ELIGIBILITY ENGINE */}
          {activeSection === 'eligibility' && (
            <div className="space-y-5 sm:space-y-6">
              {/* Header Status Card */}
              {eligibility && (
                <div className={`p-4 rounded-2xl border ${
                  eligibility.status === 'eligible'
                    ? 'bg-emerald-950/30 border-emerald-800/60'
                    : eligibility.status === 'warning'
                    ? 'bg-amber-950/30 border-amber-800/60'
                    : 'bg-rose-950/30 border-rose-800/60'
                }`}>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2.5">
                      <EligibilityBadge status={eligibility.status} size="lg" />
                      <span className="text-xs font-mono text-slate-400">{language === 'te' ? 'అర్హత స్కోర్:' : 'Match Score:'} {eligibility.score}%</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-white">{eligibility.reason}</p>
                </div>
              )}

              {/* Detailed Rule-by-Rule Checklist */}
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {language === 'te' ? 'విద్యా & వయోపరిమితి అర్హత ధృవీకరణ' : 'Structured Qualification & Rule Verification'}
                </h3>

                <div className="space-y-3">
                  {eligibility?.checks?.map((chk, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 sm:p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-start justify-between gap-3 sm:gap-4"
                    >
                      <div className="flex items-start gap-2.5 sm:gap-3">
                        {chk.pass === true ? (
                          <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
                            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                        ) : chk.pass === 'warning' ? (
                          <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400 mt-0.5">
                            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                        ) : (
                          <div className="p-1 rounded-lg bg-rose-500/10 text-rose-400 mt-0.5">
                            <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-white text-xs sm:text-sm">{chk.factor}</h4>
                            <span className={`text-[9px] sm:text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                              chk.pass === true ? 'bg-emerald-500/20 text-emerald-300' : chk.pass === 'warning' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                            }`}>
                              {chk.pass === true ? (language === 'te' ? 'సరిపోలింది' : 'Pass') : chk.pass === 'warning' ? (language === 'te' ? 'పరిశీలించండి' : 'Check') : (language === 'te' ? 'అర్హత లేదు' : 'Failed')}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1 font-medium">{chk.note}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                            <span>{language === 'te' ? 'మీ వివరాలు:' : 'Your Value:'} <strong className="text-slate-200">{chk.userValue}</strong></span>
                            <span>{language === 'te' ? 'అవసరమైన అర్హత:' : 'Required:'} <strong className="text-slate-200">{chk.requirement}</strong></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Age Relaxation Guidance */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
                <h4 className="font-semibold text-xs sm:text-sm text-white mb-2">{language === 'te' ? 'వర్తించే వయోపరిమితి సడలింపులు:' : 'Age Relaxations Applicable:'}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300">
                  <div className="p-2.5 rounded-xl bg-slate-800">
                    <p className="text-slate-400">OBC (Non-Creamy Layer):</p>
                    <p className="font-bold text-white mt-0.5">+{job.ageRelaxation?.obc || 3} {language === 'te' ? 'సంవత్సరాలు' : 'Years'}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800">
                    <p className="text-slate-400">SC / ST Candidates:</p>
                    <p className="font-bold text-white mt-0.5">+{job.ageRelaxation?.scSt || 5} {language === 'te' ? 'సంవత్సరాలు' : 'Years'}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800">
                    <p className="text-slate-400">PwBD Candidates:</p>
                    <p className="font-bold text-white mt-0.5">+{job.ageRelaxation?.pwd || 10} {language === 'te' ? 'సంవత్సరాలు' : 'Years'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SYLLABUS */}
          {activeSection === 'syllabus' && (
            <div className="space-y-5 sm:space-y-6">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-2 sm:mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  {language === 'te' ? 'అధికారిక పరీక్ష సిలబస్ విశ్లేషణ' : 'Official Exam Syllabus Breakdown'}
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  {language === 'te' ? 'నోటిఫికేషన్‌లో పేర్కొన్న ప్రామాణిక సిలబస్. పరీక్ష తయారీ కోసం ఉపయోగించండి.' : 'Standard syllabus prescribed in notification. Use this breakdown for targeted section-wise preparation.'}
                </p>

                <div className="space-y-3.5 sm:space-y-4">
                  {job.syllabus.map((sec, idx) => (
                    <div key={idx} className="p-3.5 sm:p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60">
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <h4 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
                          <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-mono">
                            {idx + 1}
                          </span>
                          {sec.section}
                        </h4>
                        {sec.marks && (
                          <span className="text-[11px] sm:text-xs bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-full font-mono font-semibold">
                            {sec.marks} {language === 'te' ? 'మార్కులు' : 'Marks'}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {sec.topics.map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-xs bg-slate-800 text-slate-300 border border-slate-700/80 px-2.5 py-1 rounded-lg"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SELECTION PROCESS */}
          {activeSection === 'selection' && (
            <div className="space-y-5 sm:space-y-6">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  {language === 'te' ? 'ఎంపిక దశలు & మూల్యాంకన విధానం' : 'Selection Stages & Evaluation Process'}
                </h3>

                <div className="relative pl-5 sm:pl-6 space-y-4 sm:space-y-6 before:absolute before:left-2 sm:before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-600/40">
                  {job.selectionProcess.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-5 sm:-left-6 top-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-900 border-2 border-blue-500 flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-white">
                        {idx + 1}
                      </div>
                      <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60">
                        <h4 className="font-bold text-xs sm:text-sm text-white">{step}</h4>
                        <p className="text-xs text-slate-400 mt-1">
                          {idx === 0
                            ? (language === 'te' ? 'ప్రాథమిక స్క్రీనింగ్ దశ. మార్కుల ఆధారంగా తదుపరి దశకు అర్హత లభిస్తుంది.' : 'Mandatory screening stage. Score decides qualification for next tier.')
                            : idx === job.selectionProcess.length - 1
                            ? (language === 'te' ? 'తుది సర్టిఫికెట్ల ధృవీకరణ & మెడికల్ ఫిట్‌నెస్ పరిశీలన.' : 'Final stage verifying original certificates, caste/EWS affidavits, and medical fitness.')
                            : (language === 'te' ? 'మెరిట్ ర్యాంకింగ్ నిర్ణయించే ప్రధాన పరీక్ష.' : 'Merit-ranking assessment determining candidate rank list.')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* STICKY BOTTOM ACTION BAR: OPTIMIZED FOR MOBILE & DESKTOP */}
        <div className="sticky bottom-0 z-30 p-3 sm:p-4 md:p-5 border-t border-slate-800 bg-slate-900/95 backdrop-blur-md flex-shrink-0 shadow-2xl">
          {/* MOBILE VIEW ACTIONS (< 640px) */}
          <div className="flex flex-col gap-2 sm:hidden">
            {/* Primary Full-Width Action Button */}
            <div className="flex items-center gap-2">
              <a
                id="btn-mobile-apply-officially"
                href={primaryApplyUrl}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => {
                  if (onTrackApplication) {
                    onTrackApplication(job, 'Interested');
                  }
                }}
                className="flex-1 min-h-[46px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-xl shadow-emerald-950 transition-all active:scale-[0.98] text-center"
              >
                <Send className="w-4 h-4" />
                <span className="truncate">{language === 'te' ? 'అధికారిక పోర్టల్‌లో దరఖాస్తు' : 'Apply on Official Portal'}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-90 flex-shrink-0" />
              </a>

              <button
                id="btn-mobile-apply-guide"
                onClick={() => setShowApplyGateway(true)}
                className="min-h-[46px] px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors flex-shrink-0"
                title={language === 'te' ? 'దరఖాస్తు మార్గదర్శిని' : 'Apply Guide'}
              >
                <HelpCircle className="w-4 h-4 text-blue-400" />
                <span>{language === 'te' ? 'గైడ్' : 'Guide'}</span>
              </button>
            </div>

            {/* Secondary Mobile Quick Bar */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              <button
                id="btn-mobile-footer-back"
                onClick={onClose}
                className="py-2 px-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700/80 flex items-center justify-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-blue-400" />
                <span>{language === 'te' ? 'వెనక్కి' : 'Back'}</span>
              </button>

              <button
                id="btn-mobile-track-app"
                onClick={() => onTrackApplication(job, 'Interested')}
                className="py-2 px-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700/80 flex items-center justify-center gap-1 transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>{language === 'te' ? 'ట్రాక్' : 'Track'}</span>
              </button>

              <button
                id="btn-mobile-ask-ai"
                onClick={() => {
                  onClose();
                  onAskAi(job);
                }}
                className="py-2 px-1 rounded-xl bg-blue-950/80 text-blue-300 border border-blue-800 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>{language === 'te' ? 'AI అడగండి' : 'Ask AI'}</span>
              </button>

              {onToggleSave ? (
                <button
                  id="btn-mobile-save-toggle"
                  onClick={() => onToggleSave(job.id)}
                  className={`py-2 px-1 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1 transition-all ${
                    isSaved
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                      : 'bg-slate-800/80 border-slate-700/80 text-slate-300'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-400' : ''}`} />
                  <span>{isSaved ? (language === 'te' ? 'సేవ్డ్' : 'Saved') : (language === 'te' ? 'సేవ్' : 'Save')}</span>
                </button>
              ) : (
                <button
                  id="btn-mobile-share-action"
                  onClick={handleShare}
                  className="py-2 px-1 rounded-xl bg-slate-800/80 text-slate-300 border border-slate-700/80 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>{language === 'te' ? 'షేర్' : 'Share'}</span>
                </button>
              )}
            </div>
          </div>

          {/* DESKTOP & TABLET VIEW ACTIONS (>= 640px) */}
          <div className="hidden sm:flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                id="btn-modal-footer-back"
                onClick={onClose}
                className="p-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all group shadow-sm"
                title={language === 'te' ? 'వెనక్కి వెళ్ళండి' : 'Go back'}
              >
                <ArrowLeft className="w-4 h-4 text-blue-400 group-hover:-translate-x-1 transition-transform" />
                <span>{language === 'te' ? 'వెనక్కి' : 'Back'}</span>
              </button>

              {onToggleSave && (
                <button
                  id="btn-modal-save-toggle"
                  onClick={() => onToggleSave(job.id)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isSaved
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-400' : ''}`} />
                  <span>{isSaved ? (language === 'te' ? 'సేవ్ చేయబడింది' : 'Saved') : (language === 'te' ? 'సేవ్ చేయండి' : 'Save Job')}</span>
                </button>
              )}

              <button
                id="btn-modal-share-bottom"
                onClick={handleShare}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  copied
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'te' ? 'లింక్ కాపీ అయింది!' : 'Link Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-blue-400" />
                    <span>{language === 'te' ? 'ఉద్యోగం షేర్ చేయండి' : 'Share Job'}</span>
                  </>
                )}
              </button>

              <button
                id="btn-modal-ask-ai"
                onClick={() => {
                  onClose();
                  onAskAi(job);
                }}
                className="p-2.5 rounded-xl bg-blue-950 text-blue-300 border border-blue-800 hover:bg-blue-900/50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>{language === 'te' ? 'AI ని అడగండి' : 'Ask AI About This Exam'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                id="btn-modal-apply-guide"
                onClick={() => setShowApplyGateway(true)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 shadow"
                title={language === 'te' ? 'దరఖాస్తు మార్గదర్శిని & చెక్‌లిస్ట్' : 'View step-by-step application guide & checklist'}
              >
                <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                <span>{language === 'te' ? 'మార్గదర్శిని' : 'Apply Guide'}</span>
              </button>

              <button
                id="btn-modal-track-app"
                onClick={() => onTrackApplication(job, 'Interested')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors shadow"
              >
                {language === 'te' ? 'ట్రాకర్‌లో చేర్చండి' : 'Add to Tracker'}
              </button>

              <a
                id="btn-modal-apply-officially"
                href={primaryApplyUrl}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => {
                  if (onTrackApplication) {
                    onTrackApplication(job, 'Interested');
                  }
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/40 transition-all hover:scale-[1.02]"
              >
                <span>{language === 'te' ? 'అధికారిక పోర్టల్‌లో దరఖాస్తు చేయండి' : 'Apply on Official Portal'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Official Application Gateway Modal */}
      <ApplyGatewayModal
        job={job}
        isOpen={showApplyGateway}
        onClose={() => setShowApplyGateway(false)}
        onTrackApplication={onTrackApplication}
        onAskAi={onAskAi}
      />
    </div>
  );
};
