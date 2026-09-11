import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../utils/api';
import { StudyPlan } from '../types';
import { 
  GraduationCap, 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  BookOpen, 
  Target, 
  ArrowRight, 
  Printer, 
  Award,
  Layers,
  RotateCcw,
  ArrowLeft
} from 'lucide-react';

interface StudyPlannerPageProps {
  initialExamName?: string;
  onBack?: () => void;
}

export const StudyPlannerPage: React.FC<StudyPlannerPageProps> = ({
  initialExamName = 'SSC CGL 2026 Tier-1 & Tier-2',
  onBack,
}) => {
  const { language, t } = useLanguage();
  const [examName, setExamName] = useState(initialExamName);
  const [dailyHours, setDailyHours] = useState(4);
  const [totalWeeks, setTotalWeeks] = useState(8);
  const [customFocus, setCustomFocus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);

  const popularExams = [
    'SSC CGL 2026 Tier-1 & Tier-2',
    'ISRO ICRB Scientist / Engineer \'SC\' (CS/ECE/ME)',
    'UPSC Civil Services Preliminary Examination',
    'IBPS Probationary Officer (PO) Prelims & Mains',
    'RRB Non-Technical Popular Categories (NTPC)',
    'APPSC / TSPSC Group 1 & 2 Administrative Services',
    'SEBI Grade A Assistant Manager (IT/General)'
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.generateStudyPlan({
        examName,
        availableDailyHours: Number(dailyHours),
        totalWeeks: Number(totalWeeks),
        customFocus: customFocus || undefined,
        language: language,
      });

      setStudyPlan(res.studyPlan);
    } catch (err: any) {
      setError(err.message || (language === 'te' ? 'స్టడీ టైమ్‌టేబుల్ రూపొందించడంలో విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.' : 'Failed to generate study timetable. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-800/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            {onBack && (
              <button
                id="btn-planner-back"
                onClick={onBack}
                className="p-1.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm group"
                title="Go back"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-blue-400 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Gemini 3.7 Structured Planner {language === 'te' ? '• తెలుగు' : ''}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t('planner.title', 'AI Exam Study Plan Generator')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            {t('planner.subtitle', 'Create an automated, day-by-day and week-by-week preparation blueprint calibrated to your daily available study hours and target exam syllabus.')}
          </p>
        </div>
      </div>

      {/* Generator Form */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <form onSubmit={handleGenerate} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Target Exam */}
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t('planner.targetExam', 'Target Government Exam')}
              </label>
              <input
                id="input-plan-exam"
                type="text"
                list="popular-exams-list"
                required
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="e.g. SSC CGL, ISRO ICRB, UPSC Prelims, APPSC"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <datalist id="popular-exams-list">
                {popularExams.map((ex) => (
                  <option key={ex} value={ex} />
                ))}
              </datalist>
            </div>

            {/* Daily Hours */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t('planner.dailyHours', 'Daily Available Study Time')}
              </label>
              <select
                id="select-plan-daily-hours"
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value={2}>{language === 'te' ? 'రోజుకు 2 గంటలు (ఉద్యోగులకు)' : '2 Hours/Day (Working Professional)'}</option>
                <option value={4}>{language === 'te' ? 'రోజుకు 4 గంటలు (మితమైన సన్నద్ధత)' : '4 Hours/Day (Moderate Preparation)'}</option>
                <option value={6}>{language === 'te' ? 'రోజుకు 6 గంటలు (తీవ్ర సన్నద్ధత)' : '6 Hours/Day (Intensive Preparation)'}</option>
                <option value={8}>{language === 'te' ? 'రోజుకు 8+ గంటలు (పూర్తి సమయం)' : '8+ Hours/Day (Full-Time Dedicated)'}</option>
              </select>
            </div>

            {/* Total Duration */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t('planner.weeks', 'Preparation Horizon')}
              </label>
              <select
                id="select-plan-weeks"
                value={totalWeeks}
                onChange={(e) => setTotalWeeks(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value={4}>{language === 'te' ? '4 వారాలు (క్రాష్ కోర్స్)' : '4 Weeks (Sprint Crash Course)'}</option>
                <option value={8}>{language === 'te' ? '8 వారాలు (ప్రామాణిక ప్రణాళిక)' : '8 Weeks (Standard Balanced Plan)'}</option>
                <option value={12}>{language === 'te' ? '12 వారాలు (3 నెలల సమగ్ర ప్రణాళిక)' : '12 Weeks (3 Months Comprehensive)'}</option>
                <option value={16}>{language === 'te' ? '16 వారాలు (4 నెలల సంపూర్ణ కోర్సు)' : '16 Weeks (4 Months Foundation to Advanced)'}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {language === 'te' ? 'ప్రత్యేక ప్రాధాన్యత / బలహీన విభాగాలు (ఐచ్ఛికం)' : 'Custom Focus / Weak Areas (Optional)'}
            </label>
            <input
              type="text"
              value={customFocus}
              onChange={(e) => setCustomFocus(e.target.value)}
              placeholder={language === 'te' ? 'ఉదాహరణ: క్వాంటిటేటివ్ ఆప్టిట్యూడ్ స్పీడ్ మరియు జనరల్ సైన్స్ బేసిక్స్‌పై ఎక్కువ దృష్టి పెట్టండి' : 'e.g. Focus extra time on Quantitative Aptitude speed drills & General Science basics'}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400">{language === 'te' ? 'త్వరిత ఎంపిక:' : 'Quick Select:'}</span>
              {popularExams.slice(0, 3).map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setExamName(ex)}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
                >
                  {ex.split(' ')[0]} {ex.split(' ')[1]}
                </button>
              ))}
            </div>

            <button
              id="btn-generate-study-plan"
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{language === 'te' ? 'పరీక్ష ప్రణాళిక సిద్ధమవుతోంది...' : 'Synthesizing Exam Blueprint...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t('planner.generateBtn', 'Generate Customized Plan')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      {/* Generated Plan Render */}
      {studyPlan && (
        <div id="generated-study-plan-container" className="space-y-6 animate-in fade-in">
          {/* Plan Header Card */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold text-blue-400">
                    {language === 'te' ? 'ప్రధాన సన్నద్ధత టైమ్‌టేబుల్' : 'Master Preparation Schedule'}
                  </span>
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-mono">
                    {studyPlan.totalWeeks} {language === 'te' ? 'వారాలు' : 'Weeks'} • {studyPlan.dailyHours} {language === 'te' ? 'గంటలు/రోజు' : 'Hrs/Day'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {studyPlan.examName}
                </h2>
              </div>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4 text-slate-400" />
                <span>{language === 'te' ? 'షెడ్యూల్ ముద్రించండి' : 'Print Schedule'}</span>
              </button>
            </div>

            {/* Daily Routine Breakdown */}
            <div>
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                {language === 'te' ? `సిఫార్సు చేయబడిన రోజువారీ స్లాట్లు (${studyPlan.dailyHours} గంటలు)` : `Recommended Daily Slot Allocation (${studyPlan.dailyHours} Hours)`}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block mb-1">
                    🌅 {language === 'te' ? 'ఉదయం స్లాట్ (తాజా మనస్సు)' : 'Morning Slot (Fresh Mind)'}
                  </span>
                  <p className="text-xs text-slate-300 font-medium">{studyPlan.dailyRoutine.morning}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                    ☀️ {language === 'te' ? 'మధ్యాహ్నం / సాయంత్రం (ప్రాక్టీస్)' : 'Afternoon / Evening (Practice)'}
                  </span>
                  <p className="text-xs text-slate-300 font-medium">{studyPlan.dailyRoutine.afternoon}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                    🌙 {language === 'te' ? 'రాత్రి స్లాట్ (పునశ్చరణ & క్విజ్)' : 'Night Slot (Active Recall)'}
                  </span>
                  <p className="text-xs text-slate-300 font-medium">{studyPlan.dailyRoutine.evening}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Week by Week Roadmap */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              {language === 'te' ? 'వారం వారీ సిలబస్ & మాక్ టెస్ట్ రోడ్‌మ్యాప్' : 'Week-by-Week Syllabus & Mock Test Roadmap'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studyPlan.weeklyBreakdown.map((wb) => (
                <div
                  key={wb.weekNumber}
                  className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 space-y-3 transition-all shadow"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 font-bold text-xs flex items-center justify-center font-mono">
                      W{wb.weekNumber}
                    </span>
                    <h4 className="font-bold text-sm text-white flex-1 mx-3 truncate">
                      {wb.theme}
                    </h4>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                      {language === 'te' ? `వారం ${wb.weekNumber}` : `Week ${wb.weekNumber}`}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold text-slate-400">
                      {language === 'te' ? 'ప్రధాన సబ్జెక్టు అంశాలు:' : 'Core Subject Focus:'}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {wb.subjects.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-slate-800 text-slate-200 border border-slate-700 px-2.5 py-1 rounded-lg"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 space-y-1 text-xs">
                    <div className="flex items-start gap-1.5 text-slate-300">
                      <Target className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span><strong>{language === 'te' ? 'లక్ష్యం:' : 'Milestone:'}</strong> {wb.milestone}</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-amber-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span><strong>{language === 'te' ? 'మాక్ టెస్ట్ టార్గెట్:' : 'Mock Target:'}</strong> {wb.mockTestTarget}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reference Materials & High Yield Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="font-bold text-base text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                {language === 'te' ? 'సిఫార్సు చేయబడిన పుస్తకాలు & స్టడీ మెటీరియల్' : 'Recommended Reference Books & Materials'}
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {studyPlan.recommendedResources.map((res, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-800/50 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{res}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="font-bold text-base text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                {language === 'te' ? 'పరీక్ష వ్యూహం & అధిక మార్కుల కోసం చిట్కాలు' : 'High-Yield Exam Strategy & Accuracy Tips'}
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {studyPlan.keyTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-800/50 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-amber-400 font-bold">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

