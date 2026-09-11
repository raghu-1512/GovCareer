import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { EducationLevel, SocialCategory } from '../types';
import { 
  User, 
  GraduationCap, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Briefcase, 
  CheckCircle2, 
  Save,
  Sparkles,
  Award,
  Layers,
  Globe,
  Languages,
  Check,
  ArrowLeft
} from 'lucide-react';

interface ProfilePageProps {
  onSavedToast?: () => void;
  onBack?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onSavedToast, onBack }) => {
  const { user, updateProfile } = useAuth();
  const { 
    language, 
    setLanguage, 
    supportedLanguages, 
    currentLanguageOption,
    t, 
    translateSector, 
    translateEducation, 
    translateCategory 
  } = useLanguage();

  const [name, setName] = useState(user?.name || '');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(user?.profile?.educationLevel || 'B.Tech / B.E.');
  const [degree, setDegree] = useState(user?.profile?.degree || 'B.Tech');
  const [branch, setBranch] = useState(user?.profile?.branch || 'Computer Science and Engineering');
  const [category, setCategory] = useState<SocialCategory>(user?.profile?.category || 'General');
  const [dateOfBirth, setDateOfBirth] = useState(user?.profile?.dateOfBirth || '2002-04-15');
  const [state, setState] = useState(user?.profile?.state || 'Andhra Pradesh');
  const [experienceYears, setExperienceYears] = useState(user?.profile?.experienceYears || 0);
  const [preferredDepts, setPreferredDepts] = useState<string[]>(
    user?.profile?.preferredDepartments || ['Defense & Aerospace', 'Civil Services', 'Engineering & Tech PSUs', 'Staff Selection', 'Railways']
  );

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Calculate age
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let calculatedAge = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    calculatedAge--;
  }

  // Calculate relaxation
  const relaxation = category === 'OBC' ? 3 : category === 'SC' || category === 'ST' ? 5 : category === 'PwBD' ? 10 : 0;

  const handleEducationChange = (lvl: EducationLevel) => {
    setEducationLevel(lvl);
    if (lvl === '10th Pass') {
      setDegree('10th Standard / Matriculation / SSC');
      setBranch('General / All Subjects');
    } else if (lvl === '12th Pass') {
      setDegree('12th Standard / Intermediate / 10+2');
      setBranch('Science (MPC / BiPC) or Arts / Commerce');
    } else if (lvl === 'Diploma') {
      setDegree('Polytechnic Diploma');
      setBranch('Mechanical / Civil / Electrical / CSE');
    } else if (lvl === 'Graduation / Bachelor\'s') {
      setDegree('Bachelor\'s Degree (B.A. / B.Sc / B.Com)');
      setBranch('General / Any Discipline');
    } else if (lvl === 'B.Tech / B.E.') {
      setDegree('B.Tech / B.E.');
      setBranch('Computer Science & Engineering');
    } else if (lvl === 'MBBS / Medical') {
      setDegree('MBBS / B.Sc Nursing');
      setBranch('Medical / Healthcare');
    } else if (lvl === 'LLB / Law') {
      setDegree('LLB (3 Years / 5 Years Integrated)');
      setBranch('Law / Jurisprudence');
    } else if (lvl === 'Post Graduation / Master\'s') {
      setDegree('Master\'s Degree (M.A. / M.Sc / M.Tech / MBA)');
      setBranch('Specialized Discipline');
    } else if (lvl === 'PhD / Doctorate') {
      setDegree('Doctor of Philosophy (PhD)');
      setBranch('Research Discipline');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);

    try {
      await updateProfile({
        name,
        educationLevel,
        degree,
        branch,
        category,
        dateOfBirth,
        state,
        experienceYears: Number(experienceYears),
        preferredDepartments: preferredDepts,
      });

      setSuccessMsg(t('profile.updatedToast', 'Eligibility criteria updated successfully! All recommendations updated.'));
      if (onSavedToast) onSavedToast();
    } catch (err: any) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const toggleDept = (dept: string) => {
    if (preferredDepts.includes(dept)) {
      setPreferredDepts(preferredDepts.filter(d => d !== dept));
    } else {
      setPreferredDepts([...preferredDepts, dept]);
    }
  };

  const allDepts = [
    'Defense & Aerospace',
    'Civil Services',
    'Staff Selection',
    'Banking & Insurance',
    'Railways',
    'Engineering & Tech PSUs',
    'State PSC',
    'Regulatory Bodies',
    'Teaching',
    'Police',
    'Technical'
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-800/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            {onBack && (
              <button
                id="btn-profile-back"
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
              {t('profile.title', 'Candidate Eligibility Profile & Settings')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t('profile.title', 'Candidate Eligibility Profile & Settings')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            {t('profile.subtitle', 'Keep your qualification (10th, 12th, Diploma, Degree, B.Tech, Master\'s, PhD), category, age, and language preferences up to date to ensure 100% precision in vacancy matching.')}
          </p>
        </div>
      </div>

      {/* Multi-Language Preference Settings Box (All Indian Languages) */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950/30 to-slate-900 border-2 border-blue-500/40 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {t('lang.title', 'Language Preference / భాష ఎంపిక')}
              </h3>
              <p className="text-xs text-slate-300">
                {t('lang.subtitle', 'Select your preferred Indian language. Gemini AI guidance, exam patterns, and study plans will automatically adapt.')}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" />
            {currentLanguageOption.nativeName} ({currentLanguageOption.name})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-2">
          {supportedLanguages.map((langOpt) => {
            const isSelected = language === langOpt.code;
            return (
              <button
                key={langOpt.code}
                type="button"
                id={`lang-option-${langOpt.code}`}
                onClick={() => setLanguage(langOpt.code)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-600/25 border-blue-500 ring-2 ring-blue-500/40 text-white shadow-lg'
                    : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{langOpt.nativeName}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                </div>
                <span className="text-[11px] text-slate-400">{langOpt.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <User className="w-4 h-4 text-blue-400" />
            {t('profile.identitySection', 'Candidate Identity & Account')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t('profile.fullName', 'Full Name')}</label>
              <input
                id="profile-input-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t('profile.email', 'Email Address')}</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-slate-800/50 border border-slate-700 text-slate-400 rounded-xl px-3.5 py-2.5 text-xs cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Core Eligibility Factors (10th Pass to PhD) */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              {t('profile.academicSection', 'Academic Qualifications & Specialization')}
            </h3>
            <span className="text-[11px] text-slate-400">
              {t('profile.academicNote', 'Applies to 10th, 12th, Diploma, Degree, Engineering & Post-Graduation')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t('profile.highestTier', 'Highest Education Tier')}
              </label>
              <select
                id="profile-select-education"
                value={educationLevel}
                onChange={(e) => handleEducationChange(e.target.value as EducationLevel)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="10th Pass">{translateEducation('10th Pass')}</option>
                <option value="12th Pass">{translateEducation('12th Pass')}</option>
                <option value="Diploma">{translateEducation('Diploma')}</option>
                <option value="Graduation / Bachelor's">{translateEducation('Graduation / Bachelor\'s')}</option>
                <option value="B.Tech / B.E.">{translateEducation('B.Tech / B.E.')}</option>
                <option value="MBBS / Medical">{translateEducation('MBBS / Medical')}</option>
                <option value="LLB / Law">{translateEducation('LLB / Law')}</option>
                <option value="Post Graduation / Master's">{translateEducation('Post Graduation / Master\'s')}</option>
                <option value="PhD / Doctorate">{translateEducation('PhD / Doctorate')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t('profile.degreeTitle', 'Degree / Certificate Title')}
              </label>
              <input
                id="profile-input-degree"
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g. 10th Pass, 12th MPC, Polytechnic Diploma, B.A., B.Com, B.Sc, B.Tech"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t('profile.branch', 'Discipline / Branch / Major')}
              </label>
              <input
                id="profile-input-branch"
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="e.g. General, Science, Mechanical, Civil, CSE, Arts, Commerce"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Reservation, Age & Domicile */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            {t('profile.reservationSection', 'Social Category, Age Relaxation & Domicile')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t('profile.category', 'Social Category / Quota')}
              </label>
              <select
                id="profile-select-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="General">{translateCategory('General')}</option>
                <option value="OBC">{translateCategory('OBC')}</option>
                <option value="EWS">{translateCategory('EWS')}</option>
                <option value="SC">{translateCategory('SC')}</option>
                <option value="ST">{translateCategory('ST')}</option>
                <option value="PwBD">{translateCategory('PwBD')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t('profile.dob', 'Date of Birth')}</label>
              <input
                id="profile-input-dob"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t('profile.state', 'State of Domicile')}</label>
              <input
                id="profile-input-state"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Andhra Pradesh, Telangana, Karnataka, Maharashtra"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t('profile.experience', 'Work Experience (Years)')}</label>
              <input
                type="number"
                min={0}
                max={40}
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Realtime Age Calculator preview */}
          <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-800/40 flex items-center justify-between text-xs text-slate-300 flex-wrap gap-2">
            <div>
              {t('profile.currentAge', 'Current Age')}: <strong className="text-white font-mono">{calculatedAge} {t('profile.years', 'Years')}</strong> ({t('profile.born', 'Born')} {dateOfBirth})
            </div>
            <div>
              {t('profile.categoryRelaxation', 'Category Relaxation')}: <strong className="text-emerald-400 font-mono">+{relaxation} {t('profile.years', 'Years')}</strong> ({category})
            </div>
          </div>
        </div>

        {/* Section 4: Preferred Recruitment Sectors */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            {t('profile.preferredSectors', 'Target Recruitment Sectors & Career Interests')}
          </h3>

          <div className="flex flex-wrap gap-2.5">
            {allDepts.map((dept) => {
              const isSelected = preferredDepts.includes(dept);
              return (
                <button
                  key={dept}
                  type="button"
                  onClick={() => toggleDept(dept)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '} {translateSector(dept)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex items-center justify-end gap-3">
          <button
            id="btn-save-profile"
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{t('profile.saveBtn', 'Save & Update Eligibility Engine')}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
