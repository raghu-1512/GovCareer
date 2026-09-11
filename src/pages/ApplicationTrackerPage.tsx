import React, { useState } from 'react';
import { JobApplication, JobApplicationStatus, Job } from '../types';
import { formatIndianDate, formatIndianNumber } from '../utils/formatters';
import { 
  CheckSquare, 
  Plus, 
  Calendar, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Building2, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  X,
  Layers,
  MapPin,
  ArrowLeft
} from 'lucide-react';

interface ApplicationTrackerPageProps {
  applications: JobApplication[];
  jobs: Job[];
  onCreateApplication: (payload: Partial<JobApplication> & { jobId: string }) => Promise<void>;
  onUpdateApplication: (id: string, payload: Partial<JobApplication>) => Promise<void>;
  onDeleteApplication: (id: string) => Promise<void>;
  onBack?: () => void;
}

export const ApplicationTrackerPage: React.FC<ApplicationTrackerPageProps> = ({
  applications,
  jobs,
  onCreateApplication,
  onUpdateApplication,
  onDeleteApplication,
  onBack,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);

  // New Application Form State
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || '');
  const [status, setStatus] = useState<JobApplicationStatus>('Applied');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examCenter, setExamCenter] = useState('');
  const [notes, setNotes] = useState('');

  const statuses: JobApplicationStatus[] = [
    'Interested',
    'Applied',
    'Admit Card',
    'Exam',
    'Interview',
    'Selected',
    'Rejected'
  ];

  const handleSaveNew = async (e: React.FormEvent) => {
    e.preventDefault();
    const chosenJob = jobs.find(j => j.id === selectedJobId);
    if (!chosenJob) return;

    await onCreateApplication({
      jobId: chosenJob.id,
      jobTitle: chosenJob.title,
      organization: chosenJob.organization,
      status,
      registrationNumber,
      rollNumber,
      examDate: examDate || undefined,
      examCenter: examCenter || undefined,
      notes: notes || undefined,
      appliedDate: new Date().toISOString().split('T')[0],
    });

    setShowAddModal(false);
    resetForm();
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;

    await onUpdateApplication(editingApp.id, {
      status,
      registrationNumber,
      rollNumber,
      examDate: examDate || undefined,
      examCenter: examCenter || undefined,
      notes: notes || undefined,
    });

    setEditingApp(null);
    resetForm();
  };

  const resetForm = () => {
    setRegistrationNumber('');
    setRollNumber('');
    setExamDate('');
    setExamCenter('');
    setNotes('');
    setStatus('Applied');
  };

  const openEditModal = (app: JobApplication) => {
    setEditingApp(app);
    setStatus(app.status);
    setRegistrationNumber(app.registrationNumber || '');
    setRollNumber(app.rollNumber || '');
    setExamDate(app.examDate || '');
    setExamCenter(app.examCenter || '');
    setNotes(app.notes || '');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          {onBack && (
            <button
              id="btn-tracker-back"
              onClick={onBack}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm group mt-0.5"
              title="Go back"
            >
              <ArrowLeft className="w-4 h-4 text-indigo-400 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <CheckSquare className="w-6 h-6 text-indigo-400" />
              <span>Government Application Tracker</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Track registration numbers, roll numbers, admit card statuses, and examination dates in one place.
            </p>
          </div>
        </div>

        <button
          id="btn-add-application"
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Track New Application</span>
        </button>
      </div>

      {/* Kanban / Pipeline View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { key: 'Interested', title: 'Interested / In Prep', color: 'border-slate-700 bg-slate-900/60' },
          { key: 'Applied', title: 'Form Submitted', color: 'border-blue-800/60 bg-blue-950/20' },
          { key: 'Admit Card', title: 'Admit Card / Exam', color: 'border-amber-800/60 bg-amber-950/20' },
          { key: 'Selected', title: 'Result / Final', color: 'border-emerald-800/60 bg-emerald-950/20' },
        ].map((column) => {
          const columnApps = applications.filter((app) => {
            if (column.key === 'Interested') return app.status === 'Interested';
            if (column.key === 'Applied') return app.status === 'Applied';
            if (column.key === 'Admit Card') return app.status === 'Admit Card' || app.status === 'Exam' || app.status === 'Interview';
            return app.status === 'Selected' || app.status === 'Rejected';
          });

          return (
            <div
              key={column.key}
              className={`p-4 rounded-3xl border ${column.color} flex flex-col space-y-3`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">
                  {column.title}
                </h3>
                <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full font-mono text-slate-400 font-bold">
                  {formatIndianNumber(columnApps.length)}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                {columnApps.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">No applications in this stage</p>
                ) : (
                  columnApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 space-y-2.5 transition-all shadow group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[11px] font-semibold text-blue-400 truncate">
                          {app.organization}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditModal(app)}
                            className="p-1 text-slate-400 hover:text-white"
                            title="Edit details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteApplication(app.id)}
                            className="p-1 text-slate-400 hover:text-rose-400"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-bold text-sm text-white line-clamp-2">
                        {app.jobTitle}
                      </h4>

                      <div className="text-xs space-y-1 text-slate-400 pt-1 border-t border-slate-800">
                        {app.registrationNumber && (
                          <div className="flex items-center justify-between">
                            <span>Reg No:</span>
                            <span className="font-mono text-slate-200">{app.registrationNumber}</span>
                          </div>
                        )}
                        {app.rollNumber && (
                          <div className="flex items-center justify-between">
                            <span>Roll No:</span>
                            <span className="font-mono text-slate-200">{app.rollNumber}</span>
                          </div>
                        )}
                        {app.examDate && (
                          <div className="flex items-center justify-between text-emerald-400 font-medium">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Exam Date:
                            </span>
                            <span className="font-mono">{formatIndianDate(app.examDate, { format: 'medium' })}</span>
                          </div>
                        )}
                        {app.examCenter && (
                          <div className="flex items-center justify-between text-slate-300">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              Center:
                            </span>
                            <span className="truncate max-w-[120px]">{app.examCenter}</span>
                          </div>
                        )}
                      </div>

                      {app.notes && (
                        <p className="text-[11px] text-slate-400 italic bg-slate-800/40 p-2 rounded-xl border border-slate-800">
                          "{app.notes}"
                        </p>
                      )}

                      <div className="pt-2 flex items-center justify-between">
                        <select
                          value={app.status}
                          onChange={(e) => onUpdateApplication(app.id, { status: e.target.value as any })}
                          className="bg-slate-800 border border-slate-700 text-xs rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
                        >
                          {statuses.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                        <span className="text-[10px] text-slate-400">
                          {app.appliedDate ? `Applied: ${formatIndianDate(app.appliedDate, { format: 'numeric' })}` : ''}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {(showAddModal || editingApp) && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingApp(null);
                  }}
                  className="p-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 text-xs font-semibold group transition-all"
                  title="Back to applications"
                >
                  <ArrowLeft className="w-4 h-4 text-indigo-400 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Back</span>
                </button>
                <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                  {editingApp ? 'Update Application Details' : 'Track New Government Job'}
                </h3>
              </div>

              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingApp(null);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-6">
              Record official credentials and exam center information for seamless tracking.
            </p>

            <form onSubmit={editingApp ? handleSaveEdit : handleSaveNew} className="space-y-4">
              {!editingApp && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Select Target Job Notification
                  </label>
                  <select
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {jobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.organization} - {j.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Current Stage</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Registration No.</label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="e.g. 2026SSC109283"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Roll No. / Hall Ticket</label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="e.g. 88392100"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Exam Date</label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Exam City / Center</label>
                  <input
                    type="text"
                    value={examCenter}
                    onChange={(e) => setExamCenter(e.target.value)}
                    placeholder="e.g. Bengaluru North"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Personal Notes / Strategy</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Need to revise CS operating systems & algorithms."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingApp(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
                >
                  {editingApp ? 'Save Changes' : 'Add to Tracker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
