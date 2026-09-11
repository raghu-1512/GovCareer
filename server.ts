import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import webpush from 'web-push';
import { INITIAL_JOBS } from './src/data/mockJobs.ts';
import { INITIAL_EXAMS } from './src/data/mockExams.ts';
import { evaluateJobEligibility } from './src/utils/eligibilityEngine.ts';
import { Job, User, UserProfile, JobApplication, NotificationItem, ExamEvent } from './src/types.ts';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'govcareer-super-secret-jwt-key-2026';
const PORT = 3000;

// VAPID Web Push Configuration
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBKr3qBUYIHBQFLXYp5Nksh8U';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || 'UUxI25n293yC3yU01e2-Q9gK0Yy51wA1B3C5D7E9F1G';

try {
  webpush.setVapidDetails(
    'mailto:notifications@govcareer.gov.in',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
} catch (vapidErr) {
  console.warn('VAPID setup notice:', vapidErr);
}

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Default Demo User Profile
const DEFAULT_DEMO_PROFILE: UserProfile = {
  name: 'Raghu Mullu',
  email: 'mulluraghu15@gmail.com',
  phone: '+91 98765 43210',
  dateOfBirth: '2002-04-15', // Age ~24 in 2026
  gender: 'Male',
  category: 'General',
  state: 'Karnataka',
  educationLevel: 'B.Tech / B.E.',
  degree: 'B.Tech',
  branch: 'Computer Science and Engineering',
  graduationYear: 2024,
  percentageOrCgpa: '8.4 CGPA',
  skills: ['Data Structures', 'Python', 'Java', 'SQL', 'Algorithms', 'Reasoning', 'Quantitative Aptitude'],
  experienceYears: 1,
  experienceDetails: '1 year experience as Associate Software Engineer',
  preferredLocations: ['Bengaluru', 'New Delhi', 'Hyderabad', 'All India'],
  preferredDepartments: ['Space Research (ISRO)', 'Electronics & IT (NIC / MeitY)', 'Banking & Regulators (SEBI / RBI)', 'Civil Services (UPSC)'],
  preferredSectors: ['Technical', 'Central', 'Banking', 'UPSC', 'SSC'],
  minSalaryPreference: 45000,
  willingToRelocate: true,
};

const LANGUAGE_PROMPT_INFO: Record<string, { name: string; nativeName: string; fallbackText: string }> = {
  te: { name: 'Telugu', nativeName: 'తెలుగు', fallbackText: 'GovCareer AI ప్రస్తుతం అందుబాటులో లేదు. సాధారణ నోటిఫికేషన్ మార్గదర్శకాల ప్రకారం: 10వ తరగతి, ఇంటర్, డిప్లొమా, డిగ్రీ మరియు B.Tech అభ్యర్థులకు కేంద్ర మరియు రాష్ట్ర ప్రభుత్వాలలో అనేక ఉద్యోగ అవకాశాలు అందుబాటులో ఉన్నాయి. దయచేసి అధికారిక నోటిఫికేషన్లను పరిశీలించండి.' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', fallbackText: 'GovCareer AI वर्तमान में उपलब्ध नहीं है। सामान्य अधिसूचना दिशानिर्देशों के अनुसार: 10वीं, 12वीं, डिप्लोमा, स्नातक और बी.टेक उम्मीदवारों के लिए केंद्र और राज्य सरकारों में कई पद उपलब्ध हैं। कृपया आधिकारिक अधिसूचनाएं देखें।' },
  ta: { name: 'Tamil', nativeName: 'தமிழ்', fallbackText: 'GovCareer AI தற்போது கிடைக்கவில்லை. 10ஆம் வகுப்பு, 12ஆம் வகுப்பு, டிப்ளமோ, பட்டப்படிப்பு மற்றும் பி.டெக் விண்ணப்பதாரர்களுக்கு பல்வேறு அரசுப் பணிகள் உள்ளன. அதிகாரப்பூர்வ அறிவிப்புகளைப் பார்க்கவும்.' },
  kn: { name: 'Kannada', nativeName: 'ಕನ್ನಡ', fallbackText: 'GovCareer AI ಪ್ರಸ್ತುತ ಲಭ್ಯವಿಲ್ಲ. 10ನೇ ತರಗತಿ, ಪಿಯುಸಿ, ಡಿಪ್ಲೋಮಾ, ಪದವಿ ಮತ್ತು ಬಿ.ಟೆಕ್ ಅಭ್ಯರ್ಥಿಗಳಿಗೆ ಹಲವು ಸರ್ಕಾರಿ ಉದ್ಯೋಗಾವಕಾಶಗಳು ಲಭ್ಯವಿದೆ. ಅಧಿಕೃತ ಅಧಿಸೂಚನೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.' },
  ml: { name: 'Malayalam', nativeName: 'മലയാളം', fallbackText: 'GovCareer AI ഇപ്പോൾ ലഭ്യമല്ല. 10-ാം ക്ലാസ്, പ്ലസ് ടു, ഡിപ്ലോമ, ബിരുദം, ബി.ടെക് ഉദ്യോഗാർത്ഥികൾക്ക് നിരവധി സർക്കാർ തൊഴിലവസരങ്ങൾ ലഭ്യമാണ്. ഔദ്യോഗിക വിജ്ഞാപനങ്ങൾ പരിശോധിക്കുക.' },
  mr: { name: 'Marathi', nativeName: 'मराठी', fallbackText: 'GovCareer AI सध्या उपलब्ध नाही. 10वी, 12वी, डिप्लोमा, पदवीधर आणि बी.टेक उमेदवारांसाठी अनेक सरकारी नोकऱ्या उपलब्ध आहेत. कृपया अधिकृत अधिसूचना तपासा.' },
  bn: { name: 'Bengali', nativeName: 'বাংলা', fallbackText: 'GovCareer AI বর্তমানে অনুপলব্ধ। ১০ম, ১২ম, ডিপ্লোমা, স্নাতক ও বি.টেক প্রার্থীদের জন্য একাধিক সরকারি চাকরির সুযোগ রয়েছে। অনুগ্রহ করে অফিসিয়াল বিজ্ঞপ্তি দেখুন।' },
  gu: { name: 'Gujarati', nativeName: 'ગુજરાતી', fallbackText: 'GovCareer AI હાલમાં ઉપલબ્ધ નથી. 10મું, 12મું, ડિપ્લોમા, ગ્રેજ્યુએટ અને બી.ટેક ઉમેદવારો માટે વિવિધ સરਕਾਰੀ ભરતીઓ ઉપલબ્ધ છે. કૃપા કરીને સત્તાવાર સૂચના જુઓ.' },
  pa: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', fallbackText: 'GovCareer AI ਇਸ ਸਮੇਂ ਉਪਲਬਧ ਨਹੀਂ ਹੈ। 10ਵੀਂ, 12ਵੀਂ, ਡਿਪਲੋਮਾ, ਗ੍ਰੈਜੂਏਟ ਅਤੇ ਬੀ.ਟੈਕ ਉਮੀਦਵਾਰਾਂ ਲਈ ਸਰਕਾਰੀ ਨੌਕਰੀਆਂ ਦੇ ਕਈ ਮੌਕੇ ਹਨ। ਕਿਰਪਾ ਕਰਕੇ ਅਧਿਕਾਰਤ ਨੋਟੀਫਿਕੇਸ਼ਨ ਦੇਖੋ।' },
  or: { name: 'Odia', nativeName: 'ଓଡ଼ିଆ', fallbackText: 'GovCareer AI ବର୍ତ୍ତମାନ ଉପଲବ୍ଧ ନାହିଁ। ୧୦ମ, ୧୨ଶ, ଡିପ୍ଲୋମା, ସ୍ନାତକ ଏବଂ ବି.ଟେକ୍ ପ୍ରାର୍ଥୀଙ୍କ ପାଇଁ ଅନେକ ସରକାରୀ ଚାକିରି ସୁଯୋଗ ରହିଛି। ଦୟାକରି ସରକାରୀ ବିଜ୍ଞପ୍ତି ଦେଖନ୍ତୁ।' },
  en: { name: 'English', nativeName: 'English', fallbackText: 'GovCareer AI is temporarily unavailable. Based on standard notification guidelines: 10th pass, 12th, Diploma, Degree and B.Tech candidates have numerous vacancies across Central, State, PSU and Banking sectors. Please check official notification portals for detailed notices.' },
};

// In-Memory App State
interface PushSubscriptionRecord {
  endpoint: string;
  keys?: {
    p256dh: string;
    auth: string;
  };
  userId?: string;
  createdAt: string;
}

interface DatabaseState {
  users: Array<User & { passwordHash: string }>;
  jobs: Job[];
  exams: ExamEvent[];
  savedJobIds: Record<string, string[]>; // userId -> jobId[]
  applications: Record<string, JobApplication[]>; // userId -> JobApplication[]
  notifications: Record<string, NotificationItem[]>; // userId -> NotificationItem[]
  pushSubscriptions: PushSubscriptionRecord[];
}

const db: DatabaseState = {
  users: [
    {
      id: 'usr-demo-1',
      email: 'mulluraghu15@gmail.com',
      name: 'Raghu Mullu',
      role: 'user',
      passwordHash: bcrypt.hashSync('demo1234', 8),
      profile: DEFAULT_DEMO_PROFILE,
      createdAt: '2026-08-01T10:00:00Z',
    },
    {
      id: 'usr-admin-1',
      email: 'admin@govcareer.gov.in',
      name: 'GovCareer Administrator',
      role: 'admin',
      passwordHash: bcrypt.hashSync('admin1234', 8),
      profile: {
        ...DEFAULT_DEMO_PROFILE,
        name: 'GovCareer Admin',
        email: 'admin@govcareer.gov.in',
      },
      createdAt: '2026-01-01T10:00:00Z',
    }
  ],
  jobs: [...INITIAL_JOBS],
  exams: [...INITIAL_EXAMS],
  pushSubscriptions: [],
  savedJobIds: {
    'usr-demo-1': ['job-isro-scientist-2026', 'job-nic-scientist-b-2026', 'job-sebi-grade-a-2026'],
  },
  applications: {
    'usr-demo-1': [
      {
        id: 'app-101',
        userId: 'usr-demo-1',
        jobId: 'job-isro-scientist-2026',
        jobTitle: 'Scientist / Engineer \'SC\' (Computer Science / IT)',
        organization: 'Indian Space Research Organisation (ISRO)',
        appliedDate: '2026-08-05',
        status: 'Application Submitted',
        registrationNumber: 'ISRO-ICRB-2026-CS8842',
        rollNumber: '26CS084192',
        examCenter: 'Bengaluru (Centre Code 102)',
        examDate: '2026-11-22',
        notes: 'Completed form payment. Downloaded confirmation PDF. Core CS revision ongoing.',
        updatedAt: '2026-08-05T14:30:00Z',
        notificationDeadline: '2026-09-15',
        officialUrl: 'https://www.isro.gov.in',
      },
      {
        id: 'app-102',
        userId: 'usr-demo-1',
        jobId: 'job-ssc-cgl-2026',
        jobTitle: 'Assistant Section Officer (ASO) & Inspector of Income Tax',
        organization: 'Staff Selection Commission (SSC)',
        appliedDate: '2026-07-22',
        status: 'Admit Card',
        registrationNumber: 'SSC-CGL-26-891044',
        rollNumber: '3201089311',
        examCenter: 'Bengaluru South Shift 2',
        examDate: '2026-10-18',
        notes: 'Admit card downloaded. Tier-1 mock scores currently averaging 145/200.',
        updatedAt: '2026-08-10T11:00:00Z',
        notificationDeadline: '2026-08-30',
        officialUrl: 'https://ssc.gov.in',
      },
      {
        id: 'app-103',
        userId: 'usr-demo-1',
        jobId: 'job-sebi-grade-a-2026',
        jobTitle: 'Assistant Manager (Grade A) - Information Technology',
        organization: 'Securities and Exchange Board of India (SEBI)',
        appliedDate: '2026-08-02',
        status: 'Interested',
        registrationNumber: '',
        notes: 'Need to review SQL and network security sections of Phase 1 Paper 2 syllabus before applying.',
        updatedAt: '2026-08-02T09:15:00Z',
        notificationDeadline: '2026-08-25',
        officialUrl: 'https://www.sebi.gov.in',
      },
      {
        id: 'app-104',
        userId: 'usr-demo-1',
        jobId: 'job-nic-scientist-b-2026',
        jobTitle: 'Scientist \'B\' & Scientific / Technical Assistant \'A\'',
        organization: 'National Informatics Centre (NIC)',
        appliedDate: '2026-08-08',
        status: 'Applied',
        registrationNumber: 'NIELIT-NIC-2026-90412',
        notes: 'Submitted online form via NIELIT Calicut portal. Awaiting application approval.',
        updatedAt: '2026-08-08T18:20:00Z',
        notificationDeadline: '2026-09-18',
        officialUrl: 'https://www.nic.in',
      }
    ]
  },
  notifications: {
    'usr-demo-1': [
      {
        id: 'notif-1',
        userId: 'usr-demo-1',
        title: 'New Matching Job: ISRO Scientist \'SC\' (CSE)',
        message: 'B.Tech CSE candidates are eligible. Pay Level 10 (₹56,100). Application closes on 15 Sept 2026.',
        type: 'job_match',
        date: '2026-08-14T09:00:00Z',
        read: false,
        jobId: 'job-isro-scientist-2026',
        link: '/jobs/job-isro-scientist-2026',
      },
      {
        id: 'notif-2',
        userId: 'usr-demo-1',
        title: 'Application Deadline Approaching: SEBI Grade A',
        message: 'Only 10 days remaining to submit application for SEBI Grade A Assistant Manager (IT). Closes 25 August 2026.',
        type: 'deadline',
        date: '2026-08-15T07:30:00Z',
        read: false,
        jobId: 'job-sebi-grade-a-2026',
        link: '/jobs/job-sebi-grade-a-2026',
      },
      {
        id: 'notif-3',
        userId: 'usr-demo-1',
        title: 'Admit Card Alert: SSC CGL Tier-1',
        message: 'City intimation and admit card download links will be active from 5 October 2026 for Exam on 18 Oct.',
        type: 'admit_card',
        date: '2026-08-13T16:45:00Z',
        read: true,
        jobId: 'job-ssc-cgl-2026',
        link: '/exams',
      }
    ]
  }
};

// Helper middleware: Auth extraction
function authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // Return null user if optional, or unauthorized
    (req as any).user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      (req as any).user = null;
    } else {
      (req as any).user = user;
    }
    next();
  });
}

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!(req as any).user) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }
  next();
}

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use(authenticateToken);

  // Standalone Single-File Direct Access & Download Routes
  app.get('/standalone.html', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'govcareer-standalone-portal.html'));
  });

  app.get('/download-single-file', (req, res) => {
    res.download(path.join(process.cwd(), 'govcareer-standalone-portal.html'), 'GovCareer-Portal-Standalone.html');
  });

  // ==========================================
  // AUTHENTICATION ROUTES
  // ==========================================
  app.post('/api/auth/register', (req, res) => {
    try {
      const { name, email, password, profile } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Name, email, and password are required.' });
      }

      const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ error: 'An account with this email already exists.' });
      }

      const userProfile: UserProfile = {
        name,
        email,
        dateOfBirth: profile?.dateOfBirth || '2002-01-01',
        gender: profile?.gender || 'Prefer not to say',
        category: profile?.category || 'General',
        state: profile?.state || 'All India',
        educationLevel: profile?.educationLevel || 'B.Tech / B.E.',
        degree: profile?.degree || 'B.Tech',
        branch: profile?.branch || 'Computer Science and Engineering',
        graduationYear: profile?.graduationYear || 2024,
        percentageOrCgpa: profile?.percentageOrCgpa || '75%',
        skills: profile?.skills || ['Reasoning', 'Quantitative Aptitude', 'General Studies'],
        experienceYears: profile?.experienceYears || 0,
        experienceDetails: profile?.experienceDetails || '',
        preferredLocations: profile?.preferredLocations || ['All India'],
        preferredDepartments: profile?.preferredDepartments || ['Central Government', 'Technical'],
        preferredSectors: profile?.preferredSectors || ['Technical', 'Central', 'Banking'],
        minSalaryPreference: profile?.minSalaryPreference || 35000,
        willingToRelocate: profile?.willingToRelocate ?? true,
      };

      const newUser: User & { passwordHash: string } = {
        id: `usr-${Date.now()}`,
        email,
        name,
        role: email.includes('admin') ? 'admin' : 'user',
        passwordHash: bcrypt.hashSync(password, 8),
        profile: userProfile,
        createdAt: new Date().toISOString(),
      };

      db.users.push(newUser);
      db.savedJobIds[newUser.id] = [];
      db.applications[newUser.id] = [];
      db.notifications[newUser.id] = [
        {
          id: `notif-${Date.now()}`,
          userId: newUser.id,
          title: 'Welcome to GovCareer! 🎯',
          message: 'Your profile has been registered. View your personalized recommendations in the Dashboard.',
          type: 'system',
          date: new Date().toISOString(),
          read: false,
        }
      ];

      const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
      const { passwordHash, ...userWithoutPassword } = newUser;
      
      res.json({ token, user: userWithoutPassword });
    } catch (err: any) {
      console.error('Register error:', err);
      res.status(500).json({ error: 'Failed to create account.' });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      const { passwordHash, ...userWithoutPassword } = user;

      res.json({ token, user: userWithoutPassword });
    } catch (err: any) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Failed to login.' });
    }
  });

  app.get('/api/auth/me', (req, res) => {
    const authUser = (req as any).user;
    if (!authUser) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = db.users.find(u => u.id === authUser.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { passwordHash, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  });

  app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    res.json({ message: `If an account with ${email} exists, password reset instructions have been dispatched.` });
  });

  // ==========================================
  // PROFILE ROUTES
  // ==========================================
  app.get('/api/users/profile', requireAuth, (req, res) => {
    const authUser = (req as any).user;
    const user = db.users.find(u => u.id === authUser.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ profile: user.profile });
  });

  app.put('/api/users/profile', requireAuth, (req, res) => {
    const authUser = (req as any).user;
    const user = db.users.find(u => u.id === authUser.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.profile = {
      ...user.profile,
      ...req.body,
    };
    if (req.body.name) user.name = req.body.name;

    const { passwordHash, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, message: 'Profile updated successfully.' });
  });

  // ==========================================
  // JOBS ROUTES (SEARCH, DETAILS, RECOMMENDATIONS)
  // ==========================================
  app.get('/api/jobs', (req, res) => {
    let results = [...db.jobs];
    const {
      q,
      sector,
      jobType,
      qualification,
      minSalary,
      maxAge,
      state,
      department,
      sortBy,
      verifiedOnly
    } = req.query;

    if (q && typeof q === 'string') {
      const query = q.toLowerCase();
      results = results.filter(job => 
        job.title.toLowerCase().includes(query) ||
        job.organization.toLowerCase().includes(query) ||
        job.department.toLowerCase().includes(query) ||
        job.tags.some(t => t.toLowerCase().includes(query)) ||
        job.location.toLowerCase().includes(query) ||
        job.degreesAllowed.some(d => d.toLowerCase().includes(query))
      );
    }

    if (sector && typeof sector === 'string' && sector !== 'All') {
      results = results.filter(job => job.sector === sector);
    }

    if (jobType && typeof jobType === 'string' && jobType !== 'All') {
      results = results.filter(job => job.jobType === jobType);
    }

    if (qualification && typeof qualification === 'string' && qualification !== 'All') {
      results = results.filter(job => job.educationRequired.includes(qualification as any));
    }

    if (minSalary) {
      const minSal = Number(minSalary);
      if (!isNaN(minSal)) {
        results = results.filter(job => job.salary.min >= minSal);
      }
    }

    if (maxAge) {
      const age = Number(maxAge);
      if (!isNaN(age)) {
        results = results.filter(job => job.maxAge >= age);
      }
    }

    if (state && typeof state === 'string' && state !== 'All') {
      results = results.filter(job => 
        job.location.toLowerCase().includes(state.toLowerCase()) || 
        job.location.toLowerCase().includes('all india') ||
        (job.state && job.state.toLowerCase() === state.toLowerCase())
      );
    }

    if (department && typeof department === 'string' && department !== 'All') {
      results = results.filter(job => job.department.toLowerCase().includes(department.toLowerCase()) || job.organization.toLowerCase().includes(department.toLowerCase()));
    }

    if (verifiedOnly === 'true') {
      results = results.filter(job => job.isVerified);
    }

    // Sorting
    if (sortBy === 'deadline') {
      results.sort((a, b) => new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime());
    } else if (sortBy === 'salary_desc') {
      results.sort((a, b) => b.salary.min - a.salary.min);
    } else if (sortBy === 'vacancies_desc') {
      results.sort((a, b) => b.vacancies - a.vacancies);
    } else if (sortBy === 'newest') {
      results.sort((a, b) => new Date(b.applicationStartDate).getTime() - new Date(a.applicationStartDate).getTime());
    }

    res.json({ jobs: results, total: results.length });
  });

  app.get('/api/jobs/recommended', (req, res) => {
    const authUser = (req as any).user;
    let profile: UserProfile = DEFAULT_DEMO_PROFILE;

    if (authUser) {
      const user = db.users.find(u => u.id === authUser.id);
      if (user) profile = user.profile;
    }

    const scoredJobs = db.jobs.map(job => {
      const eligibility = evaluateJobEligibility(job, profile);
      let matchScore = eligibility.score;

      // Bonus for sector preference
      if (profile.preferredSectors?.includes(job.sector)) {
        matchScore += 10;
      }
      // Bonus for salary preference
      if (profile.minSalaryPreference && job.salary.min >= profile.minSalaryPreference) {
        matchScore += 5;
      }

      return {
        job,
        eligibility,
        matchScore: Math.min(99, matchScore),
      };
    });

    // Sort by match score descending
    scoredJobs.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      recommended: scoredJobs,
      userProfileSummary: {
        degree: profile.degree,
        branch: profile.branch,
        category: profile.category,
        experienceYears: profile.experienceYears,
      }
    });
  });

  app.get('/api/jobs/:id', (req, res) => {
    const job = db.jobs.find(j => j.id === req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ job });
  });

  app.post('/api/jobs/:id/eligibility', (req, res) => {
    const job = db.jobs.find(j => j.id === req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    let profile = req.body.profile;
    if (!profile) {
      const authUser = (req as any).user;
      if (authUser) {
        const user = db.users.find(u => u.id === authUser.id);
        if (user) profile = user.profile;
      }
    }

    const result = evaluateJobEligibility(job, profile || DEFAULT_DEMO_PROFILE);
    res.json({ eligibility: result });
  });

  // ==========================================
  // SAVED JOBS ROUTES
  // ==========================================
  app.get('/api/saved-jobs', requireAuth, (req, res) => {
    const authUser = (req as any).user;
    const savedIds = db.savedJobIds[authUser.id] || [];
    const savedJobs = db.jobs.filter(j => savedIds.includes(j.id));
    res.json({ savedJobs, savedIds });
  });

  app.post('/api/saved-jobs/toggle', requireAuth, (req, res) => {
    const authUser = (req as any).user;
    const { jobId } = req.body;
    if (!jobId) return res.status(400).json({ error: 'jobId is required' });

    if (!db.savedJobIds[authUser.id]) {
      db.savedJobIds[authUser.id] = [];
    }

    const index = db.savedJobIds[authUser.id].indexOf(jobId);
    let isSaved = false;

    if (index > -1) {
      db.savedJobIds[authUser.id].splice(index, 1);
      isSaved = false;
    } else {
      db.savedJobIds[authUser.id].push(jobId);
      isSaved = true;
    }

    res.json({ isSaved, savedIds: db.savedJobIds[authUser.id] });
  });

  // ==========================================
  // APPLICATION TRACKER ROUTES
  // ==========================================
  app.get('/api/applications', requireAuth, (req, res) => {
    const authUser = (req as any).user;
    const apps = db.applications[authUser.id] || [];
    res.json({ applications: apps });
  });

  app.post('/api/applications', requireAuth, (req, res) => {
    const authUser = (req as any).user;
    const { jobId, status, registrationNumber, rollNumber, examCenter, examDate, notes } = req.body;

    const job = db.jobs.find(j => j.id === jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    if (!db.applications[authUser.id]) {
      db.applications[authUser.id] = [];
    }

    // Check if application already exists for this job
    const existingIndex = db.applications[authUser.id].findIndex(a => a.jobId === jobId);
    if (existingIndex > -1) {
      // Update existing
      const updated = {
        ...db.applications[authUser.id][existingIndex],
        status: status || db.applications[authUser.id][existingIndex].status,
        registrationNumber: registrationNumber ?? db.applications[authUser.id][existingIndex].registrationNumber,
        rollNumber: rollNumber ?? db.applications[authUser.id][existingIndex].rollNumber,
        examCenter: examCenter ?? db.applications[authUser.id][existingIndex].examCenter,
        examDate: examDate ?? db.applications[authUser.id][existingIndex].examDate,
        notes: notes ?? db.applications[authUser.id][existingIndex].notes,
        updatedAt: new Date().toISOString(),
      };
      db.applications[authUser.id][existingIndex] = updated;
      return res.json({ application: updated, message: 'Application updated.' });
    }

    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      userId: authUser.id,
      jobId: job.id,
      jobTitle: job.title,
      organization: job.organization,
      appliedDate: new Date().toISOString().split('T')[0],
      status: status || 'Interested',
      registrationNumber: registrationNumber || '',
      rollNumber: rollNumber || '',
      examCenter: examCenter || '',
      examDate: examDate || job.examDate || '',
      notes: notes || '',
      updatedAt: new Date().toISOString(),
      notificationDeadline: job.applicationDeadline,
      officialUrl: job.officialApplicationUrl,
    };

    db.applications[authUser.id].push(newApp);
    res.json({ application: newApp, message: 'Application tracked successfully.' });
  });

  app.put('/api/applications/:id', requireAuth, (req, res) => {
    const authUser = (req as any).user;
    const userApps = db.applications[authUser.id] || [];
    const appIndex = userApps.findIndex(a => a.id === req.params.id);

    if (appIndex === -1) return res.status(404).json({ error: 'Application not found' });

    userApps[appIndex] = {
      ...userApps[appIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    res.json({ application: userApps[appIndex], message: 'Status updated.' });
  });

  app.delete('/api/applications/:id', requireAuth, (req, res) => {
    const authUser = (req as any).user;
    const userApps = db.applications[authUser.id] || [];
    const filtered = userApps.filter(a => a.id !== req.params.id);
    db.applications[authUser.id] = filtered;
    res.json({ message: 'Application deleted.', applications: filtered });
  });

  // ==========================================
  // EXAMS CALENDAR ROUTES
  // ==========================================
  app.get('/api/exams', (req, res) => {
    res.json({ exams: db.exams });
  });

  app.post('/api/exams/:id/toggle-save', requireAuth, (req, res) => {
    const exam = db.exams.find(e => e.id === req.params.id);
    if (!exam) return res.status(404).json({ error: 'Exam not found' });
    exam.isSaved = !exam.isSaved;
    res.json({ exam });
  });

  // ==========================================
  // NOTIFICATIONS ROUTES
  // ==========================================
  app.get('/api/notifications', (req, res) => {
    const authUser = (req as any).user;
    const userId = authUser ? authUser.id : 'usr-demo-1';
    const notifs = db.notifications[userId] || [];
    res.json({ notifications: notifs, unreadCount: notifs.filter(n => !n.read).length });
  });

  app.put('/api/notifications/:id/read', requireAuth, (req, res) => {
    const authUser = (req as any).user;
    const notifs = db.notifications[authUser.id] || [];
    const notif = notifs.find(n => n.id === req.params.id);
    if (notif) notif.read = true;
    res.json({ success: true, notifs });
  });

  app.put('/api/notifications/mark-all-read', requireAuth, (req, res) => {
    const authUser = (req as any).user;
    const notifs = db.notifications[authUser.id] || [];
    notifs.forEach(n => { n.read = true; });
    res.json({ success: true, notifications: notifs });
  });

  // ==========================================
  // AI CAREER ASSISTANT & STUDY PLANNER (GEMINI 3.7 FLASH)
  // ==========================================
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, conversationHistory, contextJobId, language } = req.body;
      if (!message) return res.status(400).json({ error: 'Message is required.' });

      const langCode = (language || 'en').toLowerCase();
      const langInfo = LANGUAGE_PROMPT_INFO[langCode] || LANGUAGE_PROMPT_INFO['en'];
      const isEnglish = langCode === 'en';

      const authUser = (req as any).user;
      let userProfile = DEFAULT_DEMO_PROFILE;
      if (authUser) {
        const u = db.users.find(usr => usr.id === authUser.id);
        if (u) userProfile = u.profile;
      }

      let jobContextInfo = '';
      if (contextJobId) {
        const j = db.jobs.find(jb => jb.id === contextJobId);
        if (j) {
          jobContextInfo = `\nContextual Job Target: ${j.title} at ${j.organization} (Vacancies: ${j.vacancies}, Min Qualification: ${j.educationRequired.join(', ')}, Branches: ${j.branchesAllowed?.join(', ')}, Age: ${j.minAge}-${j.maxAge}, Deadline: ${j.applicationDeadline}, Syllabus: ${JSON.stringify(j.syllabus)})`;
        }
      }

      // Available active jobs list summary for AI reference
      const availableJobsSummary = db.jobs.map(j => 
        `- [${j.id}] ${j.title} (${j.organization}) - Required: ${j.educationRequired.join('/')}, Branches: ${j.branchesAllowed?.join('/') || 'Any'}, Max Age: ${j.maxAge}, Deadline: ${j.applicationDeadline}, Salary: ₹${j.salary.min}-₹${j.salary.max}`
      ).join('\n');

      const languageInstruction = !isEnglish
        ? `\nCRITICAL LANGUAGE INSTRUCTION: The candidate's active interface language is ${langInfo.name} (${langInfo.nativeName}). You MUST provide all career advice, exam patterns, eligibility guidance, preparation strategy, syllabus breakdowns, and suggested follow-up prompts in fluent, natural, grammatically correct ${langInfo.name} (${langInfo.nativeName} script). You can include standard technical/exam abbreviations in brackets for clarity (e.g. eligibility terms, exam acronyms like SSC, UPSC, ISRO). Ensure your answers are thoroughly helpful, encouraging, and easy to read in ${langInfo.name}.`
        : `\nLanguage: Respond in clear, professional English.`;

      const systemInstruction = `You are the GovCareer AI Career Advisor — an expert advisor for Indian Government Jobs (UPSC, SSC, PSU, Banking, ISRO, DRDO, State PSCs, Railways, Defence, Teaching, 10th/12th/Diploma/Degree/B.Tech opportunities).
Your mission is to provide clear, actionable, and structured guidance for candidates seeking government careers.
${languageInstruction}

User Profile:
- Name: ${userProfile.name}
- Age: ~24 (DOB: ${userProfile.dateOfBirth})
- Category: ${userProfile.category} (Note reservation age relaxations: OBC +3 yrs, SC/ST +5 yrs, PwBD +10 yrs)
- Highest Qualification: ${userProfile.educationLevel} (${userProfile.degree} in ${userProfile.branch}, ${userProfile.percentageOrCgpa})
- Experience: ${userProfile.experienceYears} years
- State: ${userProfile.state}
- Skills: ${userProfile.skills.join(', ')}
- Preferred Sectors: ${userProfile.preferredSectors.join(', ')}
${jobContextInfo}

Available Verified Jobs in System:
${availableJobsSummary}

Key Directives:
1. Always reference accurate eligibility rules, syllabus structure, exam tiers, and realistic preparation timeframes.
2. For any educational level (10th Pass, 12th Pass, Diploma, Graduate, B.Tech, Master's, PhD), highlight matching opportunities across technical and non-technical vacancies.
3. Structure your answers with clear Markdown formatting (bullet points, bold key terms, numbered steps).
4. Distinguish AI strategic guidance from official notification rules. Always advise verifying final criteria on official notification PDFs.
5. Provide 2-3 helpful suggested follow-up questions at the very end formatted as JSON array on the last line like: [SUGGESTIONS: ["Question 1", "Question 2", "Question 3"]] ${!isEnglish ? `(ensure the suggestions are written in ${langInfo.name})` : ''}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: message,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const rawText = response.text || langInfo.fallbackText;
      
      // Extract suggestions if present
      let cleanedText = rawText;
      let suggestedPrompts: string[] = isEnglish ? [
        'What is the exam pattern for ISRO Scientist SC?',
        'Which govt jobs don\'t require an interview?',
        'How should I prepare for Quantitative Aptitude?',
      ] : [
        `${langInfo.nativeName}: Top recommended exams for my qualification`,
        `${langInfo.nativeName}: Salary and benefits comparison`,
        `${langInfo.nativeName}: Best 3-month preparation strategy`,
      ];

      const suggestionMatch = rawText.match(/\[SUGGESTIONS:\s*(\[.*?\])\]/s);
      if (suggestionMatch && suggestionMatch[1]) {
        try {
          suggestedPrompts = JSON.parse(suggestionMatch[1]);
          cleanedText = rawText.replace(/\[SUGGESTIONS:\s*\[.*?\]\]/s, '').trim();
        } catch (e) {
          // ignore parse error
        }
      }

      res.json({
        reply: cleanedText,
        suggestedPrompts,
        isAiGenerated: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } catch (err: any) {
      console.error('Gemini chat error:', err);
      const langCode = (req.body?.language || 'en').toLowerCase();
      const langInfo = LANGUAGE_PROMPT_INFO[langCode] || LANGUAGE_PROMPT_INFO['en'];
      res.json({ 
        reply: langInfo.fallbackText,
        isAiGenerated: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }
  });

  app.post('/api/ai/study-plan', async (req, res) => {
    try {
      const { examName, availableDailyHours, totalWeeks, targetDate, customFocus, language } = req.body;
      const langCode = (language || 'en').toLowerCase();
      const langInfo = LANGUAGE_PROMPT_INFO[langCode] || LANGUAGE_PROMPT_INFO['en'];
      const isEnglish = langCode === 'en';
      const hours = availableDailyHours || 4;
      const weeks = totalWeeks || 8;
      const targetExam = examName || 'SSC CGL 2026';

      const prompt = `Generate a comprehensive, structured study plan for the candidate preparing for "${targetExam}".
Available daily preparation time: ${hours} hours/day.
Total preparation timeline: ${weeks} weeks (Target Exam Date: ${targetDate || 'Upcoming in 2-3 months'}).
Specific focus / weak areas: ${customFocus || 'Balanced coverage across all syllabus sections'}.
${!isEnglish ? `CRITICAL REQUIREMENT: Output all subject names, weekly titles, task descriptions, revision strategies, mock test schedules, and expert tips in fluent, natural ${langInfo.name} (${langInfo.nativeName} script) so candidates can follow easily.` : ''}

Return the response STRICTLY as a valid JSON object with the following schema:
{
  "examName": "${targetExam}",
  "dailyHours": ${hours},
  "totalWeeks": ${weeks},
  "subjects": [
    {
      "name": "${!isEnglish ? `${langInfo.nativeName} Subject Name` : 'Subject Name'}",
      "weightage": "e.g. 25% (50 Marks)",
      "estimatedHours": 30,
      "topics": ["Topic 1", "Topic 2", "Topic 3"]
    }
  ],
  "weeks": [
    {
      "weekNumber": 1,
      "title": "${!isEnglish ? `Week 1 in ${langInfo.name}` : 'Week 1: Core Foundation & Speed Maths'}",
      "focus": "${!isEnglish ? `Focus in ${langInfo.name}` : 'High-yield fundamental concepts'}",
      "tasks": [
        { "id": "w1-t1", "task": "${!isEnglish ? `Task in ${langInfo.name}` : 'Task description with specific topic'}", "completed": false, "duration": "2 hrs" }
      ],
      "mockTestGoal": "${!isEnglish ? `Mock test goal in ${langInfo.name}` : 'Attempt 1 diagnostic sectional mock'}"
    }
  ],
  "revisionStrategy": [
    "${!isEnglish ? `Revision strategy in ${langInfo.name}` : 'Daily 45-min flashcard formula review'}",
    "${!isEnglish ? `Weekend error review in ${langInfo.name}` : 'Weekend error log analysis'}"
  ],
  "mockTestSchedule": [
    "${!isEnglish ? `Mock test schedule in ${langInfo.name}` : 'Weeks 1-4: 1 Sectional test every 3 days'}",
    "${!isEnglish ? `Full mocks schedule in ${langInfo.name}` : 'Weeks 5-8: 2 Full-length timed mocks per week'}"
  ],
  "expertTips": [
    "${!isEnglish ? `Expert tip in ${langInfo.name}` : 'Prioritize previous 5 years official question papers'}",
    "${!isEnglish ? `Tip 2 in ${langInfo.name}` : 'Maintain a separate notebook for recurring calculation traps'}"
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        }
      });

      const planJson = JSON.parse(response.text?.trim() || '{}');
      res.json({ studyPlan: planJson });
    } catch (err: any) {
      console.error('Study planner error:', err);
      // Return solid structured fallback plan
      res.json({
        studyPlan: {
          examName: req.body.examName || 'Government Exam Comprehensive Preparation',
          dailyHours: req.body.availableDailyHours || 4,
          totalWeeks: req.body.totalWeeks || 8,
          subjects: [
            {
              name: 'Quantitative Aptitude / Maths',
              weightage: '30% (50 Marks)',
              estimatedHours: 40,
              topics: ['Percentage & Profit-Loss', 'Ratio & Proportion', 'Time & Work', 'Algebra & Geometry', 'Data Interpretation']
            },
            {
              name: 'General Intelligence & Reasoning',
              weightage: '25% (50 Marks)',
              estimatedHours: 30,
              topics: ['Puzzles & Seating Arrangement', 'Syllogism', 'Coding-Decoding', 'Blood Relations', 'Non-Verbal Patterns']
            },
            {
              name: 'General Awareness & Current Affairs',
              weightage: '25% (50 Marks)',
              estimatedHours: 35,
              topics: ['Indian Polity & Constitution', 'Modern History', 'Economy & Budget', 'General Science', 'Last 6 Months Current Affairs']
            },
            {
              name: 'English Language & Comprehension',
              weightage: '20% (50 Marks)',
              estimatedHours: 25,
              topics: ['Grammar Rules & Error Spotting', 'Reading Comprehension', 'Cloze Test', 'Vocabulary & Idioms']
            }
          ],
          weeks: Array.from({ length: 8 }).map((_, i) => ({
            weekNumber: i + 1,
            title: `Week ${i + 1}: ${i < 3 ? 'Concept Building & High Weightage Chapters' : i < 6 ? 'Speed Practice & Sectional Drills' : 'Full Length Mocks & High Speed Revision'}`,
            focus: i < 3 ? 'Foundations & Formula Mastery' : i < 6 ? 'Time-pressured practice' : 'Exam Simulation',
            tasks: [
              { id: `w${i+1}-t1`, task: `Master Core Topics for Week ${i + 1}`, completed: i === 0, duration: '2 hrs' },
              { id: `w${i+1}-t2`, task: 'Solve 50 Previous Year Questions (PYQs)', completed: false, duration: '1.5 hrs' },
              { id: `w${i+1}-t3`, task: 'Daily Current Affairs & Editorial Reading', completed: false, duration: '30 mins' },
            ],
            mockTestGoal: `Attempt ${i < 4 ? '1 Sectional Test' : '2 Full Mock Tests with Error Diary Review'}`,
          })),
          revisionStrategy: [
            'Daily morning 30-min review of formulas and tables',
            'Weekly Sunday error-book analysis to identify recurring negative marks',
            'Final 10 days strictly dedicated to PYQs and mental calculation speed'
          ],
          mockTestSchedule: [
            'Weeks 1 to 4: 2 Sectional mocks per week',
            'Weeks 5 to 7: 3 Full-length mocks per week with real exam timing',
            'Week 8: 4 Mocks with detailed percentile tracking'
          ],
          expertTips: [
            'Never leave negative marking questions to guesswork in CBT exams',
            'Master skip-strategy: identify and skip lengthy 3-minute puzzles on first pass',
            'Revise GS notes in active recall format rather than passive re-reading'
          ]
        }
      });
    }
  });

  app.post('/api/ai/career-impact', async (req, res) => {
    try {
      const { jobId, job: passedJob, profile: passedProfile, language } = req.body;
      const langCode = (language || 'en').toLowerCase();
      const langInfo = LANGUAGE_PROMPT_INFO[langCode] || LANGUAGE_PROMPT_INFO['en'];
      const isEnglish = langCode === 'en';

      let job: Job | undefined = passedJob;
      if (!job && jobId) {
        job = db.jobs.find(j => j.id === jobId);
      }
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      const authUser = (req as any).user;
      let userProfile = passedProfile || DEFAULT_DEMO_PROFILE;
      if (!passedProfile && authUser) {
        const u = db.users.find(usr => usr.id === authUser.id);
        if (u && u.profile) userProfile = u.profile;
      }

      const userSkills = userProfile.skills && userProfile.skills.length > 0 
        ? userProfile.skills.join(', ') 
        : 'Data Structures, Python, Quantitative Aptitude, Logical Reasoning';

      const prompt = `You are the GovCareer AI Career & Skills Alignment Engine for Indian Government Jobs.
Analyze how this specific government job vacancy directly aligns with the candidate's exact education and skill set.

Candidate Profile:
- Candidate Name: ${userProfile.name}
- Highest Qualification: ${userProfile.educationLevel} (${userProfile.degree} in ${userProfile.branch}, ${userProfile.percentageOrCgpa})
- Experience: ${userProfile.experienceYears} years (${userProfile.experienceDetails || 'None'})
- Core Skills: ${userSkills}
- Category: ${userProfile.category}
- Preferred Sectors: ${userProfile.preferredSectors ? userProfile.preferredSectors.join(', ') : 'General'}

Target Government Recruitment:
- Title: ${job.title}
- Organization: ${job.organization} (Department: ${job.department}, Sector: ${job.sector}, Cadre: ${job.jobType})
- Total Vacancies: ${job.vacancies}
- Pay Scale: Rs ${job.salary.min} - ${job.salary.max} (${job.salary.payLevel})
- Required Education: ${job.educationRequired ? job.educationRequired.join(', ') : 'Graduation'}
- Allowed Degrees: ${job.degreesAllowed ? job.degreesAllowed.join(', ') : 'Any'}
- Allowed Branches: ${job.branchesAllowed ? job.branchesAllowed.join(', ') : 'Any'}
- Exam Syllabus Structure: ${JSON.stringify(job.syllabus)}
- Selection Process: ${job.selectionProcess ? job.selectionProcess.join(' -> ') : 'Written Exam & DV'}
- Job Description: ${job.description}

Analyze candidate-to-job fit and return STRICTLY a valid JSON object matching this schema:
{
  "summary": "A concise, motivating 2-3 sentence overview highlighting how this specific role harnesses the candidate's exact skill set, education, and career trajectory.",
  "matchScore": 88,
  "skillAlignment": [
    {
      "skill": "Name of candidate skill (e.g. Data Structures / Quantitative Aptitude / Python / Problem Solving)",
      "relevance": "Concrete reason how this skill directly applies to the exam syllabus topics or day-to-day role responsibilities in this department",
      "level": "High"
    }
  ],
  "strategicAdvantage": "A punchy statement describing the candidate's unique edge over competitors (e.g., strong engineering problem-solving, quantitative mastery, or domain background).",
  "growthPotential": "Clear description of promotional avenues, pay level progression (e.g., from Level 7 to Level 11+), job security, and career reputation in this department.",
  "recommendedPrepFocus": "Targeted advice on which 1-2 high-weightage topics the candidate should prioritize based on their existing skillset."
}

${!isEnglish ? `CRITICAL REQUIREMENT: Output the "summary", "relevance", "strategicAdvantage", "growthPotential", and "recommendedPrepFocus" in fluent, natural ${langInfo.name} (${langInfo.nativeName} script) so the candidate can read easily.` : ''}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        }
      });

      const careerImpact = JSON.parse(response.text?.trim() || '{}');
      careerImpact.isAiGenerated = true;
      res.json({ careerImpact });
    } catch (err: any) {
      console.error('Career impact generation error:', err);
      // Fallback calculation
      const { job: passedJob, jobId, profile: passedProfile, language } = req.body;
      const langCode = (language || 'en').toLowerCase();
      const isEnglish = langCode === 'en';

      let job: Job = passedJob || db.jobs.find(j => j.id === jobId) || db.jobs[0];
      let userProfile = passedProfile || DEFAULT_DEMO_PROFILE;

      const userSkills = userProfile.skills && userProfile.skills.length > 0
        ? userProfile.skills
        : ['Data Structures', 'Quantitative Aptitude', 'Reasoning', 'Python', 'SQL'];

      const fallbackSkillAlignment = userSkills.slice(0, 4).map((skill: string, idx: number) => {
        let level: 'High' | 'Moderate' | 'Advantage' | 'Growth' = idx === 0 ? 'High' : idx === 1 ? 'Advantage' : 'Moderate';
        let relevance = `Essential for ${job.organization} examination syllabus and performance in ${job.title} role.`;
        const lowerSkill = skill.toLowerCase();
        if (lowerSkill.includes('python') || lowerSkill.includes('data') || lowerSkill.includes('algo') || lowerSkill.includes('java') || lowerSkill.includes('sql')) {
          relevance = `Gives strong technical advantage in domain-specific papers and computerized technical tasks at ${job.organization}.`;
          level = 'High';
        } else if (lowerSkill.includes('quant') || lowerSkill.includes('math') || lowerSkill.includes('aptitude')) {
          relevance = `Directly covers core scoring modules in screening & prelim exams with speed calculation benefits.`;
          level = 'High';
        } else if (lowerSkill.includes('reasoning') || lowerSkill.includes('logic')) {
          relevance = `Boosts accuracy in analytical reasoning and non-verbal pattern recognition modules.`;
          level = 'Advantage';
        }
        return {
          skill,
          relevance,
          level,
        };
      });

      const fallbackSummary = isEnglish
        ? `With a ${userProfile.educationLevel} background in ${userProfile.branch} and proficiency in ${userSkills.slice(0, 3).join(', ')}, you possess a competitive edge for ${job.organization}'s ${job.title}. Your analytical foundation directly aligns with the official selection process.`
        : `${userProfile.degree || 'డిగ్రీ'} (${userProfile.branch || 'ఇంజనీరింగ్'}) నేపథ్యం మరియు ${userSkills.slice(0, 2).join(', ')} నైపుణ్యాలతో మీరు ${job.organization} లోని ${job.title} ఉద్యోగానికి అత్యుత్తమంగా సరిపోతారు. మీ విద్యా నేపథ్యం పరీక్ష సిలబస్‌కు నేరుగా ఉపయోగపడుతుంది.`;

      res.json({
        careerImpact: {
          summary: fallbackSummary,
          matchScore: 88,
          skillAlignment: fallbackSkillAlignment,
          strategicAdvantage: isEnglish
            ? `Your strong foundation in ${userSkills[0] || 'Technical problem solving'} provides higher scoring efficiency in technical/analytical tiers.`
            : `మీకున్న సాంకేతిక మరియు విశ్లేషణాత్మక నైపుణ్యాలు పరీక్షలో ఎక్కువ స్కోరు సాధించడానికి తోడ్పడతాయి.`,
          growthPotential: isEnglish
            ? `Excellent stability under ${job.salary.payLevel} with structured central/state promotion timelines and lifetime government benefits.`
            : `${job.salary.payLevel} కింద అద్భుతమైన ఉద్యోగ భద్రత మరియు స్థిరమైన ప్రమోషన్ అవకాశాలు ఉన్నాయి.`,
          recommendedPrepFocus: isEnglish
            ? `Focus on standard syllabus papers and practice mock tests for ${job.organization} to maximize accuracy.`
            : `అధికారిక సిలబస్ అంశాలపై పట్టు సాధించి గత ప్రశ్నపత్రాలను (PYQs) క్రమం తప్పకుండా ప్రాక్టీస్ చేయండి.`,
          isAiGenerated: false,
        }
      });
    }
  });

  // ==========================================
  // ADMIN DASHBOARD ROUTES
  // ==========================================
  app.get('/api/admin/stats', (req, res) => {
    const totalUsers = db.users.length;
    const activeJobs = db.jobs.length;
    const verifiedJobs = db.jobs.filter(j => j.isVerified).length;
    let totalApplications = 0;
    Object.values(db.applications).forEach(apps => { totalApplications += apps.length; });
    const upcomingExams = db.exams.length;
    let savedJobsCount = 0;
    Object.values(db.savedJobIds).forEach(s => { savedJobsCount += s.length; });

    res.json({
      stats: {
        totalUsers,
        activeJobs,
        verifiedJobs,
        totalApplications,
        upcomingExams,
        savedJobsCount,
      }
    });
  });

  app.post('/api/admin/jobs', (req, res) => {
    const jobData: Partial<Job> = req.body;
    if (!jobData.title || !jobData.organization || !jobData.applicationDeadline) {
      return res.status(400).json({ error: 'Title, Organization and Deadline are required.' });
    }

    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: jobData.title,
      organization: jobData.organization,
      department: jobData.department || 'Govt Department',
      sector: jobData.sector || 'Central',
      jobType: jobData.jobType || 'Central',
      state: jobData.state,
      vacancies: Number(jobData.vacancies) || 100,
      salary: jobData.salary || { min: 44900, max: 142400, payLevel: 'Pay Level 7' },
      location: jobData.location || 'All India',
      educationRequired: jobData.educationRequired || ['Graduation / Bachelor\'s'],
      degreesAllowed: jobData.degreesAllowed || ['Any Bachelor\'s Degree'],
      branchesAllowed: jobData.branchesAllowed || ['Any'],
      minAge: Number(jobData.minAge) || 18,
      maxAge: Number(jobData.maxAge) || 30,
      ageRelaxation: jobData.ageRelaxation || { obc: 3, scSt: 5, pwd: 10 },
      experienceRequiredYears: Number(jobData.experienceRequiredYears) || 0,
      experienceDescription: jobData.experienceDescription || 'Freshers eligible',
      applicationStartDate: jobData.applicationStartDate || new Date().toISOString().split('T')[0],
      applicationDeadline: jobData.applicationDeadline,
      examDate: jobData.examDate || '',
      admitCardDate: jobData.admitCardDate || '',
      resultDate: jobData.resultDate || '',
      selectionProcess: jobData.selectionProcess || ['Written Examination', 'Document Verification'],
      syllabus: jobData.syllabus || [{ section: 'General Aptitude', topics: ['Reasoning', 'Quantitative', 'General Awareness'] }],
      description: jobData.description || 'Government vacancy notification.',
      officialSourceUrl: jobData.officialSourceUrl || 'https://govcareer.gov.in',
      officialNotificationPdf: jobData.officialNotificationPdf || 'https://govcareer.gov.in/notice.pdf',
      officialApplicationUrl: jobData.officialApplicationUrl || 'https://govcareer.gov.in/apply',
      isVerified: jobData.isVerified ?? true,
      lastVerifiedDate: new Date().toISOString().split('T')[0],
      tags: jobData.tags || ['New Notification', 'Govt Job'],
      isSampleData: false,
    };

    db.jobs.unshift(newJob);

    // Also broadcast a system notification
    Object.keys(db.notifications).forEach(uId => {
      db.notifications[uId].unshift({
        id: `notif-${Date.now()}-${uId}`,
        userId: uId,
        title: `New Verified Job: ${newJob.title}`,
        message: `${newJob.organization} has released notification for ${newJob.vacancies} vacancies. Deadline: ${newJob.applicationDeadline}.`,
        type: 'job_match',
        date: new Date().toISOString(),
        read: false,
        jobId: newJob.id,
        link: `/jobs/${newJob.id}`,
      });
    });

    // Broadcast native Web Push notification to all subscribed devices
    broadcastPushNotification({
      title: `🚨 New Govt Job: ${newJob.title}`,
      body: `${newJob.organization} • ${newJob.vacancies} Vacancies. Apply before ${newJob.applicationDeadline}.`,
      url: `/?tab=search&jobId=${newJob.id}`,
      jobId: newJob.id
    }).catch(err => console.warn('Push broadcast error:', err));

    res.json({ job: newJob, message: 'Job notification created and broadcasted via Web Push.' });
  });

  app.put('/api/admin/jobs/:id', (req, res) => {
    const jobIndex = db.jobs.findIndex(j => j.id === req.params.id);
    if (jobIndex === -1) return res.status(404).json({ error: 'Job not found' });

    db.jobs[jobIndex] = {
      ...db.jobs[jobIndex],
      ...req.body,
      lastVerifiedDate: new Date().toISOString().split('T')[0],
    };

    res.json({ job: db.jobs[jobIndex], message: 'Job updated.' });
  });

  app.delete('/api/admin/jobs/:id', (req, res) => {
    const jobIndex = db.jobs.findIndex(j => j.id === req.params.id);
    if (jobIndex === -1) return res.status(404).json({ error: 'Job not found' });

    db.jobs.splice(jobIndex, 1);
    res.json({ success: true, message: 'Job notification removed.' });
  });

  // ==========================================
  // WEB PUSH SUBSCRIPTION & BROADCAST API
  // ==========================================
  async function broadcastPushNotification(payload: { title: string; body: string; url?: string; jobId?: string; icon?: string }) {
    if (db.pushSubscriptions.length === 0) return;

    const payloadString = JSON.stringify({
      title: payload.title,
      body: payload.body,
      url: payload.url || '/',
      jobId: payload.jobId || null,
      icon: payload.icon || '/icon-192.png',
      badge: '/icon-192-maskable.png',
      tag: payload.jobId ? `job-${payload.jobId}` : `govcareer-${Date.now()}`
    });

    const staleEndpoints: string[] = [];

    await Promise.all(
      db.pushSubscriptions.map(async (sub) => {
        try {
          const pushSubscription = {
            endpoint: sub.endpoint,
            keys: sub.keys ? {
              p256dh: sub.keys.p256dh,
              auth: sub.keys.auth
            } : undefined
          };
          await webpush.sendNotification(pushSubscription as any, payloadString);
        } catch (err: any) {
          // If subscription is expired or unsubscribed, queue for removal
          if (err.statusCode === 404 || err.statusCode === 410) {
            staleEndpoints.push(sub.endpoint);
          } else {
            console.warn('WebPush delivery issue for endpoint:', sub.endpoint.substring(0, 30), err.message);
          }
        }
      })
    );

    if (staleEndpoints.length > 0) {
      db.pushSubscriptions = db.pushSubscriptions.filter(s => !staleEndpoints.includes(s.endpoint));
    }
  }

  // Get VAPID Public Key
  app.get('/api/push/vapid-public-key', (req, res) => {
    res.json({
      publicKey: VAPID_PUBLIC_KEY,
      status: 'active'
    });
  });

  // Save Push Subscription
  app.post('/api/push/subscribe', (req, res) => {
    const { subscription, userId } = req.body;
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Valid subscription object is required.' });
    }

    const existingIndex = db.pushSubscriptions.findIndex(s => s.endpoint === subscription.endpoint);
    const subRecord: PushSubscriptionRecord = {
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      userId: userId || 'anonymous',
      createdAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      db.pushSubscriptions[existingIndex] = subRecord;
    } else {
      db.pushSubscriptions.push(subRecord);
    }

    res.json({
      success: true,
      message: 'Push subscription registered successfully.',
      totalSubscribers: db.pushSubscriptions.length
    });
  });

  // Unsubscribe Push
  app.post('/api/push/unsubscribe', (req, res) => {
    const { endpoint } = req.body;
    if (!endpoint) return res.status(400).json({ error: 'Endpoint is required.' });

    db.pushSubscriptions = db.pushSubscriptions.filter(s => s.endpoint !== endpoint);
    res.json({ success: true, message: 'Push subscription removed.' });
  });

  // Test Push Notification Trigger
  app.post('/api/push/test', async (req, res) => {
    const { title, body, url, jobId, subscription } = req.body;

    const alertPayload = {
      title: title || '⚡ GovCareer Test Notification',
      body: body || 'Real-time job notification push listener is active and connected!',
      url: url || (jobId ? `/?tab=search&jobId=${jobId}` : '/'),
      jobId: jobId || null
    };

    // If a direct subscription was provided in the test request
    if (subscription && subscription.endpoint) {
      try {
        await webpush.sendNotification(subscription, JSON.stringify(alertPayload));
        return res.json({ success: true, message: 'Test push notification sent directly to your device.' });
      } catch (err: any) {
        console.warn('Direct test push error:', err);
        return res.status(500).json({ error: 'Failed to send direct push notification', details: err.message });
      }
    }

    // Otherwise broadcast to all registered subscribers
    await broadcastPushNotification(alertPayload);
    res.json({
      success: true,
      message: `Test push sent to ${db.pushSubscriptions.length} subscriber(s).`,
      subscribersCount: db.pushSubscriptions.length
    });
  });

  // API 404 Catch-All (Guarantees all /api/* routes always return JSON, never HTML index.html)
  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: `API route ${req.method} ${req.path} not found.` });
  });

  // Global API Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.path.startsWith('/api/')) {
      console.error('API Error:', err);
      return res.status(500).json({ error: err?.message || 'An unexpected server error occurred.' });
    }
    next(err);
  });

  // ==========================================
  // STATIC ASSETS (PWA Manifest, Service Worker, Icons)
  // ==========================================
  const publicPath = path.join(process.cwd(), 'public');

  app.get(['/manifest.json', '/manifest.webmanifest'], (req, res) => {
    res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.sendFile(path.join(publicPath, 'manifest.json'));
  });

  app.get('/sw.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Service-Worker-Allowed', '/');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(path.join(publicPath, 'sw.js'));
  });

  app.use(express.static(publicPath, {
    setHeaders: (res, filePath) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
  }));

  // ==========================================
  // VITE MIDDLEWARE (SPA & CLIENT ASSETS)
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GovCareer server running on http://localhost:${PORT}`);
  });
}

startServer();
