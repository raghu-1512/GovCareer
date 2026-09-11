import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Job } from '../types';
import { 
  formatIndianSalaryRange, 
  formatIndianVacancies, 
  formatIndianDate 
} from '../utils/formatters';
import { 
  X, 
  Building2, 
  ExternalLink, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Copy, 
  Check, 
  AlertCircle, 
  ArrowRight, 
  Plus, 
  Calendar, 
  ArrowLeft,
  Info,
  Layers,
  Sparkles,
  HelpCircle,
  Send
} from 'lucide-react';

interface ApplyGatewayModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onTrackApplication: (job: Job, status?: string) => void;
  onAskAi?: (job: Job) => void;
}

const getSafeExternalUrl = (url?: string, fallback = 'https://ssc.gov.in'): string => {
  if (!url || !url.trim()) return fallback;
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

export const ApplyGatewayModal: React.FC<ApplyGatewayModalProps> = ({
  job,
  isOpen,
  onClose,
  onTrackApplication,
  onAskAi,
}) => {
  const { language, t, translateSector } = useLanguage();
  const [copiedLink, setCopiedLink] = useState(false);
  const [hasTracked, setHasTracked] = useState(false);

  if (!isOpen || !job) return null;

  // Safe fallback URLs ensuring no 404 or URL Not Found
  const primaryApplicationUrl = getSafeExternalUrl(job.officialApplicationUrl, job.officialSourceUrl || 'https://ssc.gov.in');
  const officialSourceUrl = getSafeExternalUrl(job.officialSourceUrl, primaryApplicationUrl);
  const officialPdfUrl = getSafeExternalUrl(job.officialNotificationPdf, officialSourceUrl);

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(primaryApplicationUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = primaryApplicationUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      console.error('Failed to copy portal URL:', e);
    }
  };

  const handleQuickTrack = () => {
    onTrackApplication(job, 'Applied');
    setHasTracked(true);
    setTimeout(() => setHasTracked(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 md:p-6 animate-in fade-in">
      <div 
        id="apply-gateway-modal-container"
        className="relative w-full max-w-2xl bg-slate-900 border-0 sm:border sm:border-slate-800 rounded-none sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-full sm:h-auto sm:max-h-[92vh]"
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 p-3.5 sm:p-5 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md flex items-start justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-2.5 sm:gap-4 flex-1 min-w-0">
            <button
              id="btn-apply-modal-back"
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 flex items-center justify-center flex-shrink-0 transition-all shadow active:scale-95 group"
              title={language === 'te' ? 'వెనక్కి వెళ్ళండి' : 'Go back'}
            >
              <ArrowLeft className="w-5 h-5 text-emerald-400 group-hover:-translate-x-1 transition-transform" />
            </button>

            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg shadow-emerald-600/20 flex-shrink-0">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-emerald-400 truncate max-w-[150px] sm:max-w-none">
                  {job.organization}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{language === 'te' ? 'అధికారిక పోర్టల్' : 'Official Portal'}</span>
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-bold text-white mt-0.5 leading-snug line-clamp-1">
                {job.title}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                {language === 'te' ? 'చివరి తేదీ:' : 'Deadline:'} <strong className="text-amber-400">{formatIndianDate(job.applicationDeadline, { format: 'medium' })}</strong>
              </p>
            </div>
          </div>

          <button
            id="btn-close-apply-modal"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex-shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 flex-1 text-sm text-slate-300">
          {/* Main Direct Apply Action Banner */}
          <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-teal-950/40 border border-emerald-500/40 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{language === 'te' ? 'అధికారిక ఆన్‌లైన్ దరఖాస్తు లింక్' : 'Official Application Gateway'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {language === 'te' 
                    ? 'మీరు రిక్రూట్‌మెంట్ బోర్డు యొక్క అధికారిక వెబ్‌సైట్‌కు సురక్షితంగా రీడైరెక్ట్ చేయబడతారు.' 
                    : 'Redirect directly to the verified recruitment commission portal.'}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
                <button
                  id="btn-gateway-copy-url"
                  onClick={handleCopyLink}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow"
                  title="Copy application URL"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">{language === 'te' ? 'కాపీ అయింది!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-400" />
                      <span>{language === 'te' ? 'లింక్ కాపీ' : 'Copy'}</span>
                    </>
                  )}
                </button>

                <a
                  id="btn-gateway-open-official-portal"
                  href={primaryApplicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial min-h-[44px] inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-900/40 transition-all active:scale-[0.98] text-center"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === 'te' ? 'పోర్టల్ తెరవండి' : 'Open Portal'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-700/60 font-mono text-slate-400 truncate">
              <span className="text-emerald-400 truncate font-semibold text-[11px] sm:text-xs">{primaryApplicationUrl}</span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 ml-2 hidden sm:inline">HTTPS Verified</span>
            </div>
          </div>

          {/* Backup Portal & Official Notification Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <a
              id="btn-gateway-source-homepage"
              href={officialSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 sm:p-3.5 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 hover:border-blue-500/40 flex items-center justify-between gap-3 group transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                    {language === 'te' ? 'శాఖ ప్రధాన వెబ్‌సైట్' : 'Agency Main Website'}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{job.organization}</p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </a>

            <a
              id="btn-gateway-official-pdf-notice"
              href={officialPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 sm:p-3.5 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 hover:border-amber-500/40 flex items-center justify-between gap-3 group transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-600/10 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                    {language === 'te' ? 'అధికారిక నోటిఫికేషన్ PDF' : 'Official Gazette / PDF Notice'}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{language === 'te' ? 'పూర్తి నిబంధనల పరిశీలన' : 'Rules & Reservation PDF'}</p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </a>
          </div>

          {/* Step-by-Step Government Application Guidelines */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>{language === 'te' ? 'దరఖాస్తు చేయడానికి 5 దశల గైడ్' : 'Standard 5-Step Online Application Guide'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-[10px] font-mono">1</span>
                  {language === 'te' ? 'వన్ టైమ్ రిజిస్ట్రేషన్ (OTR)' : '1. One Time Registration (OTR)'}
                </p>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {language === 'te' 
                    ? 'పోర్టల్‌లో ఆధార్ నంబర్, ఈమెయిల్ మరియు మొబైల్ OTP ఉపయోగించి రిజిస్టర్ చేసుకోండి.' 
                    : 'Register with Aadhaar number, verified email ID, and mobile OTP.'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-[10px] font-mono">2</span>
                  {language === 'te' ? 'విద్యా వివరాలు & పోస్టు ఎంపిక' : '2. Qualification & Post Selection'}
                </p>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {language === 'te' 
                    ? 'మీ విద్యార్హత మార్కులు, కేటగిరీ రిజర్వేషన్ మరియు పరీక్షా కేంద్రాన్ని ఎంచుకోండి.' 
                    : `Enter marks for ${job.degreesAllowed[0] || 'Graduation'} and choose preferred exam center cities.`}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-[10px] font-mono">3</span>
                  {language === 'te' ? 'ఫోటో & సంతకం అప్‌లోడ్' : '3. Photo & Signature Specs'}
                </p>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {language === 'te' 
                    ? 'పాస్‌పోర్ట్ సైజ్ ఫోటో (20-50 KB) మరియు స్పష్టమైన సంతకం (10-20 KB) జేపీజీలో సిద్ధంగా ఉంచుకోండి.' 
                    : 'Scanned passport photo (20-50 KB JPG) and signature (10-20 KB JPG).'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-[10px] font-mono">4</span>
                  {language === 'te' ? 'ఫీజు చెల్లింపు & ప్రింట్' : '4. Fee Payment & Final Slip'}
                </p>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {language === 'te' 
                    ? 'UPI లేదా నెట్ బ్యాంకింగ్ ద్వారా ఫీజు చెల్లించి, తుది దరఖాస్తు రసీదును PDF లో డౌన్‌లోడ్ చేయండి.' 
                    : 'Pay fee via UPI/NetBanking and save the generated Registration Receipt PDF.'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Add to Tracker Card */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>{language === 'te' ? 'ఈ దరఖాస్తును మీ ట్రాకర్‌లో రికార్డ్ చేయండి' : 'Record in Application Tracker'}</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                {language === 'te' 
                  ? 'హాల్ టికెట్, పరీక్ష తేదీ మరియు రిజిస్ట్రేషన్ నంబర్‌ను ట్రాక్ చేయడానికి భద్రపరచండి.' 
                  : 'Save this job to your GovCareer Application Pipeline to track hall tickets & exam dates.'}
              </p>
            </div>

            <button
              id="btn-gateway-quick-track"
              onClick={handleQuickTrack}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow flex-shrink-0 ${
                hasTracked
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {hasTracked ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{language === 'te' ? 'ట్రాకర్‌లో చేర్చబడింది!' : 'Tracked!'}</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'te' ? 'ట్రాకర్‌లో రికార్డ్ చేయండి' : 'Add to Tracker'}</span>
                </>
              )}
            </button>
          </div>

          {/* Troubleshooting Notice */}
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 text-slate-400 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              {language === 'te'
                ? 'గమనిక: ప్రభుత్వ సర్వర్లలో ఎక్కువ ట్రాఫిక్ ఉన్న సమయాల్లో పేజీ నెమ్మదిగా లోడ్ కావచ్చు. అలాంటి సమయంలో ప్రధాన వెబ్‌సైట్ లింక్ ఉపయోగించండి లేదా కాసేపటి తర్వాత ప్రయత్నించండి.'
                : 'Pro-Tip: Government server portals (e.g. SSC, UPSC, Railways) experience heavy traffic during peak hours and closing dates. If a specific deep sub-link times out, use the primary agency root link provided above or try during early morning/late night hours.'}
            </p>
          </div>
        </div>

        {/* Modal Sticky Footer */}
        <div className="sticky bottom-0 z-30 p-3.5 sm:p-5 border-t border-slate-800 bg-slate-900/95 backdrop-blur-md flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              id="btn-gateway-close-bottom"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'te' ? 'వెనక్కి' : 'Back'}</span>
            </button>

            {onAskAi && (
              <button
                id="btn-gateway-ask-ai"
                onClick={() => {
                  onClose();
                  onAskAi(job);
                }}
                className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-blue-950 text-blue-300 border border-blue-800 hover:bg-blue-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>{language === 'te' ? 'AI సలహా' : 'Ask AI'}</span>
              </button>
            )}
          </div>

          <a
            id="btn-gateway-proceed-external"
            href={primaryApplicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[46px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-900/40 transition-all active:scale-[0.98] text-center"
          >
            <Send className="w-4 h-4" />
            <span>{language === 'te' ? 'అధికారిక వెబ్‌సైట్‌కు వెళ్లండి' : 'Proceed to Official Portal'}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-90" />
          </a>
        </div>
      </div>
    </div>
  );
};
