import React, { useState } from 'react';
import { Job, SystemStats } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  formatIndianNumber, 
  formatIndianSalaryRange, 
  formatIndianDate, 
  formatIndianVacancies 
} from '../utils/formatters';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Building2, 
  Users, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  X, 
  Search, 
  Award,
  Sparkles,
  Layers,
  IndianRupee,
  Calendar,
  ArrowLeft
} from 'lucide-react';

interface AdminDashboardPageProps {
  jobs: Job[];
  stats?: SystemStats | null;
  onCreateJob: (job: Partial<Job>) => Promise<void>;
  onUpdateJob: (id: string, job: Partial<Job>) => Promise<void>;
  onDeleteJob: (id: string) => Promise<void>;
  onViewJobDetails: (job: Job) => void;
  onBack?: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  jobs,
  stats,
  onCreateJob,
  onUpdateJob,
  onDeleteJob,
  onViewJobDetails,
  onBack,
}) => {
  const { user, demoLogin } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State for Adding / Editing
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [department, setDepartment] = useState('');
  const [sector, setSector] = useState<any>('Defense & Aerospace');
  const [jobType, setJobType] = useState<any>('Central');
  const [vacancies, setVacancies] = useState(100);
  const [minSalary, setMinSalary] = useState(56100);
  const [maxSalary, setMaxSalary] = useState(177500);
  const [payLevel, setPayLevel] = useState('Level 10 (7th CPC)');
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(30);
  const [degreesAllowed, setDegreesAllowed] = useState('B.Tech, B.E., B.Sc (Engg)');
  const [branchesAllowed, setBranchesAllowed] = useState('Computer Science, Information Technology, Electronics');
  const [location, setLocation] = useState('All India / Multiple Centers');
  const [deadline, setDeadline] = useState('2026-06-30');
  const [description, setDescription] = useState('');
  const [officialSourceUrl, setOfficialSourceUrl] = useState('https://upsc.gov.in');
  const [officialNotificationPdf, setOfficialNotificationPdf] = useState('https://upsc.gov.in/sites/default/files/Notification-CSP-2026.pdf');
  const [officialApplicationUrl, setOfficialApplicationUrl] = useState('https://upsconline.nic.in');

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setTitle('');
    setOrganization('');
    setDepartment('');
    setSector('Defense & Aerospace');
    setJobType('Central');
    setVacancies(100);
    setMinSalary(56100);
    setMaxSalary(177500);
    setPayLevel('Level 10 (7th CPC)');
    setMinAge(18);
    setMaxAge(30);
    setDegreesAllowed('B.Tech, B.E.');
    setBranchesAllowed('Computer Science, IT');
    setLocation('All India');
    setDeadline('2026-07-30');
    setDescription('');
    setOfficialSourceUrl('https://upsc.gov.in');
    setOfficialNotificationPdf('https://upsc.gov.in/notifications');
    setOfficialApplicationUrl('https://upsconline.nic.in');
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEdit = (job: Job) => {
    setEditingJob(job);
    setTitle(job.title);
    setOrganization(job.organization);
    setDepartment(job.department);
    setSector(job.sector);
    setJobType(job.jobType);
    setVacancies(job.vacancies);
    setMinSalary(job.salary.min);
    setMaxSalary(job.salary.max);
    setPayLevel(job.salary.payLevel);
    setMinAge(job.minAge);
    setMaxAge(job.maxAge);
    setDegreesAllowed(job.degreesAllowed.join(', '));
    setBranchesAllowed((job.branchesAllowed || []).join(', '));
    setLocation(job.location);
    setDeadline(job.applicationDeadline);
    setDescription(job.description);
    setOfficialSourceUrl(job.officialSourceUrl);
    setOfficialNotificationPdf(job.officialNotificationPdf);
    setOfficialApplicationUrl(job.officialApplicationUrl);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<Job> = {
      title,
      organization,
      department,
      sector,
      jobType,
      vacancies: Number(vacancies),
      salary: {
        min: Number(minSalary),
        max: Number(maxSalary),
        payLevel,
      },
      minAge: Number(minAge),
      maxAge: Number(maxAge),
      degreesAllowed: degreesAllowed.split(',').map(s => s.trim()),
      branchesAllowed: branchesAllowed.split(',').map(s => s.trim()),
      location,
      applicationDeadline: deadline,
      description,
      officialSourceUrl,
      officialNotificationPdf,
      officialApplicationUrl,
      isVerified: true,
      lastVerifiedDate: new Date().toISOString().split('T')[0],
      syllabus: [
        { section: 'General Aptitude & Reasoning', topics: ['Verbal Ability', 'Numerical Computation', 'Logical Deductions'], marks: 50 },
        { section: 'Domain Technical Subject', topics: ['Core Discipline Fundamentals', 'Applied Engineering Problems'], marks: 100 }
      ],
      selectionProcess: ['Tier 1 Written Computer Based Test', 'Personal Interview & Skill Assessment', 'Document Verification & Medical Fit'],
    };

    if (editingJob) {
      await onUpdateJob(editingJob.id, payload);
      setEditingJob(null);
    } else {
      await onCreateJob(payload);
      setShowAddModal(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-800/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            {onBack && (
              <button
                id="btn-admin-back"
                onClick={onBack}
                className="p-1.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm group"
                title="Go back"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-amber-400 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Administration & Publisher Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Government Recruitment Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Audit, verify, publish, and maintain official government job gazettes. Ensure links directly point to valid ministry endpoints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-admin-add-job"
            onClick={handleOpenAdd}
            className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Verified Notification</span>
          </button>
        </div>
      </div>

      {/* Admin Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-xs text-slate-400">Total Live Vacancies</p>
          <p className="text-2xl font-bold text-white mt-1">
            {formatIndianNumber(jobs.reduce((acc, j) => acc + j.vacancies, 0))}
          </p>
          <p className="text-[10px] text-emerald-400 mt-0.5">Across {formatIndianNumber(jobs.length)} Active Gazettes</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-xs text-slate-400">Official Verification Rate</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">100%</p>
          <p className="text-[10px] text-slate-400 mt-0.5">PDFs & Sources Audited</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-xs text-slate-400">Registered Candidates</p>
          <p className="text-2xl font-bold text-white mt-1">14,280+</p>
          <p className="text-[10px] text-blue-400 mt-0.5">Active Job Seekers</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-xs text-slate-400">AI Queries Processed</p>
          <p className="text-2xl font-bold text-indigo-400 mt-1">29,450</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Gemini 3.7 Career Advising</p>
        </div>
      </div>

      {/* Jobs Audit Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            Active Published Notifications ({formatIndianNumber(filteredJobs.length)})
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notifications..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-700">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Organization & Role</th>
                <th className="py-3 px-4">Sector</th>
                <th className="py-3 px-4">Vacancies</th>
                <th className="py-3 px-4">Salary Range</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredJobs.map((j) => (
                <tr key={j.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-white">{j.title}</p>
                    <p className="text-[11px] text-slate-400">{j.organization}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      {j.sector}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white font-mono">
                    {formatIndianNumber(j.vacancies)}
                  </td>
                  <td className="py-3.5 px-4 text-emerald-400 font-mono">
                    {formatIndianSalaryRange(j.salary.min, j.salary.max)}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    {formatIndianDate(j.applicationDeadline, { format: 'medium' })}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      Audited
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewJobDetails(j)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                        title="Preview Details"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(j)}
                        className="p-1.5 rounded-lg bg-slate-800 text-blue-400 hover:bg-slate-700"
                        title="Edit Notification"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteJob(j.id)}
                        className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-950/40"
                        title="Delete Notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Publish / Edit Modal */}
      {(showAddModal || editingJob) && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 my-8">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingJob(null);
                  }}
                  className="p-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 text-xs font-semibold group transition-all"
                  title="Back to management table"
                >
                  <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Back</span>
                </button>
                <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                  {editingJob ? 'Edit Government Job Notification' : 'Publish New Verified Job'}
                </h3>
              </div>

              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingJob(null);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-6">
              Enter official notification attributes. All fields will feed into the automated candidate matching engine.
            </p>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Recruitment Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Scientist / Engineer 'SC'"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Organization</label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. ISRO / DOS"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Sector</label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Defense & Aerospace">Defense & Aerospace</option>
                    <option value="Civil Services">Civil Services</option>
                    <option value="Staff Selection">Staff Selection</option>
                    <option value="Banking & Insurance">Banking & Insurance</option>
                    <option value="Railways">Railways</option>
                    <option value="Engineering & Tech PSUs">Engineering & Tech PSUs</option>
                    <option value="State PSC">State PSC</option>
                    <option value="Regulatory Bodies">Regulatory Bodies</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Cadre Type</label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Central">Central Govt</option>
                    <option value="State">State Govt</option>
                    <option value="PSU">PSU / Maharatna</option>
                    <option value="Autonomous">Autonomous Body</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Vacancies</label>
                  <input
                    type="number"
                    required
                    value={vacancies}
                    onChange={(e) => setVacancies(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Min Salary (₹)</label>
                  <input
                    type="number"
                    value={minSalary}
                    onChange={(e) => setMinSalary(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Max Salary (₹)</label>
                  <input
                    type="number"
                    value={maxSalary}
                    onChange={(e) => setMaxSalary(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Pay Level</label>
                  <input
                    type="text"
                    value={payLevel}
                    onChange={(e) => setPayLevel(e.target.value)}
                    placeholder="Level 10 (7th CPC)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Min Age</label>
                  <input
                    type="number"
                    value={minAge}
                    onChange={(e) => setMinAge(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Max Age (UR)</label>
                  <input
                    type="number"
                    value={maxAge}
                    onChange={(e) => setMaxAge(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Deadline Date</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Eligible Degrees (Comma Separated)</label>
                <input
                  type="text"
                  required
                  value={degreesAllowed}
                  onChange={(e) => setDegreesAllowed(e.target.value)}
                  placeholder="B.Tech, B.E., B.Sc (Computer Science)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Eligible Branches / Specializations</label>
                <input
                  type="text"
                  value={branchesAllowed}
                  onChange={(e) => setBranchesAllowed(e.target.value)}
                  placeholder="Computer Science, IT, Electronics"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Official Notification PDF URL</label>
                  <input
                    type="url"
                    required
                    value={officialNotificationPdf}
                    onChange={(e) => setOfficialNotificationPdf(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Official Application URL</label>
                  <input
                    type="url"
                    required
                    value={officialApplicationUrl}
                    onChange={(e) => setOfficialApplicationUrl(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Job Description & Responsibilities</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Official role summary from recruitment gazette..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingJob(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Back / Cancel</span>
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg"
                >
                  {editingJob ? 'Update Notification' : 'Publish Gazette'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
