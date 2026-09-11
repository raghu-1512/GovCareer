export type EducationLevel = 
  | '10th Pass'
  | '12th Pass'
  | 'Diploma'
  | 'Graduation / Bachelor\'s'
  | 'B.Tech / B.E.'
  | 'Post Graduation / Master\'s'
  | 'MBBS / Medical'
  | 'LLB / Law'
  | 'PhD / Doctorate';

export type JobSector = 'Central' | 'State' | 'PSU' | 'Banking' | 'Defence' | 'Railways' | 'UPSC' | 'SSC' | 'Police' | 'Teaching' | 'Technical' | 'Defense & Aerospace' | 'Civil Services' | 'Staff Selection' | 'Banking & Insurance' | 'Engineering & Tech PSUs' | 'State PSC' | 'Regulatory Bodies';
export type SectorType = JobSector;
export type JobType = 'Central' | 'State' | 'PSU' | 'Autonomous' | 'All';

export type SocialCategory = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'PwBD';

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  category: SocialCategory;
  state: string;
  educationLevel: EducationLevel;
  degree: string;
  branch: string;
  graduationYear: number;
  percentageOrCgpa: string;
  skills: string[];
  experienceYears: number;
  experienceDetails?: string;
  preferredLocations: string[];
  preferredDepartments: string[];
  preferredSectors: JobSector[];
  minSalaryPreference?: number;
  willingToRelocate: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  profile: UserProfile;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  organization: string;
  department: string;
  sector: JobSector;
  jobType: 'Central' | 'State';
  state?: string; // for state govt jobs
  vacancies: number;
  salary: {
    min: number;
    max: number;
    payLevel: string; // e.g. "Pay Level 7 (₹44,900 - ₹1,42,400)"
  };
  location: string; // e.g. "All India" or specific state/city
  educationRequired: EducationLevel[];
  degreesAllowed: string[]; // e.g. ["B.Tech", "B.E.", "B.Sc Computer Science"]
  branchesAllowed?: string[]; // e.g. ["Computer Science", "IT", "Electronics", "Any"]
  minAge: number;
  maxAge: number;
  ageRelaxation?: {
    obc?: number;
    scSt?: number;
    pwd?: number;
  };
  experienceRequiredYears: number;
  experienceDescription?: string;
  applicationStartDate: string; // YYYY-MM-DD
  applicationDeadline: string; // YYYY-MM-DD
  examDate?: string; // YYYY-MM-DD
  admitCardDate?: string;
  resultDate?: string;
  selectionProcess: string[]; // e.g. ["Tier-1 Prelims", "Tier-2 Mains", "Skill Test", "Document Verification"]
  syllabus: {
    section: string;
    topics: string[];
    marks?: number;
  }[];
  description: string;
  officialSourceUrl: string;
  officialNotificationPdf: string;
  officialApplicationUrl: string;
  isVerified: boolean;
  lastVerifiedDate: string;
  tags: string[];
  isSampleData: boolean;
}

export type EligibilityStatus = 'eligible' | 'warning' | 'not_eligible';

export interface EligibilityCheckItem {
  factor: string; // e.g. "Education", "Degree", "Age", "Experience", "State / Domicile"
  pass: boolean | 'warning';
  userValue: string;
  requirement: string;
  note: string;
}

export interface EligibilityResult {
  jobId: string;
  status: EligibilityStatus;
  score: number; // 0 to 100
  title: string;
  reason: string;
  checks: EligibilityCheckItem[];
  recommendationExplanation?: string;
}

export type ApplicationStatus = 
  | 'Interested'
  | 'Applied'
  | 'Application Submitted'
  | 'Admit Card'
  | 'Exam'
  | 'Result'
  | 'Interview'
  | 'Selected'
  | 'Not Selected'
  | 'Rejected';

export type JobApplicationStatus = ApplicationStatus;

export interface JobApplication {
  id: string;
  userId: string;
  jobId: string;
  jobTitle: string;
  organization: string;
  appliedDate: string;
  status: ApplicationStatus;
  registrationNumber?: string;
  rollNumber?: string;
  examCenter?: string;
  examDate?: string;
  notes?: string;
  updatedAt: string;
  notificationDeadline: string;
  officialUrl?: string;
}

export interface ExamEvent {
  id: string;
  title: string;
  organization: string;
  category: JobSector;
  applicationStartDate: string;
  applicationDeadline: string;
  admitCardDate?: string;
  examDate: string;
  resultDate?: string;
  officialUrl: string;
  notificationPdfUrl?: string;
  syllabusOverview: string;
  totalVacancies: number;
  isSaved?: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'job_match' | 'deadline' | 'admit_card' | 'exam' | 'result' | 'system';
  date: string;
  read: boolean;
  link?: string;
  jobId?: string;
}

export interface StudyPlanSubject {
  name: string;
  weightage: string;
  estimatedHours: number;
  topics: string[];
}

export interface StudyPlanWeek {
  weekNumber: number;
  title: string;
  focus: string;
  tasks: {
    id: string;
    task: string;
    completed: boolean;
    duration: string;
  }[];
  mockTestGoal: string;
}

export interface StudyPlan {
  id: string;
  userId: string;
  examName: string;
  targetExamDate: string;
  dailyHours: number;
  totalWeeks: number;
  generatedDate: string;
  subjects: StudyPlanSubject[];
  weeks: StudyPlanWeek[];
  revisionStrategy: string[];
  mockTestSchedule: string[];
  expertTips: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedPrompts?: string[];
  isAiGenerated?: boolean;
}

export interface SkillAlignmentItem {
  skill: string;
  relevance: string;
  level: 'High' | 'Moderate' | 'Advantage' | 'Growth';
}

export interface CareerImpactAnalysis {
  summary: string;
  matchScore: number;
  skillAlignment: SkillAlignmentItem[];
  strategicAdvantage: string;
  growthPotential: string;
  recommendedPrepFocus: string;
  isAiGenerated: boolean;
}

export interface SystemStats {
  totalUsers: number;
  activeJobs: number;
  verifiedJobs: number;
  totalApplications: number;
  upcomingExams: number;
  savedJobsCount: number;
}
