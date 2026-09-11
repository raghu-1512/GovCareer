import { ExamEvent, Job, JobApplication, NotificationItem } from '../types';

export interface UrgentDeadlineAlert {
  id: string;
  sourceType: 'exam' | 'job' | 'application';
  sourceId: string;
  title: string;
  organization: string;
  deadlineType: 'application_closing' | 'exam_date' | 'admit_card';
  deadlineTypeLabel: string;
  deadlineDate: string; // YYYY-MM-DD
  daysRemaining: number;
  urgency: 'critical' | 'urgent' | 'upcoming';
  officialUrl?: string;
  notificationPdfUrl?: string;
  isSaved?: boolean;
}

/**
 * Calculates days remaining between reference date (or today) and target date.
 * Returns negative numbers if already passed.
 */
export function calculateDaysRemaining(targetDateStr: string, referenceDate: Date = new Date()): number {
  if (!targetDateStr) return -999;
  
  const target = new Date(targetDateStr);
  if (isNaN(target.getTime())) return -999;

  // Set times to midnight for clean day calculations
  const refMidnight = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const targetMidnight = new Date(target.getFullYear(), target.getMonth(), target.getDate());

  const diffMs = targetMidnight.getTime() - refMidnight.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Scans saved exams, saved jobs, and tracked applications for deadlines occurring within 7 days.
 */
export function getUpcoming7DayDeadlines(
  exams: ExamEvent[],
  jobs: Job[],
  savedJobIds: string[],
  applications: JobApplication[],
  referenceDate: Date = new Date()
): UrgentDeadlineAlert[] {
  const alerts: UrgentDeadlineAlert[] = [];

  // 1. Scan Saved Exams
  exams.forEach((exam) => {
    // Only check saved exams (or if user explicitly marked isSaved)
    if (exam.isSaved) {
      // Check Application Deadline
      if (exam.applicationDeadline) {
        const days = calculateDaysRemaining(exam.applicationDeadline, referenceDate);
        if (days >= 0 && days <= 7) {
          alerts.push({
            id: `alert-exam-app-${exam.id}`,
            sourceType: 'exam',
            sourceId: exam.id,
            title: exam.title,
            organization: exam.organization,
            deadlineType: 'application_closing',
            deadlineTypeLabel: 'Application Closing Deadline',
            deadlineDate: exam.applicationDeadline,
            daysRemaining: days,
            urgency: days <= 2 ? 'critical' : days <= 4 ? 'urgent' : 'upcoming',
            officialUrl: exam.officialUrl,
            notificationPdfUrl: exam.notificationPdfUrl,
            isSaved: true,
          });
        }
      }

      // Check Exam Date if within 7 days
      if (exam.examDate) {
        const days = calculateDaysRemaining(exam.examDate, referenceDate);
        if (days >= 0 && days <= 7) {
          alerts.push({
            id: `alert-exam-date-${exam.id}`,
            sourceType: 'exam',
            sourceId: exam.id,
            title: exam.title,
            organization: exam.organization,
            deadlineType: 'exam_date',
            deadlineTypeLabel: 'Exam Date / Sitting',
            deadlineDate: exam.examDate,
            daysRemaining: days,
            urgency: days <= 2 ? 'critical' : 'urgent',
            officialUrl: exam.officialUrl,
            notificationPdfUrl: exam.notificationPdfUrl,
            isSaved: true,
          });
        }
      }
    }
  });

  // 2. Scan Saved Jobs
  jobs.forEach((job) => {
    if (savedJobIds.includes(job.id) && job.applicationDeadline) {
      const days = calculateDaysRemaining(job.applicationDeadline, referenceDate);
      if (days >= 0 && days <= 7) {
        // Avoid duplicate if already covered by exam
        const alreadyAdded = alerts.some(
          a => a.title.toLowerCase() === job.title.toLowerCase() || a.sourceId === job.id
        );
        if (!alreadyAdded) {
          alerts.push({
            id: `alert-job-${job.id}`,
            sourceType: 'job',
            sourceId: job.id,
            title: job.title,
            organization: job.organization,
            deadlineType: 'application_closing',
            deadlineTypeLabel: 'Application Window Closing',
            deadlineDate: job.applicationDeadline,
            daysRemaining: days,
            urgency: days <= 2 ? 'critical' : days <= 4 ? 'urgent' : 'upcoming',
            officialUrl: job.officialApplicationUrl || job.officialSourceUrl,
            notificationPdfUrl: job.officialNotificationPdf,
            isSaved: true,
          });
        }
      }
    }
  });

  // 3. Scan Tracked Applications
  applications.forEach((app) => {
    if (app.notificationDeadline) {
      const days = calculateDaysRemaining(app.notificationDeadline, referenceDate);
      if (days >= 0 && days <= 7) {
        const alreadyAdded = alerts.some(a => a.sourceId === app.jobId || a.id === `alert-app-${app.id}`);
        if (!alreadyAdded) {
          alerts.push({
            id: `alert-app-${app.id}`,
            sourceType: 'application',
            sourceId: app.jobId || app.id,
            title: app.jobTitle,
            organization: app.organization,
            deadlineType: 'application_closing',
            deadlineTypeLabel: `Tracked Application (${app.status})`,
            deadlineDate: app.notificationDeadline,
            daysRemaining: days,
            urgency: days <= 2 ? 'critical' : 'urgent',
            officialUrl: app.officialUrl,
            isSaved: true,
          });
        }
      }
    }
  });

  // Sort by closest deadline first (0 days, 1 day, 2 days...)
  return alerts.sort((a, b) => a.daysRemaining - b.daysRemaining);
}

/**
 * Converts deadline alerts into standard NotificationItem objects to populate the notification center.
 */
export function generateDeadlineNotifications(
  alerts: UrgentDeadlineAlert[],
  userId: string = 'user'
): NotificationItem[] {
  return alerts.map((alert) => {
    const daysText = alert.daysRemaining === 0 
      ? 'TODAY is the LAST DAY!' 
      : alert.daysRemaining === 1 
      ? 'CLOSES TOMORROW!' 
      : `Closes in ${alert.daysRemaining} days!`;

    return {
      id: `notif-${alert.id}`,
      userId,
      title: `🚨 Urgent: ${alert.title} Deadline Alert (${daysText})`,
      message: `${alert.organization} - ${alert.deadlineTypeLabel} is on ${alert.deadlineDate}. Complete your application submission or preparation immediately before the official portal closes.`,
      type: 'deadline',
      date: new Date().toISOString(),
      read: false,
      link: alert.officialUrl,
      jobId: alert.sourceType === 'job' ? alert.sourceId : undefined,
    };
  });
}
