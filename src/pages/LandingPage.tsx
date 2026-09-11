import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Layers, 
  ArrowRight, 
  Award,
  Users,
  Compass,
  FileCheck,
  Zap,
  TrendingUp,
  MapPin,
  IndianRupee
} from 'lucide-react';
import { Job, EligibilityResult } from '../types';
import { JobCard } from '../components/JobCard';
import { evaluateJobEligibility } from '../utils/eligibilityEngine';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  jobs: Job[];
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onExploreJobs: () => void;
  onViewJobDetails: (job: Job) => void;
  onOpenAiAdvisor: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  jobs,
  onOpenAuth,
  onExploreJobs,
  onViewJobDetails,
  onOpenAiAdvisor,
}) => {
  const { user, demoLogin } = useAuth();
  const [quickQuery, setQuickQuery] = useState('');

  const previewJobs = jobs.slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Glow backdrop effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[200px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>AI-Powered Government Job Discovery Platform</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
            Find Government Jobs{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
              Made for You
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Discover government opportunities based on your qualification, degree, branch, age, and location. Stop searching through hundreds of official notification PDFs — automatically discover jobs you are strictly eligible for.
          </p>

          {/* Quick Search on Hero */}
          <div className="pt-2 max-w-2xl mx-auto">
            <div className="p-2 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center gap-2 backdrop-blur">
              <div className="flex items-center gap-2.5 px-3 flex-1 w-full text-slate-400">
                <Search className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <input
                  id="hero-quick-search-input"
                  type="text"
                  value={quickQuery}
                  onChange={(e) => setQuickQuery(e.target.value)}
                  placeholder="Search by degree (B.Tech CSE), exam (SSC, UPSC), organization..."
                  className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onExploreJobs();
                  }}
                />
              </div>
              <button
                id="btn-hero-find-jobs"
                onClick={onExploreJobs}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Find Matching Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Sector Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-400">
              <span className="font-medium">Popular:</span>
              {['ISRO Scientist', 'SSC CGL 2026', 'UPSC IAS', 'RRB Railway NTPC', 'Bank PO', 'SEBI Grade A'].map((tag) => (
                <button
                  key={tag}
                  onClick={onExploreJobs}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500/50 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              id="btn-hero-create-profile"
              onClick={() => onOpenAuth('register')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/25 transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <span>Create Candidate Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="btn-hero-demo-candidate"
              onClick={() => demoLogin('user')}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
            >
              1-Click Demo Dashboard
            </button>
          </div>
        </div>

        {/* Live System Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { label: 'Active Verified Vacancies', value: '38,000+', icon: Award, color: 'text-blue-400' },
            { label: 'Recruitment Sectors', value: '11 Sectors', icon: Layers, color: 'text-indigo-400' },
            { label: 'Eligibility Accuracy', value: '100% Rule-Based', icon: CheckCircle2, color: 'text-emerald-400' },
            { label: 'AI Career Queries Answered', value: '25,000+', icon: Sparkles, color: 'text-amber-400' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
                <Icon className={`w-5 h-5 mx-auto mb-1.5 ${stat.color}`} />
                <p className="text-xl font-bold text-white tracking-tight">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Everything You Need for Government Recruitment
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Structured tools built specifically to replace the chaotic clutter of notification PDFs and telegram groups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-blue-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Personalized Job Discovery</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our engine evaluates your exact degree, engineering branch, age with reservation relaxation, and state domicile to deliver tailored opportunities.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-emerald-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Structured Eligibility Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deterministic rule-based checks indicate 🟢 Eligible, 🟡 Check Requirement, or 🔴 Not Eligible with clause-by-clause justification.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-600/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">AI Career & Study Planner</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Powered by Gemini 3.7 Flash: get deep exam syllabus breakdowns, strategy recommendations, and custom daily study schedules tailored to your available time.
            </p>
          </div>
        </div>
      </section>

      {/* Verified Sample Government Notifications */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-2xl font-bold text-white">Verified Government Vacancies</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Recruitment notifications with verified official source portals & PDF documents.
            </p>
          </div>

          <button
            onClick={onExploreJobs}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300"
          >
            <span>View all 12+ active vacancies</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {previewJobs.map((job) => {
            const eligibility = user ? evaluateJobEligibility(job, user.profile) : undefined;
            return (
              <JobCard
                key={job.id}
                job={job}
                eligibility={eligibility}
                onViewDetails={onViewJobDetails}
              />
            );
          })}
        </div>
      </section>

      {/* AI Assistant Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900 border border-blue-800/50 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Gemini 3.7 Flash AI Advisor</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Have Questions About Government Exams?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Ask about syllabus weights, salary structures, exam timelines, or generate a tailored multi-week preparation plan.
            </p>
          </div>

          <button
            id="btn-banner-ai-advisor"
            onClick={onOpenAiAdvisor}
            className="px-6 py-3.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 flex-shrink-0 transition-transform hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Launch AI Career Advisor</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-900 text-center text-xs text-slate-500">
        <p>© 2026 GovCareer. Built for Indian Government Job Aspirants. All recruitment data linked to official gazettes.</p>
      </footer>
    </div>
  );
};
