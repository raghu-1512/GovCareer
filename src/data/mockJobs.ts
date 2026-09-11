import { Job } from '../types';

export const INITIAL_JOBS: Job[] = [
  // -------------------------------------------------------------
  // 1. 10TH PASS / MATRICULATION JOBS
  // -------------------------------------------------------------
  {
    id: 'job-india-post-gds-2026',
    title: 'Gramin Dak Sevak (GDS) - Branch Postmaster & ABPM',
    organization: 'Department of Posts (India Post)',
    department: 'Ministry of Communications, Govt of India',
    sector: 'Central',
    jobType: 'Central',
    vacancies: 44228,
    salary: {
      min: 12000,
      max: 29380,
      payLevel: 'TRCA Slab 1 & Slab 2 (₹12,000 - ₹29,380 + Allowances)',
    },
    location: 'Pan India (Across 23 Postal Circles, All Districts & Villages)',
    educationRequired: ['10th Pass'],
    degreesAllowed: ['10th Pass', 'Matriculation', 'SSC', 'High School Certificate'],
    branchesAllowed: ['Any'],
    minAge: 18,
    maxAge: 40,
    ageRelaxation: { obc: 3, scSt: 5, pwd: 10 },
    experienceRequiredYears: 0,
    experienceDescription: 'No written exam. Selection purely on 10th Standard Board Merit percentage. Compulsory study of local language & basic computer operation.',
    applicationStartDate: '2026-07-15',
    applicationDeadline: '2026-08-30',
    resultDate: '2026-09-25',
    selectionProcess: [
      'Automatic System Merit Generation based on 10th Class Percentage',
      'Document Verification at Divisional Head Post Office',
      'Joining Allotment'
    ],
    syllabus: [
      {
        section: 'Direct Merit (No Written Exam)',
        marks: 100,
        topics: ['10th Standard Mathematics & English marks weightage', 'Knowledge of local state language', 'Basic Computer Skills']
      }
    ],
    description: 'India Post recruitment for Branch Postmasters (BPM) and Assistant Branch Postmasters (ABPM) managing village post offices, savings bank accounts, IPPB digital banking, and parcel delivery.',
    officialSourceUrl: 'https://indiapostgdsonline.gov.in',
    officialNotificationPdf: 'https://indiapostgdsonline.gov.in',
    officialApplicationUrl: 'https://indiapostgdsonline.gov.in',
    isVerified: true,
    lastVerifiedDate: '2026-08-15',
    tags: ['10th Pass', 'India Post', 'GDS', 'No Exam', 'High Vacancies', 'Village & Town Jobs'],
    isSampleData: true,
  },
  {
    id: 'job-ssc-mts-2026',
    title: 'Multi-Tasking Staff (MTS) & Havaldar in CBIC and CBN',
    organization: 'Staff Selection Commission (SSC)',
    department: 'Central Govt Ministries & Central Board of Indirect Taxes & Customs',
    sector: 'SSC',
    jobType: 'Central',
    vacancies: 9583,
    salary: {
      min: 18000,
      max: 56900,
      payLevel: 'Pay Level 1 (Gross ₹28,000 - ₹34,000/mo)',
    },
    location: 'All India Central Government Offices',
    educationRequired: ['10th Pass'],
    degreesAllowed: ['10th Standard / Matriculation from recognized board'],
    branchesAllowed: ['Any'],
    minAge: 18,
    maxAge: 25,
    ageRelaxation: { obc: 3, scSt: 5, pwd: 10 },
    experienceRequiredYears: 0,
    experienceDescription: 'Fresh 10th pass students from any recognized educational board in India are eligible.',
    applicationStartDate: '2026-06-27',
    applicationDeadline: '2026-08-25',
    examDate: '2026-10-20',
    admitCardDate: '2026-10-08',
    resultDate: '2026-12-18',
    selectionProcess: [
      'Computer Based Examination (Session-1: Math & Reasoning; Session-2: GK & English)',
      'Physical Efficiency Test (PET/PST) for Havaldar posts only',
      'Document Verification'
    ],
    syllabus: [
      {
        section: 'Session 1: Numerical & Reasoning Ability',
        marks: 120,
        topics: ['Basic Arithmetic (HCF, LCM, Percentages, Ratios)', 'Elementary Reasoning (Coding, Series, Analogies)']
      },
      {
        section: 'Session 2: General Awareness & English Language',
        marks: 150,
        topics: ['General Science', 'History, Geography & Civics', 'Basic English Grammar & Vocabulary']
      }
    ],
    description: 'Staff Selection Commission MTS and Havaldar recruitment for general administrative support, office records management, and security in Central Secretariat and Customs offices.',
    officialSourceUrl: 'https://ssc.gov.in',
    officialNotificationPdf: 'https://ssc.gov.in',
    officialApplicationUrl: 'https://ssc.gov.in',
    isVerified: true,
    lastVerifiedDate: '2026-08-14',
    tags: ['10th Pass', 'SSC MTS', 'Central Govt', 'Havaldar', 'Pan India'],
    isSampleData: true,
  },
  {
    id: 'job-rrb-group-d-2026',
    title: 'Railway Group D (Track Maintainer, Pointsman & Assistant Workshop)',
    organization: 'Railway Recruitment Cell (RRC / RRB)',
    department: 'Ministry of Railways, Govt of India',
    sector: 'Railways',
    jobType: 'Central',
    vacancies: 32000,
    salary: {
      min: 18000,
      max: 56900,
      payLevel: 'Pay Level 1 (Gross ₹30,000 - ₹36,000/mo with Allowances)',
    },
    location: 'Pan India (Across 16 Railway Zonal Divisions)',
    educationRequired: ['10th Pass', 'Diploma'],
    degreesAllowed: ['10th Pass', '10th + ITI (NCVT/SCVT)', 'National Apprenticeship Certificate (NAC)'],
    branchesAllowed: ['Any'],
    minAge: 18,
    maxAge: 33,
    ageRelaxation: { obc: 3, scSt: 5, pwd: 10 },
    experienceRequiredYears: 0,
    experienceDescription: '10th pass candidates or ITI certificate holders eligible for railway track maintenance and electrical/mechanical workshops.',
    applicationStartDate: '2026-08-01',
    applicationDeadline: '2026-09-15',
    examDate: '2026-11-30',
    admitCardDate: '2026-11-18',
    resultDate: '2027-01-30',
    selectionProcess: [
      'Single Stage Computer Based Test (CBT - 100 Questions)',
      'Physical Efficiency Test (PET: 35kg weight carry + 1000m running)',
      'Document Verification and Medical Fitness Standard (A-2 / B-1 / C-1)'
    ],
    syllabus: [
      {
        section: 'General Science (Physics, Chemistry, Life Science)',
        marks: 25,
        topics: ['10th Standard CBSE/State Board basic science concepts']
      },
      {
        section: 'Mathematics & Reasoning',
        marks: 55,
        topics: ['Number system, Bodmas, Decimals, Fractions, Profit & Loss, Syllogism, Venn diagrams']
      },
      {
        section: 'General Awareness on Current Affairs',
        marks: 20,
        topics: ['Science & Tech, Sports, Culture, Personalities, Economics, Politics']
      }
    ],
    description: 'Indian Railways massive recruitment drive for operational ground staff across rail networks ensuring safe track operation, train shunting, and signal maintenance.',
    officialSourceUrl: 'https://www.rrbcdg.gov.in',
    officialNotificationPdf: 'https://www.rrbapply.gov.in',
    officialApplicationUrl: 'https://www.rrbapply.gov.in',
    isVerified: true,
    lastVerifiedDate: '2026-08-15',
    tags: ['10th Pass', 'Railways', 'Group D', 'High Vacancies', 'Central Govt'],
    isSampleData: true,
  },
  {
    id: 'job-army-agniveer-gd-2026',
    title: 'Indian Army Agniveer (General Duty & Tradesmen)',
    organization: 'Indian Army (Ministry of Defence)',
    department: 'Directorate General of Recruiting',
    sector: 'Defence',
    jobType: 'Central',
    vacancies: 25000,
    salary: {
      min: 30000,
      max: 40000,
      payLevel: 'Agniveer Customized Package (1st Year: ₹30,000 to 4th Year: ₹40,000 + Seva Nidhi ₹11.71 Lakhs)',
    },
    location: 'Army Recruitment Rallies (All Districts of India)',
    educationRequired: ['10th Pass'],
    degreesAllowed: ['Class 10th / Matric with 45% marks in aggregate and 33% in each subject'],
    branchesAllowed: ['Any'],
    minAge: 17.5 as any,
    maxAge: 21,
    ageRelaxation: { obc: 0, scSt: 0, pwd: 0 },
    experienceRequiredYears: 0,
    experienceDescription: 'Fresh school passouts. Physical fitness rally standards: 1.6 km run in 5 mins 30 secs, pull-ups, 9ft ditch.',
    applicationStartDate: '2026-07-20',
    applicationDeadline: '2026-08-30',
    examDate: '2026-10-15',
    admitCardDate: '2026-10-01',
    resultDate: '2026-11-20',
    selectionProcess: [
      'Phase-I: Online Common Entrance Exam (CEE)',
      'Phase-II: Recruitment Rally Physical Fitness Test (PFT) & Physical Measurement Test (PMT)',
      'Phase-III: Medical Examination & Enrolment'
    ],
    syllabus: [
      {
        section: 'General Knowledge & General Science',
        marks: 30,
        topics: ['History, Culture, Geography, Indian Constitution', 'Basic Physics, Chemistry, Biology of 10th level']
      },
      {
        section: 'Maths & Logical Reasoning',
        marks: 20,
        topics: ['Arithmetic, Algebra, Geometry, Basic logic']
      }
    ],
    description: 'Enrolment under the Agnipath scheme in combat arms (Infantry, Artillery, Armoured Corps) and support services of the Indian Army.',
    officialSourceUrl: 'https://joinindianarmy.nic.in',
    officialNotificationPdf: 'https://joinindianarmy.nic.in',
    officialApplicationUrl: 'https://joinindianarmy.nic.in',
    isVerified: true,
    lastVerifiedDate: '2026-08-15',
    tags: ['10th Pass', 'Indian Army', 'Agniveer', 'Defence', 'Patriotism'],
    isSampleData: true,
  },

  // -------------------------------------------------------------
  // 2. 12TH PASS / INTERMEDIATE (10+2) JOBS
  // -------------------------------------------------------------
  {
    id: 'job-ssc-chsl-2026',
    title: 'Lower Division Clerk (LDC), Junior Secretariat Assistant & DEO',
    organization: 'Staff Selection Commission (SSC)',
    department: 'Central Ministries, Constitutional Bodies & Subordinate Departments',
    sector: 'SSC',
    jobType: 'Central',
    vacancies: 3712,
    salary: {
      min: 19900,
      max: 81100,
      payLevel: 'Pay Level 2 (₹19,900) & Pay Level 4 (₹25,500 - ₹81,100)',
    },
    location: 'New Delhi & Major Cities across India',
    educationRequired: ['12th Pass'],
    degreesAllowed: ['12th Standard / Intermediate / 10+2 in Any Stream (Science, Arts, Commerce)'],
    branchesAllowed: ['Any'],
    minAge: 18,
    maxAge: 27,
    ageRelaxation: { obc: 3, scSt: 5, pwd: 10 },
    experienceRequiredYears: 0,
    experienceDescription: 'Fresh 12th pass students from any recognized board in India. Basic typing speed (35 wpm English or 30 wpm Hindi) tested at skill stage.',
    applicationStartDate: '2026-08-01',
    applicationDeadline: '2026-09-10',
    examDate: '2026-11-12',
    admitCardDate: '2026-10-30',
    resultDate: '2026-12-28',
    selectionProcess: [
      'Tier-I Computer Based Examination (Objective 100 Questions)',
      'Tier-II Computer Based Examination (Mathematical Abilities, Reasoning, English, General Awareness + Computer Knowledge)',
      'Skill Test / Typing Test',
      'Document Verification'
    ],
    syllabus: [
      {
        section: 'English Language & Comprehension',
        marks: 50,
        topics: ['Spot the Error', 'Fill in the Blanks', 'Synonyms/Antonyms', 'Idioms & Phrases', 'One Word Substitution']
      },
      {
        section: 'Quantitative Aptitude & Reasoning',
        marks: 100,
        topics: ['Arithmetic (Decimals, Percentages, Ratios, Averages, Interest)', 'Algebra, Geometry, Mensuration', 'Analogy, Classification, Series']
      },
      {
        section: 'General Awareness',
        marks: 50,
        topics: ['Current Events', 'Indian History', 'Culture, Geography', 'Economic Scene', 'General Policy']
      }
    ],
    description: 'SSC CHSL 2026 recruitment for key administrative support staff, clerk typists, and computer data entry operators across central secretariats and departments.',
    officialSourceUrl: 'https://ssc.gov.in',
    officialNotificationPdf: 'https://ssc.gov.in',
    officialApplicationUrl: 'https://ssc.gov.in',
    isVerified: true,
    lastVerifiedDate: '2026-08-14',
    tags: ['12th Pass', 'SSC CHSL', 'Central Govt', 'Clerk', 'DEO', 'Any Stream'],
    isSampleData: true,
  },
  {
    id: 'job-upsc-nda-2026',
    title: 'National Defence Academy & Naval Academy (NDA & NA)',
    organization: 'Union Public Service Commission (UPSC)',
    department: 'Ministry of Defence (Army, Navy, and Air Force Wings)',
    sector: 'UPSC',
    jobType: 'Central',
    vacancies: 400,
    salary: {
      min: 56100,
      max: 177500,
      payLevel: 'Stipend during Cadet Training: ₹56,100/mo; Commissioned as Lieutenant (Level 10)',
    },
    location: 'NDA Khadakwasla, Pune / INA Ezhimala, Kerala',
    educationRequired: ['12th Pass'],
    degreesAllowed: ['12th Pass (Any stream for Army Wing; Physics & Maths for Air Force & Navy Wings)'],
    branchesAllowed: ['Any'],
    minAge: 16.5 as any,
    maxAge: 19.5 as any,
    ageRelaxation: { obc: 0, scSt: 0, pwd: 0 },
    experienceRequiredYears: 0,
    experienceDescription: 'Unmarried male and female candidates studying in or passed 12th class.',
    applicationStartDate: '2026-05-15',
    applicationDeadline: '2026-06-04',
    examDate: '2026-09-06',
    admitCardDate: '2026-08-20',
    resultDate: '2026-11-15',
    selectionProcess: [
      'UPSC Written Examination (Mathematics: 300 Marks + General Ability Test: 600 Marks)',
      'SSB Interview (5-Day Officer Intelligence & Personality Assessment: 900 Marks)',
      'Specialised Medical Board Examination'
    ],
    syllabus: [
      {
        section: 'Mathematics (11th & 12th Level)',
        marks: 300,
        topics: ['Algebra, Matrices, Trigonometry, Analytical Geometry, Differential Calculus, Integral Calculus, Vector Algebra, Statistics & Probability']
      },
      {
        section: 'General Ability Test (GAT)',
        marks: 600,
        topics: ['Part A: English (200 Marks)', 'Part B: Physics, Chemistry, General Science, History, Geography, Current Events (400 Marks)']
      }
    ],
    description: 'Premier defense academy for military leadership training leading to permanent commission as commissioned officers in Indian Army, Navy, and Air Force.',
    officialSourceUrl: 'https://upsc.gov.in',
    officialNotificationPdf: 'https://upsc.gov.in',
    officialApplicationUrl: 'https://upsconline.nic.in',
    isVerified: true,
    lastVerifiedDate: '2026-08-15',
    tags: ['12th Pass', 'NDA', 'UPSC', 'Defence Officer', 'Army Navy Airforce'],
    isSampleData: true,
  },
  {
    id: 'job-state-police-constable-2026',
    title: 'Police Constable & Armed Reserve Constable',
    organization: 'State Police Recruitment Board',
    department: 'Home Department, State Government',
    sector: 'Police',
    jobType: 'State',
    state: 'Telangana',
    vacancies: 12500,
    salary: {
      min: 24280,
      max: 72850,
      payLevel: 'State Pay Scale (Gross ₹35,000 - ₹42,000/mo)',
    },
    location: 'Across All District Headquarters & Police Commissionerates',
    educationRequired: ['12th Pass'],
    degreesAllowed: ['Intermediate (10+2) or equivalent from recognized board'],
    branchesAllowed: ['Any'],
    minAge: 18,
    maxAge: 25,
    ageRelaxation: { obc: 5, scSt: 5, pwd: 0 },
    experienceRequiredYears: 0,
    experienceDescription: 'Must possess Intermediate certification. Physical measurement standards (Height: 167.6 cm for men, 152.5 cm for women).',
    applicationStartDate: '2026-08-01',
    applicationDeadline: '2026-08-31',
    examDate: '2026-11-08',
    admitCardDate: '2026-10-25',
    resultDate: '2026-12-30',
    selectionProcess: [
      'Preliminary Written Test (PWT - 200 Questions)',
      'Physical Measurement Test (PMT) & Physical Efficiency Test (PET - 1600m Run & Long Jump)',
      'Final Written Examination (FWE - 200 Marks)',
      'Document Verification'
    ],
    syllabus: [
      {
        section: 'General Studies & State History',
        marks: 100,
        topics: ['General Science', 'History of India & National Movement', 'State History & Culture', 'Geography & Polity']
      },
      {
        section: 'Arithmetic & Reasoning Ability',
        marks: 100,
        topics: ['Simple Arithmetic', 'Reasoning, Mental Ability, Basic English of 10th Standard']
      }
    ],
    description: 'State police force recruitment for maintaining law and order, crime prevention, traffic regulation, and public security across state districts.',
    officialSourceUrl: 'https://tspolice.gov.in',
    officialNotificationPdf: 'https://www.tslprb.in',
    officialApplicationUrl: 'https://www.tslprb.in',
    isVerified: true,
    lastVerifiedDate: '2026-08-15',
    tags: ['12th Pass', 'Police Constable', 'State Govt', 'Physical Test', 'High Vacancy'],
    isSampleData: true,
  },
  {
    id: 'job-cisf-bsf-hc-2026',
    title: 'Head Constable (Ministerial) & Assistant Sub-Inspector (Steno)',
    organization: 'Central Armed Police Forces (CISF / BSF / CRPF / ITBP / SSB)',
    department: 'Ministry of Home Affairs, Govt of India',
    sector: 'Police',
    jobType: 'Central',
    vacancies: 1526,
    salary: {
      min: 25500,
      max: 81100,
      payLevel: 'Pay Level 4 (HC Ministerial: ₹25,500) / Pay Level 5 (ASI Steno: ₹29,200)',
    },
    location: 'Airports, Metro Stations, Border Outposts & Pan India CAPF Units',
    educationRequired: ['12th Pass'],
    degreesAllowed: ['Intermediate / 10+2 from recognized board'],
    branchesAllowed: ['Any'],
    minAge: 18,
    maxAge: 25,
    ageRelaxation: { obc: 3, scSt: 5, pwd: 0 },
    experienceRequiredYears: 0,
    experienceDescription: '12th pass with typing speed of 35 wpm in English or 30 wpm in Hindi for HC(Min); Shorthand 80 wpm for ASI Steno.',
    applicationStartDate: '2026-07-10',
    applicationDeadline: '2026-08-20',
    examDate: '2026-10-25',
    admitCardDate: '2026-10-12',
    resultDate: '2026-12-15',
    selectionProcess: [
      'Physical Standard Test (PST) & Documentation',
      'Computer Based Written Examination (CBT)',
      'Skill Test (Typing / Stenography)',
      'Detailed Medical Examination (DME)'
    ],
    syllabus: [
      {
        section: 'General Intelligence & Reasoning',
        marks: 25,
        topics: ['Analogies, Coding-Decoding, Non-verbal series']
      },
      {
        section: 'General Knowledge & Arithmetic',
        marks: 50,
        topics: ['Basic Math, Current Affairs, Everyday Science']
      },
      {
        section: 'General English / Hindi & Clerical Aptitude',
        marks: 25,
        topics: ['Clerical checking, Alphabetical filing, Basic grammar']
      }
    ],
    description: 'Ministerial administrative and secretarial roles in Central Armed Police Forces safeguarding national infrastructure and international borders.',
    officialSourceUrl: 'https://cisfrectt.cisf.gov.in',
    officialNotificationPdf: 'https://cisfrectt.cisf.gov.in',
    officialApplicationUrl: 'https://cisfrectt.cisf.gov.in',
    isVerified: true,
    lastVerifiedDate: '2026-08-14',
    tags: ['12th Pass', 'CAPF', 'CISF', 'BSF', 'Head Constable', 'Typing Job'],
    isSampleData: true,
  },

  // -------------------------------------------------------------
  // 3. DIPLOMA / POLYTECHNIC JOBS
  // -------------------------------------------------------------
  {
    id: 'job-ssc-je-2026',
    title: 'Junior Engineer (JE) - Civil, Electrical, Mechanical',
    organization: 'Staff Selection Commission (SSC)',
    department: 'CPWD, Military Engineer Services (MES), Central Water Commission (CWC)',
    sector: 'SSC',
    jobType: 'Central',
    vacancies: 1765,
    salary: {
      min: 35400,
      max: 112400,
      payLevel: 'Pay Level 6 (Gross ₹54,000 - ₹62,000/mo)',
    },
    location: 'All India Central Infrastructure Projects',
    educationRequired: ['Diploma', 'B.Tech / B.E.'],
    degreesAllowed: ['3-Year Diploma in Civil / Electrical / Mechanical Engineering', 'B.Tech / B.E.'],
    branchesAllowed: ['Civil Engineering', 'Electrical Engineering', 'Mechanical Engineering'],
    minAge: 18,
    maxAge: 30,
    ageRelaxation: { obc: 3, scSt: 5, pwd: 10 },
    experienceRequiredYears: 0,
    experienceDescription: 'Diploma in Engineering from recognized board or B.Tech degree. (CPWD/CWC: fresh diploma eligible; MES requires 2 yrs exp for diploma or fresh B.Tech).',
    applicationStartDate: '2026-07-25',
    applicationDeadline: '2026-08-28',
    examDate: '2026-11-05',
    admitCardDate: '2026-10-22',
    resultDate: '2026-12-30',
    selectionProcess: [
      'Paper-I Computer Based Examination (General Intelligence + General Awareness + Technical Subject - 200 Marks)',
      'Paper-II Computer Based Examination (Core Engineering Subject - 300 Marks)',
      'Document Verification'
    ],
    syllabus: [
      {
        section: 'General Intelligence & General Awareness',
        marks: 100,
        topics: ['Logical Reasoning', 'Current Affairs', 'General Science', 'Indian History & Geography']
      },
      {
        section: 'Core Engineering (Civil / Electrical / Mechanical)',
        marks: 400,
        topics: ['Building Materials, Surveying, RCC Design, Hydraulics, Circuit Law, Electrical Machines, Thermodynamics, Theory of Machines']
      }
    ],
    description: 'Junior Engineers supervise construction of national highways, public buildings, barrages, military cantonments, and electrical grid substations.',
    officialSourceUrl: 'https://ssc.gov.in',
    officialNotificationPdf: 'https://ssc.gov.in',
    officialApplicationUrl: 'https://ssc.gov.in',
    isVerified: true,
    lastVerifiedDate: '2026-08-15',
    tags: ['Diploma', 'B.Tech', 'Junior Engineer', 'SSC JE', 'Civil', 'Electrical', 'Mechanical'],
    isSampleData: true,
  },
  {
    id: 'job-rrb-je-2026',
    title: 'RRB Junior Engineer (JE), DMS & CMA in Indian Railways',
    organization: 'Railway Recruitment Boards (RRB)',
    department: 'Ministry of Railways, Govt of India',
    sector: 'Railways',
    jobType: 'Central',
    vacancies: 7951,
    salary: {
      min: 35400,
      max: 112400,
      payLevel: 'Pay Level 6 + Railway Allowances (Gross ₹58,000 - ₹66,000/mo)',
    },
    location: 'Across 21 Railway Recruitment Boards Nationwide',
    educationRequired: ['Diploma', 'B.Tech / B.E.'],
    degreesAllowed: ['3-Year Diploma in Engineering', 'B.Tech', 'B.Sc in Chemistry/Physics for CMA'],
    branchesAllowed: ['Civil', 'Mechanical', 'Electrical', 'Electronics', 'Computer Science', 'IT'],
    minAge: 18,
    maxAge: 33,
    ageRelaxation: { obc: 3, scSt: 5, pwd: 10 },
    experienceRequiredYears: 0,
    experienceDescription: 'Fresh Diploma and Engineering graduates from recognized institutions.',
    applicationStartDate: '2026-07-30',
    applicationDeadline: '2026-08-29',
    examDate: '2026-11-20',
    admitCardDate: '2026-11-08',
    resultDate: '2027-01-15',
    selectionProcess: [
      '1st Stage CBT (Screening: Math, Reasoning, General Science, GA - 100 Marks)',
      '2nd Stage CBT (Technical Abilities + Physics/Chem + Computer/Environment - 150 Marks)',
      'Document Verification & Medical Examination (A-3 / B-1 / B-2 standard)'
    ],
    syllabus: [
      {
        section: 'CBT-1 Non-Technical Foundations',
        marks: 100,
        topics: ['Mathematics (30)', 'General Intelligence & Reasoning (25)', 'General Awareness (15)', 'General Science (30)']
      },
      {
        section: 'CBT-2 Domain Engineering',
        marks: 150,
        topics: ['Technical Engineering Abilities (100 Marks)', 'Basics of Computers & Applications (10)', 'Basics of Environment & Pollution Control (10)', 'General Awareness (15)', 'Physics & Chemistry (15)']
      }
    ],
    description: 'Technical leadership recruitment in Indian Railways handling locomotive sheds, rolling stock, signaling, track renewals, and bridge engineering.',
    officialSourceUrl: 'https://www.rrbcdg.gov.in',
    officialNotificationPdf: 'https://www.rrbapply.gov.in',
    officialApplicationUrl: 'https://www.rrbapply.gov.in',
    isVerified: true,
    lastVerifiedDate: '2026-08-15',
    tags: ['Diploma', 'B.Tech', 'Railways', 'RRB JE', 'Engineering', 'High Vacancies'],
    isSampleData: true,
  },

  // -------------------------------------------------------------
  // 4. GRADUATION / BACHELOR'S (ANY DEGREE: B.A., B.Sc, B.Com, etc.)
  // -------------------------------------------------------------
  {
    id: 'job-ssc-cgl-2026',
    title: 'Assistant Section Officer (ASO), Income Tax & GST Inspector',
    organization: 'Staff Selection Commission (SSC)',
    department: 'Central Secretariat Service, Ministry of Finance, ED & CBI',
    sector: 'SSC',
    jobType: 'Central',
    vacancies: 14250,
    salary: {
      min: 44900,
      max: 142400,
      payLevel: 'Pay Level 7 (Gross ₹75,000 - ₹85,000/mo in X cities)',
    },
    location: 'New Delhi & Pan India Regional Offices',
    educationRequired: ['Graduation / Bachelor\'s', 'B.Tech / B.E.', 'Post Graduation / Master\'s', 'LLB / Law'],
    degreesAllowed: ['Any Bachelor\'s Degree', 'B.A.', 'B.Com', 'B.Sc', 'B.Tech', 'BBA', 'BCA'],
    branchesAllowed: ['Any'],
    minAge: 20,
    maxAge: 30,
    ageRelaxation: { obc: 3, scSt: 5, pwd: 10 },
    experienceRequiredYears: 0,
    experienceDescription: 'Graduation in any discipline from recognized university. Freshers eligible.',
    applicationStartDate: '2026-07-15',
    applicationDeadline: '2026-08-30',
    examDate: '2026-10-18',
    admitCardDate: '2026-10-05',
    resultDate: '2026-12-15',
    selectionProcess: [
      'Tier-I Computer Based Examination (Qualifying)',
      'Tier-II Computer Based Examination (Merit Scoring)',
      'Computer Knowledge Test & Data Entry Speed Test (DEST)',
      'Document Verification'
    ],
    syllabus: [
      {
        section: 'Tier-1 & Tier-2 Reasoning & Intelligence',
        marks: 50,
        topics: ['Analogies', 'Coding-Decoding', 'Blood Relations', 'Syllogism', 'Non-Verbal Reasoning']
      },
      {
        section: 'Quantitative Aptitude / Maths',
        marks: 50,
        topics: ['Arithmetic (Percentage, Profit & Loss, Time & Work)', 'Advanced Maths (Algebra, Geometry, Trigonometry, Mensuration)']
      },
      {
        section: 'English Language & Comprehension',
        marks: 50,
        topics: ['Grammar & Error Spotting', 'Reading Comprehension', 'Cloze Test', 'Vocabulary']
      },
      {
        section: 'General Awareness & Current Affairs',
        marks: 50,
        topics: ['Indian Polity & Constitution', 'History & Geography', 'Indian Economy', 'General Science', 'Current Events']
      }
    ],
    description: 'Staff Selection Commission Combined Graduate Level (SSC CGL 2026) for prestigious executive Group \'B\' posts in Central Ministries and investigating agencies.',
    officialSourceUrl: 'https://ssc.gov.in',
    officialNotificationPdf: 'https://ssc.gov.in',
    officialApplicationUrl: 'https://ssc.gov.in',
    isVerified: true,
    lastVerifiedDate: '2026-08-15',
    tags: ['SSC CGL', 'Central Govt', 'ASO', 'Income Tax Inspector', 'Any Graduate', 'High Vacancy'],
    isSampleData: true,
  },
  {
    id: 'job-upsc-cse-2026',
    title: 'Civil Services Examination (IAS / IPS / IFS / IRS)',
    organization: 'Union Public Service Commission (UPSC)',
    department: 'DoPT, Ministry of Personnel, Public Grievances and Pensions',
    sector: 'UPSC',
    jobType: 'Central',
    vacancies: 1105,
    salary: {
      min: 56100,
      max: 225000,
      payLevel: 'Junior Time Scale Pay Level 10 (Cabinet Secretary Level 18: ₹2,50,000)',
    },
    location: 'All India & Foreign Missions',
    educationRequired: ['Graduation / Bachelor\'s', 'B.Tech / B.E.', 'Post Graduation / Master\'s', 'MBBS / Medical', 'LLB / Law'],
    degreesAllowed: ['Any Recognized Degree', 'B.A.', 'B.Sc', 'B.Com', 'B.Tech', 'MBBS', 'LLB'],
    branchesAllowed: ['Any'],
    minAge: 21,
    maxAge: 32,
    ageRelaxation: { obc: 3, scSt: 5, pwd: 10 },
    experienceRequiredYears: 0,
    experienceDescription: 'Fresh graduates and final year students eligible. Limit: 6 attempts for General, 9 for OBC, unlimited for SC/ST.',
    applicationStartDate: '2026-02-14',
    applicationDeadline: '2026-03-05',
    examDate: '2026-09-20',
    admitCardDate: '2026-09-01',
    resultDate: '2027-04-15',
    selectionProcess: [
      'Civil Services Preliminary Examination (Objective: GS-1 + CSAT GS-2)',
      'Civil Services Main Examination (Written: 9 Descriptive Papers)',
      'Personality Test / Interview at Dholpur House, New Delhi'
    ],
    syllabus: [
      {
        section: 'Prelims GS-1 & CSAT',
        marks: 400,
        topics: ['Indian Polity & Governance', 'Economy & Sustainable Development', 'Modern Indian History & Culture', 'Physical & Human Geography', 'Environment, Biodiversity & Climate', 'Reading Comprehension', 'Analytical Reasoning']
      },
      {
        section: 'Mains GS Papers (I to IV) + Essay',
        marks: 1250,
        topics: ['GS 1: History, Society, Geography', 'GS 2: Governance, Constitution, IR', 'GS 3: Technology, Economic Dev, Security', 'GS 4: Ethics, Integrity & Aptitude', 'Essay Paper']
      },
      {
        section: 'Optional Subject (2 Papers)',
        marks: 500,
        topics: ['Candidate chosen optional subject (Public Admin, PSIR, Geography, Sociology, History, etc.)']
      }
    ],
    description: 'Premier national civil service examination to select administrative leaders for Indian Administrative Service (IAS), Indian Police Service (IPS), Indian Foreign Service (IFS), Indian Revenue Service (IRS), and 20+ Allied Services.',
    officialSourceUrl: 'https://upsc.gov.in',
    officialNotificationPdf: 'https://upsc.gov.in',
    officialApplicationUrl: 'https://upsconline.nic.in',
    isVerified: true,
    lastVerifiedDate: '2026-08-15',
    tags: ['UPSC', 'IAS', 'IPS', 'Prestigious', 'All India Cadre', 'Civil Services'],
    isSampleData: true,
  },
  {
    id: 'job-ibps-po-2026',
    title: 'Probationary Officer (PO) / Management Trainee in Public Sector Banks',
    organization: 'Institute of Banking Personnel Selection (IBPS)',
    department: '11 Public Sector Participating Banks (PNB, BOB, Canara, Union Bank, etc.)',
    sector: 'Banking',
    jobType: 'Central',
    vacancies: 4450,
    salary: {
      min: 48480,
      max: 85920,
      payLevel: 'Junior Management Grade Scale I (Gross ~₹68,000/mo + Perks & Leased Accommodation)',
    },
    location: 'Pan India Branches & Zonal Offices',
    educationRequired: ['Graduation / Bachelor\'s', 'B.Tech / B.E.', 'Post Graduation / Master\'s'],
    degreesAllowed: ['Any Bachelor\'s Degree in any discipline from recognized University'],
    branchesAllowed: ['Any'],
    minAge: 20,
    maxAge: 30,
    ageRelaxation: { obc: 3, scSt: 5, pwd: 10 },
    experienceRequiredYears: 0,
    experienceDescription: 'Freshers are fully eligible. Final year students with results declared by deadline.',
    applicationStartDate: '2026-08-01',
    applicationDeadline: '2026-08-28',
    examDate: '2026-10-24',
    admitCardDate: '2026-10-12',
    resultDate: '2026-12-05',
    selectionProcess: [
      'Preliminary Examination (100 Marks: English, Quant, Reasoning)',
      'Main Examination (225 Marks: Objective + Descriptive English Writing)',
      'Common Interview conducted by participating banks',
      'Provisional Allotment'
    ],
    syllabus: [
      {
        section: 'Quantitative Aptitude & Data Interpretation',
        marks: 60,
        topics: ['Data Interpretation (Radar, Bar, Pie, Missing DI)', 'Quadratic Equations', 'Arithmetic Word Problems', 'Number Series']
      },
      {
        section: 'Reasoning & Computer Aptitude',
        marks: 60,
        topics: ['Floor & Box Puzzles', 'Machine Input-Output', 'Coded Direction & Inequalities', 'Data Sufficiency', 'Computer Basics']
      },
      {
        section: 'General Economy & Banking Awareness',
        marks: 40,
        topics: ['RBI Monetary Policy', 'Banking Terminologies & Basel III', 'Priority Sector Lending', 'Budget & Economic Survey', 'Current Financial News']
      },
      {
        section: 'English Language (Objective + Essay/Letter)',
        marks: 65,
        topics: ['Reading Comprehension', 'Sentence Rearrangement', 'Error Detection', 'Formal Letter & Essay Writing']
      }
    ],
    description: 'Common Recruitment Process (CRP PO/MT-XVI) for recruitment of Probationary Officers/ Management Trainees in 11 Public Sector Banks across India.',
    officialSourceUrl: 'https://www.ibps.in',
    officialNotificationPdf: 'https://www.ibps.in',
    officialApplicationUrl: 'https://www.ibps.in',
    isVerified: true,
    lastVerifiedDate: '2026-08-15',
    tags: ['IBPS', 'Banking', 'Bank PO', 'Public Sector', 'Finance', 'Fresher Friendly'],
    isSampleData: true,
  },
  {
    id: 'job-ib-acio-2026',
    title: 'Assistant Central Intelligence Officer (ACIO Grade-II / Executive)',
    organization: 'Intelligence Bureau (IB)',
    department: 'Ministry of Home Affairs, Govt of India',
    sector: 'Police',
    jobType: 'Central',
    vacancies: 995,
    salary: {
      min: 44900,
      max: 142400,
      payLevel: 'Pay Level 7 + 20% Special Security Allowance (Gross ~₹82,000/mo)',
    },
    location: 'All India Intelligence Bureaus & Strategic Posts',
    educationRequired: ['Graduation / Bachelor\'s', 'B.Tech / B.E.'],
    degreesAllowed: ['Graduation or equivalent from a recognized university in any discipline'],
    branchesAllowed: ['Any'],
    minAge: 18,
    maxAge: 27,
    ageRelaxation: { obc: 3, scSt: 5, pwd: 10 },
    experienceRequiredYears: 0,
    experienceDescription: 'Fresh graduates eligible. Knowledge of computer operations is desirable.',
    applicationStartDate: '2026-07-20',
    applicationDeadline: '2026-08-25',
    examDate: '2026-10-30',
    admitCardDate: '2026-10-18',
    resultDate: '2026-12-20',
    selectionProcess: [
      'Tier-I Exam (100 Objective Questions: Current Affairs, General Studies, Math, Reasoning, English)',
      'Tier-II Descriptive Exam (50 Marks: Essay, English Comprehension & Precis Writing)',
      'Tier-III Interview (100 Marks) & Background Verification'
    ],
    syllabus: [
      {
        section: 'Current Affairs & General Studies',
        marks: 40,
        topics: ['National & International Security', 'Indian Polity', 'Modern History & World Geography', 'Economy']
      },
      {
        section: 'Quantitative Aptitude, Reasoning & English',
        marks: 60,
        topics: ['Arithmetic, Number Series, Analytical Puzzles, Vocabulary, Grammar']
      }
    ],
    description: 'Intelligence Bureau executive officers conduct tactical intelligence collection, counter-espionage, internal security investigations, and border surveillance.',
    officialSourceUrl: 'https://www.mha.gov.in',
    officialNotificationPdf: 'https://www.mha.gov.in',
    officialApplicationUrl: 'https://www.mha.gov.in',
    isVerified: true,
    lastVerifiedDate: '2026-08-15',
    tags: ['IB ACIO', 'Intelligence', 'MHA', 'Any Graduate', 'High Salary'],
    isSampleData: true,
  },

  // -------------------------------------------------------------
  // 5. ENGINEERING (B.TECH / B.E.)
  // -------------------------------------------------------------
  {
    id: 'job-isro-scientist-2026',
    title: 'Scientist / Engineer \'SC\' (Computer Science, Electronics, Mechanical)',
    organization: 'Indian Space Research Organisation (ISRO)',
    department: 'Department of Space, Govt of India',
    sector: 'Technical',
    jobType: 'Central',
    vacancies: 68,
    salary: {
      min: 56100,
      max: 177500,
      payLevel: 'Pay Level 10 (Starting Basic: ₹56,100 + DA + HRA)',
    },
    location: 'Bengaluru / Hyderabad / Trivandrum / Sriharikota',
    educationRequired: ['B.Tech / B.E.', 'Post Graduation / Master\'s'],
    degreesAllowed: ['B.Tech', 'B.E.', 'B.Sc Engineering', 'M.Tech', 'M.E.'],
    branchesAllowed: ['Computer Science', 'Information Technology', 'Electronics & Communication', 'Mechanical Engineering'],
    minAge: 18,
    maxAge: 28,
    ageRelaxation: { obc: 3, scSt: 5, pwd: 10 },
    experienceRequiredYears: 0,
    experienceDescription: 'Freshers eligible with minimum 65% marks or 6.84 CGPA in B.Tech/B.E.',
    applicationStartDate: '2026-08-01',
    applicationDeadline: '2026-09-15',
    examDate: '2026-11-22',
    admitCardDate: '2026-11-10',
    resultDate: '2026-12-30',
    selectionProcess: [
      'Written Examination (80 MCQs from Core Engineering + 20 Aptitude)',
      'Technical Interview (1:5 shortlist ratio)',
      'Document Verification & Medical Fitness Test'
    ],
    syllabus: [
      {
        section: 'Core Engineering Discipline',
        marks: 80,
        topics: ['Data Structures & Algorithms', 'Operating Systems', 'Computer Networks', 'Database Management', 'Theory of Computation', 'Compiler Design', 'Computer Architecture', 'Software Engineering']
      },
      {
        section: 'General Aptitude & Reasoning',
        marks: 20,
        topics: ['Quantitative Aptitude', 'Logical Reasoning', 'Numerical Analysis', 'Basic Engineering Mathematics']
      }
    ],
    description: 'ISRO Centralised Recruitment Board (ICRB) invites applications for Scientist/Engineer \'SC\'. Selected engineers lead satellite payload systems, space exploration launch vehicles, and lunar/interplanetary rovers.',
    officialSourceUrl: 'https://www.isro.gov.in/Careers.html',
    officialNotificationPdf: 'https://www.isro.gov.in/Careers.html',
    officialApplicationUrl: 'https://www.isro.gov.in/Careers.html',
    isVerified: true,
    lastVerifiedDate: '2026-08-15',
    tags: ['ISRO', 'Scientist', 'B.Tech CSE', 'Central Govt', 'Space Research', 'High Salary'],
    isSampleData: true,
  },
  {
    id: 'job-nic-scientist-b-2026',
    title: 'Scientist \'B\' & Scientific / Technical Assistant \'A\'',
    organization: 'National Informatics Centre (NIC) / NIELIT',
    department: 'Ministry of Electronics and Information Technology (MeitY)',
    sector: 'Technical',
    jobType: 'Central',
    vacancies: 598,
    salary: {
      min: 56100,
      max: 177500,
      payLevel: 'Pay Level 10 (Scientist B: ₹56,100) / Pay Level 6 (STA A: ₹35,400)',
    },
    location: 'MeitY New Delhi, NIC State Informatics Centres (All State Capitals)',
    educationRequired: ['B.Tech / B.E.', 'Post Graduation / Master\'s'],
    degreesAllowed: ['B.Tech / B.E.', 'MCA', 'M.Sc Computer Science / IT', 'M.Tech / M.E.'],
    branchesAllowed: ['Computer Science', 'Information Technology', 'Software Engineering', 'Electronics & Comm'],
    minAge: 21,
    maxAge: 30,
    ageRelaxation: { obc: 3, scSt: 5, pwd: 10 },
    experienceRequiredYears: 0,
    experienceDescription: 'Freshers are fully eligible. Degree must be from AICTE/UGC approved institutions.',
    applicationStartDate: '2026-08-05',
    applicationDeadline: '2026-09-18',
    examDate: '2026-11-08',
    admitCardDate: '2026-10-25',
    resultDate: '2026-12-20',
    selectionProcess: [
      'Written Examination (120 Objective Questions: 65% Technical + 35% Generic)',
      'Personal Interview (Scientist B only) / Direct Merit for STA-A',
      'Document Verification'
    ],
    syllabus: [
      {
        section: 'Generic Area (35%)',
        marks: 42,
        topics: ['Logical Reasoning', 'Analytical Ability Capabilities', 'Quantitative and Qualitative Aptitude', 'General English']
      },
      {
        section: 'Technical Computer Science (65%)',
        marks: 78,
        topics: ['Digital Logic', 'Computer Organisation & Architecture', 'Data Structures & Algorithms', 'Database Systems & SQL', 'Computer Networks & Network Security', 'Cloud Infrastructure & Web Technologies']
      }
    ],
    description: 'National Informatics Centre provides digital infrastructure and e-governance solutions across India (e-Courts, DigiLocker, Aadhaar backend integrations, GST portal systems, UPI APIs).',
    officialSourceUrl: 'https://www.nic.in',
    officialNotificationPdf: 'https://recruitment.nic.in',
    officialApplicationUrl: 'https://recruitment.nic.in',
    isVerified: true,
    lastVerifiedDate: '2026-08-15',
    tags: ['NIC', 'MeitY', 'Scientist B', 'B.Tech CSE', 'Central Govt', 'e-Governance'],
    isSampleData: true,
  },

  // -------------------------------------------------------------
  // 6. POST GRADUATION / MASTER'S DEGREE
  // -------------------------------------------------------------
  {
    id: 'job-ugc-net-2026',
    title: 'Assistant Professor & Junior Research Fellowship (JRF)',
    organization: 'National Testing Agency (NTA) / UGC',
    department: 'University Grants Commission & Ministry of Education',
    sector: 'Teaching',
    jobType: 'Central',
    vacancies: 3200,
    salary: {
      min: 57700,
      max: 182400,
      payLevel: 'Academic Pay Level 10 (₹57,700 for Asst Prof) / JRF Fellowship ₹37,000/mo + HRA',
    },
    location: 'Central & State Universities, IITs, NITs, and Degree Colleges',
    educationRequired: ['Post Graduation / Master\'s', 'PhD / Doctorate'],
    degreesAllowed: ['Master\'s Degree (M.A., M.Sc, M.Com, M.Tech, MCA, LLM) with at least 55% marks'],
    branchesAllowed: ['Any'],
    minAge: 21,
    maxAge: 30,
    ageRelaxation: { obc: 3, scSt: 5, pwd: 10 },
    experienceRequiredYears: 0,
    experienceDescription: 'Final year Master\'s students eligible. Qualifying UGC NET makes candidates eligible for Assistant Professorship for lifetime.',
    applicationStartDate: '2026-07-10',
    applicationDeadline: '2026-08-20',
    examDate: '2026-09-25',
    admitCardDate: '2026-09-15',
    resultDate: '2026-11-10',
    selectionProcess: [
      'Paper 1 (Teaching & Research Aptitude - 100 Marks, 50 Questions)',
      'Paper 2 (Chosen Domain Subject - 200 Marks, 100 Questions)',
      'Score Card & e-Certificate Award'
    ],
    syllabus: [
      {
        section: 'Paper 1: Teaching & Research Aptitude',
        marks: 100,
        topics: ['Teaching Aptitude & Methods', 'Research Methodology & Ethics', 'Comprehension', 'Information & Comm Technology (ICT)', 'People, Development & Environment', 'Higher Education System']
      },
      {
        section: 'Paper 2: Subject Specific',
        marks: 200,
        topics: ['In-depth master level theoretical and applied concepts of selected subject discipline (83 subjects available)']
      }
    ],
    description: 'National Eligibility Test (UGC NET) determines eligibility of Indian nationals for Assistant Professorship and Junior Research Fellowship in Indian universities and colleges.',
    officialSourceUrl: 'https://ugcnet.nta.ac.in',
    officialNotificationPdf: 'https://ugcnet.nta.ac.in',
    officialApplicationUrl: 'https://ugcnet.nta.ac.in',
    isVerified: true,
    lastVerifiedDate: '2026-08-15',
    tags: ['UGC NET', 'NTA', 'Teaching', 'Assistant Professor', 'JRF', 'Master Degree'],
    isSampleData: true,
  },
  {
    id: 'job-rbi-grade-b-2026',
    title: 'Officers in Grade \'B\' (General / DEPR / DSIM)',
    organization: 'Reserve Bank of India (RBI)',
    department: 'Monetary Policy, Financial Markets & Banking Supervision',
    sector: 'Banking',
    jobType: 'Central',
    vacancies: 94,
    salary: {
      min: 55200,
      max: 165000,
      payLevel: 'Grade B (Total Gross CTC approx ₹30 Lakhs/annum including accommodation)',
    },
    location: 'RBI Central Office Mumbai & Regional Centers (Delhi, Kolkata, Chennai, Hyderabad)',
    educationRequired: ['Graduation / Bachelor\'s', 'Post Graduation / Master\'s'],
    degreesAllowed: ['Graduation (60% marks) or Post-Graduation / Master\'s Degree (55% marks) in any discipline'],
    branchesAllowed: ['Any'],
    minAge: 21,
    maxAge: 30,
    ageRelaxation: { obc: 3, scSt: 5, pwd: 10 },
    experienceRequiredYears: 0,
    experienceDescription: 'Fresh Master\'s and Bachelor\'s degree holders with required minimum percentage.',
    applicationStartDate: '2026-07-25',
    applicationDeadline: '2026-08-26',
    examDate: '2026-10-19',
    admitCardDate: '2026-10-06',
    resultDate: '2026-12-10',
    selectionProcess: [
      'Phase-I Online Examination (200 Marks: GA, Quantitative, Reasoning, English)',
      'Phase-II Online Examination (300 Marks: Economic & Social Issues, English Writing, Finance & Management)',
      'Phase-III Interview (75 Marks) at RBI Mumbai'
    ],
    syllabus: [
      {
        section: 'Phase 2: Economic and Social Issues (ESI)',
        marks: 100,
        topics: ['Growth and Development', 'Indian Economy', 'Globalization', 'Social Structure in India']
      },
      {
        section: 'Phase 2: Finance and Management',
        marks: 100,
        topics: ['Financial System, Financial Markets, Risk Management, Corporate Governance, Leadership & Motivation']
      }
    ],
    description: 'Central bank executive recruitment driving India\'s macroeconomic monetary policy, interest rates, currency regulation, foreign exchange reserves, and banking supervision.',
    officialSourceUrl: 'https://opportunities.rbi.org.in',
    officialNotificationPdf: 'https://opportunities.rbi.org.in',
    officialApplicationUrl: 'https://opportunities.rbi.org.in',
    isVerified: true,
    lastVerifiedDate: '2026-08-15',
    tags: ['RBI Grade B', 'Reserve Bank', 'High Salary', 'Banking', 'Prestigious', 'Master Degree'],
    isSampleData: true,
  },

  // -------------------------------------------------------------
  // 7. MEDICAL & HEALTHCARE (MBBS / NURSING / PHARMA)
  // -------------------------------------------------------------
  {
    id: 'job-upsc-cms-2026',
    title: 'Combined Medical Services Examination (CMS - Medical Officer)',
    organization: 'Union Public Service Commission (UPSC)',
    department: 'Ministry of Health & Family Welfare, Railways & CGHS',
    sector: 'UPSC',
    jobType: 'Central',
    vacancies: 827,
    salary: {
      min: 56100,
      max: 177500,
      payLevel: 'Pay Level 10 + Non-Practicing Allowance (NPA) 20% (Gross ₹95,000 - ₹1,10,000/mo)',
    },
    location: 'Central Govt Health Scheme (CGHS) Dispensaries, Railway Hospitals & NDMC Clinics',
    educationRequired: ['MBBS / Medical'],
    degreesAllowed: ['MBBS Degree from recognized Medical Council of India / NMC institution'],
    branchesAllowed: ['Medicine / Surgery / MBBS'],
    minAge: 21,
    maxAge: 32,
    ageRelaxation: { obc: 3, scSt: 5, pwd: 10 },
    experienceRequiredYears: 0,
    experienceDescription: 'Candidates passed written and practical parts of final MBBS exam or completing compulsory rotatory internship.',
    applicationStartDate: '2026-04-10',
    applicationDeadline: '2026-04-30',
    examDate: '2026-07-14',
    admitCardDate: '2026-06-25',
    resultDate: '2026-10-15',
    selectionProcess: [
      'Computer Based Examination (Paper 1: General Medicine & Paediatrics; Paper 2: Surgery, Gynaecology & PSM - 500 Marks)',
      'Personality Test / Clinical Interview (100 Marks)',
      'Document Verification'
    ],
    syllabus: [
      {
        section: 'Paper 1: General Medicine & Paediatrics',
        marks: 250,
        topics: ['Cardiology, Respiratory, Gastrointestinal, Endocrinology, Infectious Diseases, Paediatric Emergencies']
      },
      {
        section: 'Paper 2: Surgery, Gynae & PSM',
        marks: 250,
        topics: ['General Surgery, Orthopaedics, Obstetrics & Gynaecology, Preventive and Social Medicine (PSM), National Health Programmes']
      }
    ],
    description: 'UPSC CMS selects Medical Officers for Central Government Health Scheme, Indian Railway Medical Service, and municipal hospitals.',
    officialSourceUrl: 'https://upsc.gov.in',
    officialNotificationPdf: 'https://upsc.gov.in',
    officialApplicationUrl: 'https://upsconline.nic.in',
    isVerified: true,
    lastVerifiedDate: '2026-08-15',
    tags: ['Medical', 'MBBS', 'UPSC CMS', 'Doctor', 'Central Govt', 'Railway Hospital'],
    isSampleData: true,
  },
  {
    id: 'job-aiims-norcet-2026',
    title: 'Nursing Officer Recruitment Common Eligibility Test (NORCET-7)',
    organization: 'All India Institute of Medical Sciences (AIIMS, New Delhi)',
    department: 'AIIMS New Delhi & 20+ All India AIIMS Institutions (Rishikesh, Patna, Bhopal, etc.)',
    sector: 'Central',
    jobType: 'Central',
    vacancies: 3500,
    salary: {
      min: 44900,
      max: 142400,
      payLevel: 'Pay Level 7 (Gross ₹72,000 - ₹82,000/mo + Nursing Allowances)',
    },
    location: 'All AIIMS Hospitals across India and Central Govt Hospitals (Safdarjung, RML, Lady Hardinge)',
    educationRequired: ['MBBS / Medical', 'Diploma', 'Graduation / Bachelor\'s'],
    degreesAllowed: ['B.Sc (Hons) Nursing / B.Sc Nursing', 'Post-Basic B.Sc Nursing', 'Diploma in General Nursing Midwifery (GNM) with 2 yrs hospital exp'],
    branchesAllowed: ['Nursing'],
    minAge: 18,
    maxAge: 30,
    ageRelaxation: { obc: 3, scSt: 5, pwd: 10 },
    experienceRequiredYears: 0,
    experienceDescription: 'Fresh B.Sc Nursing graduates registered with State/Indian Nursing Council eligible with 0 years experience.',
    applicationStartDate: '2026-08-01',
    applicationDeadline: '2026-08-25',
    examDate: '2026-09-15',
    admitCardDate: '2026-09-08',
    resultDate: '2026-10-20',
    selectionProcess: [
      'NORCET Preliminary Stage (100 MCQs - Nursing + General Aptitude)',
      'NORCET Mains Stage (100 Scenario-based Clinical MCQs)',
      'Document Verification & AIIMS Institute Allocation'
    ],
    syllabus: [
      {
        section: 'Nursing Sciences & Clinical Practice',
        marks: 80,
        topics: ['Medical Surgical Nursing', 'Community Health Nursing', 'Child Health / Paediatric Nursing', 'Pharmacology, Nutrition & First Aid']
      },
      {
        section: 'General Knowledge & Aptitude',
        marks: 20,
        topics: ['General Knowledge, Basic English & Quantitative Aptitude']
      }
    ],
    description: 'Premier national entrance exam for Nursing Officers providing critical inpatient, ICU, OT, and clinical healthcare across AIIMS apex hospitals.',
    officialSourceUrl: 'https://aiimsexams.ac.in',
    officialNotificationPdf: 'https://aiimsexams.ac.in',
    officialApplicationUrl: 'https://aiimsexams.ac.in',
    isVerified: true,
    lastVerifiedDate: '2026-08-15',
    tags: ['Nursing', 'AIIMS', 'NORCET', 'Healthcare', 'B.Sc Nursing', 'Medical'],
    isSampleData: true,
  },

  // -------------------------------------------------------------
  // 8. LAW / JUDICIAL (LLB / LLM)
  // -------------------------------------------------------------
  {
    id: 'job-state-judiciary-2026',
    title: 'Civil Judge (Junior Division) / Judicial Magistrate (First Class)',
    organization: 'High Court & State Public Service Commission',
    department: 'State Judicial Subordinate Services',
    sector: 'State',
    jobType: 'State',
    state: 'Maharashtra',
    vacancies: 180,
    salary: {
      min: 77840,
      max: 136520,
      payLevel: 'Junior Civil Judge Scale (Gross ₹1,10,000 - ₹1,30,000/mo + Residence & Vehicle)',
    },
    location: 'District and Sessions Courts across State',
    educationRequired: ['LLB / Law'],
    degreesAllowed: ['Degree in Law (LLB 3 Years / 5 Years Integrated B.A. LLB / B.Com LLB) from recognized University'],
    branchesAllowed: ['Law / Jurisprudence'],
    minAge: 21,
    maxAge: 35,
    ageRelaxation: { obc: 3, scSt: 5, pwd: 10 },
    experienceRequiredYears: 0,
    experienceDescription: 'Fresh Law graduates eligible as new advocates enrolled with State Bar Council.',
    applicationStartDate: '2026-07-15',
    applicationDeadline: '2026-08-20',
    examDate: '2026-10-12',
    admitCardDate: '2026-09-28',
    resultDate: '2026-12-15',
    selectionProcess: [
      'Preliminary Screening Examination (100 Objective Legal MCQs)',
      'Main Written Examination (Paper 1 Civil Law + Paper 2 Criminal Law - 200 Marks)',
      'Viva-Voce / Judicial Interview (50 Marks) at High Court'
    ],
    syllabus: [
      {
        section: 'Civil Law & Procedure',
        marks: 100,
        topics: ['Code of Civil Procedure (CPC)', 'Transfer of Property Act', 'Indian Contract Act', 'Specific Relief Act', 'Constitution of India']
      },
      {
        section: 'Criminal Law & Evidence',
        marks: 100,
        topics: ['Bharatiya Nyaya Sanhita (IPC)', 'Bharatiya Nagarik Suraksha Sanhita (CrPC)', 'Bharatiya Sakshya Adhiniyam (Evidence Act)', 'POCSO Act']
      }
    ],
    description: 'Selection for subordinate judiciary presiding over trial courts, civil litigations, criminal trials, bail applications, and judicial orders.',
    officialSourceUrl: 'https://bombayhighcourt.nic.in',
    officialNotificationPdf: 'https://mpsconline.gov.in',
    officialApplicationUrl: 'https://mpsconline.gov.in',
    isVerified: true,
    lastVerifiedDate: '2026-08-15',
    tags: ['Law', 'LLB', 'Civil Judge', 'Judicial Magistrate', 'High Court', 'Prestigious'],
    isSampleData: true,
  },

  // -------------------------------------------------------------
  // 9. PHD / DOCTORATE & RESEARCH
  // -------------------------------------------------------------
  {
    id: 'job-csir-scientist-2026',
    title: 'Senior Scientist / Principal Scientist (Advanced Research)',
    organization: 'Council of Scientific and Industrial Research (CSIR)',
    department: 'Ministry of Science & Technology, Govt of India',
    sector: 'Technical',
    jobType: 'Central',
    vacancies: 85,
    salary: {
      min: 78800,
      max: 209200,
      payLevel: 'Pay Level 12 / 13 (Starting Gross ₹1,40,000 - ₹1,75,000/mo)',
    },
    location: 'CSIR National Laboratories (NCL Pune, CCMB Hyderabad, NPL Delhi, CDRI Lucknow)',
    educationRequired: ['PhD / Doctorate', 'Post Graduation / Master\'s'],
    degreesAllowed: ['PhD in Science (Chemistry, Physics, Biosciences) or PhD in Engineering (CS, Chemical, Materials)'],
    branchesAllowed: ['Chemical Sciences', 'Physical Sciences', 'Biological Sciences', 'Computer Science & AI', 'Material Science'],
    minAge: 25,
    maxAge: 37,
    ageRelaxation: { obc: 3, scSt: 5, pwd: 10 },
    experienceRequiredYears: 2,
    experienceDescription: 'PhD degree with 2+ years of post-doctoral research or R&D publications in peer-reviewed journals.',
    applicationStartDate: '2026-08-01',
    applicationDeadline: '2026-09-15',
    examDate: '2026-11-15',
    admitCardDate: '2026-11-01',
    resultDate: '2026-12-28',
    selectionProcess: [
      'Shortlisting based on Research Publications, Citation Index & Patents',
      'Research Seminar & Presentation before Scientific Assessment Board',
      'Final Selection Interview'
    ],
    syllabus: [
      {
        section: 'Advanced Research Domain',
        marks: 100,
        topics: ['Specialized doctoral thesis research', 'Translational laboratory technology transfer', 'Indigenous innovation roadmap']
      }
    ],
    description: 'CSIR invites applications for Senior Scientists to direct breakthrough national scientific research in quantum materials, therapeutics, synthetic biology, clean energy, and artificial intelligence.',
    officialSourceUrl: 'https://www.csir.res.in',
    officialNotificationPdf: 'https://recruit.csir.res.in',
    officialApplicationUrl: 'https://recruit.csir.res.in',
    isVerified: true,
    lastVerifiedDate: '2026-08-15',
    tags: ['PhD', 'CSIR', 'Senior Scientist', 'Research', 'Doctorate', 'High Salary'],
    isSampleData: true,
  }
];
