import { Job, UserProfile, EligibilityResult, EligibilityCheckItem, EligibilityStatus } from '../types';

export function calculateAge(dobString: string): number {
  if (!dobString) return 23; // fallback default
  const dob = new Date(dobString);
  const diffMs = Date.now() - dob.getTime();
  const ageDt = new Date(diffMs);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
}

export const EDUCATION_LEVEL_ORDER: Record<string, number> = {
  '10th Pass': 1,
  '12th Pass': 2,
  'Diploma': 3,
  'Graduation / Bachelor\'s': 4,
  'B.Tech / B.E.': 4,
  'LLB / Law': 4,
  'MBBS / Medical': 4,
  'Post Graduation / Master\'s': 5,
  'PhD / Doctorate': 6,
};

export function evaluateJobEligibility(job: Job, profile: UserProfile | null): EligibilityResult {
  if (!profile) {
    return {
      jobId: job.id,
      status: 'warning',
      score: 50,
      title: job.title,
      reason: 'Sign in and complete your profile to see accurate personalized eligibility breakdown.',
      checks: [
        {
          factor: 'Profile Status',
          pass: 'warning',
          userValue: 'Not Logged In',
          requirement: 'Complete Profile Required',
          note: 'Please sign in to run automatic eligibility rule checks.',
        }
      ]
    };
  }

  const checks: EligibilityCheckItem[] = [];
  let totalScore = 100;
  let hasFailure = false;
  let hasWarning = false;

  // 1. Age Check with Category Relaxation
  const userAge = calculateAge(profile.dateOfBirth);
  let maxAllowedAge = job.maxAge;
  let ageRelaxationApplied = 0;

  if (profile.category === 'OBC' && job.ageRelaxation?.obc) {
    ageRelaxationApplied = job.ageRelaxation.obc;
    maxAllowedAge += ageRelaxationApplied;
  } else if ((profile.category === 'SC' || profile.category === 'ST') && job.ageRelaxation?.scSt) {
    ageRelaxationApplied = job.ageRelaxation.scSt;
    maxAllowedAge += ageRelaxationApplied;
  } else if (profile.category === 'PwBD' && job.ageRelaxation?.pwd) {
    ageRelaxationApplied = job.ageRelaxation.pwd;
    maxAllowedAge += ageRelaxationApplied;
  }

  const isAgeValid = userAge >= job.minAge && userAge <= maxAllowedAge;
  const isAgeWarning = userAge === maxAllowedAge; // right at boundary

  if (isAgeValid) {
    checks.push({
      factor: 'Age Limit',
      pass: isAgeWarning ? 'warning' : true,
      userValue: `${userAge} years (${profile.category})`,
      requirement: `${job.minAge} - ${job.maxAge} yrs ${ageRelaxationApplied > 0 ? `(+${ageRelaxationApplied}y for ${profile.category} = max ${maxAllowedAge})` : ''}`,
      note: isAgeWarning ? 'Warning: You are currently in your final year of age eligibility.' : '✓ Within required age range',
    });
    if (isAgeWarning) hasWarning = true;
  } else {
    hasFailure = true;
    totalScore -= 40;
    checks.push({
      factor: 'Age Limit',
      pass: false,
      userValue: `${userAge} years`,
      requirement: `${job.minAge} - ${job.maxAge} yrs (${profile.category} max ${maxAllowedAge})`,
      note: userAge < job.minAge ? `Below minimum age limit of ${job.minAge} years.` : `Exceeds max age limit (${maxAllowedAge} yrs including ${profile.category} relaxation).`,
    });
  }

  // 2. Education Level Check
  const userLevelRank = EDUCATION_LEVEL_ORDER[profile.educationLevel] || 4;
  const jobMinLevelRank = Math.min(...job.educationRequired.map(lvl => EDUCATION_LEVEL_ORDER[lvl] || 4));
  const educationPass = userLevelRank >= jobMinLevelRank;

  if (educationPass) {
    checks.push({
      factor: 'Education Level',
      pass: true,
      userValue: profile.educationLevel,
      requirement: job.educationRequired.join(' / '),
      note: `✓ ${profile.educationLevel} satisfies the required minimum educational threshold (${job.educationRequired.join(' / ')}).`,
    });
  } else {
    hasFailure = true;
    totalScore -= 35;
    checks.push({
      factor: 'Education Level',
      pass: false,
      userValue: profile.educationLevel,
      requirement: job.educationRequired.join(' / '),
      note: `Requires minimum ${job.educationRequired.join(' or ')}.`,
    });
  }

  // 3. Degree & Branch Match Check
  const jobDegreesLower = job.degreesAllowed.map(d => d.toLowerCase());
  const isAnyDegreeAllowed = jobDegreesLower.some(d => 
    d.includes('any') || 
    d.includes('bachelor') || 
    d.includes('graduate') ||
    d.includes('10th') ||
    d.includes('matriculation') ||
    d.includes('12th') ||
    d.includes('intermediate') ||
    d.includes('diploma')
  );
  
  const userDegreeLower = (profile.degree || '').toLowerCase();
  const userBranchLower = (profile.branch || '').toLowerCase();

  // If the job is 10th or 12th pass and the user has reached that level or higher, basic degree is satisfied
  let degreeMatch = isAnyDegreeAllowed;
  if (!degreeMatch) {
    if (jobMinLevelRank <= 2 && userLevelRank >= jobMinLevelRank) {
      degreeMatch = true;
    } else {
      degreeMatch = jobDegreesLower.some(d => 
        userDegreeLower.includes(d) || 
        d.includes(userDegreeLower) ||
        (userDegreeLower.includes('b.tech') && d.includes('b.tech')) ||
        (userDegreeLower.includes('b.e') && d.includes('b.e')) ||
        (userDegreeLower.includes('mca') && d.includes('mca')) ||
        (userDegreeLower.includes('mbbs') && d.includes('mbbs')) ||
        (userDegreeLower.includes('llb') && d.includes('llb')) ||
        (userDegreeLower.includes('b.sc') && d.includes('b.sc')) ||
        (userDegreeLower.includes('b.com') && d.includes('b.com')) ||
        (userDegreeLower.includes('b.a') && d.includes('b.a'))
      );
    }
  }

  let branchMatch = true;
  if (job.branchesAllowed && job.branchesAllowed.length > 0 && !job.branchesAllowed.some(b => b.toLowerCase() === 'any')) {
    const jobBranchesLower = job.branchesAllowed.map(b => b.toLowerCase());
    branchMatch = jobBranchesLower.some(b => 
      userBranchLower.includes(b) || 
      b.includes(userBranchLower) ||
      (userBranchLower.includes('computer') && (b.includes('computer') || b.includes('it') || b.includes('software'))) ||
      (userBranchLower.includes('cse') && (b.includes('computer') || b.includes('it'))) ||
      (userBranchLower.includes('it') && (b.includes('it') || b.includes('information') || b.includes('computer'))) ||
      (userBranchLower.includes('ece') && (b.includes('electronics') || b.includes('communication'))) ||
      (userBranchLower.includes('mech') && b.includes('mechanical')) ||
      (userBranchLower.includes('civil') && b.includes('civil')) ||
      (userBranchLower.includes('electrical') && (b.includes('electrical') || b.includes('eee'))) ||
      (userBranchLower.includes('science') && (b.includes('science') || b.includes('pcm'))) ||
      (userBranchLower.includes('arts') && b.includes('arts')) ||
      (userBranchLower.includes('commerce') && b.includes('commerce'))
    );
  }

  if (degreeMatch && branchMatch) {
    checks.push({
      factor: 'Degree & Discipline',
      pass: true,
      userValue: `${profile.degree || profile.educationLevel} (${profile.branch || 'General'})`,
      requirement: job.branchesAllowed && !job.branchesAllowed.includes('Any') 
        ? `${job.branchesAllowed.join(', ')}` 
        : `${job.degreesAllowed.slice(0, 2).join(', ')}`,
      note: `✓ ${profile.degree || profile.educationLevel} (${profile.branch || 'General'}) satisfies educational qualifications.`,
    });
  } else if (degreeMatch && !branchMatch) {
    hasWarning = true;
    totalScore -= 20;
    checks.push({
      factor: 'Degree & Discipline',
      pass: 'warning',
      userValue: `${profile.degree || profile.educationLevel} (${profile.branch || 'General'})`,
      requirement: `Targeted Disciplines: ${job.branchesAllowed?.join(', ')}`,
      note: `Warning: This notification specifically mentions ${job.branchesAllowed?.join(', ')}. Check official notice for equivalent discipline clauses.`,
    });
  } else {
    hasFailure = true;
    totalScore -= 30;
    checks.push({
      factor: 'Degree & Discipline',
      pass: false,
      userValue: `${profile.degree || profile.educationLevel} (${profile.branch || 'General'})`,
      requirement: job.degreesAllowed.join(', '),
      note: `Requires specific qualification: ${job.degreesAllowed.join(', ')}.`,
    });
  }

  // 4. Experience Requirement Check
  const userExp = profile.experienceYears || 0;
  const requiredExp = job.experienceRequiredYears || 0;

  if (userExp >= requiredExp) {
    checks.push({
      factor: 'Experience',
      pass: true,
      userValue: `${userExp} years`,
      requirement: requiredExp === 0 ? 'Fresher friendly (0 years)' : `Min ${requiredExp} years`,
      note: requiredExp === 0 ? '✓ Freshers accepted without prior work experience.' : `✓ Meets minimum experience requirement of ${requiredExp} year(s).`,
    });
  } else {
    hasFailure = true;
    totalScore -= 25;
    checks.push({
      factor: 'Experience',
      pass: false,
      userValue: `${userExp} years`,
      requirement: `Minimum ${requiredExp} years mandatory`,
      note: `This role requires at least ${requiredExp} years of relevant industry experience.`,
    });
  }

  // 5. State / Location / Domicile Check (for State Govt Jobs)
  if (job.jobType === 'State' && job.state) {
    const isStateMatch = (profile.state || '').toLowerCase() === job.state.toLowerCase();
    if (isStateMatch) {
      checks.push({
        factor: 'State Domicile / Quota',
        pass: true,
        userValue: profile.state,
        requirement: `${job.state} State Reservation / Domicile`,
        note: `✓ Resident of ${job.state}; eligible for full state category reservations.`,
      });
    } else {
      hasWarning = true;
      totalScore -= 10;
      checks.push({
        factor: 'State Domicile / Quota',
        pass: 'warning',
        userValue: profile.state || 'Other State',
        requirement: `${job.state} State Post`,
        note: `Non-domicile applicants may apply under Unreserved (UR/General) quota and must satisfy state language proficiency.`,
      });
    }
  }

  // Determine overall status
  let status: EligibilityStatus = 'eligible';
  let reason = '';

  if (hasFailure) {
    status = 'not_eligible';
    const failedChecks = checks.filter(c => c.pass === false).map(c => c.factor);
    reason = `Not Eligible: You do not meet the mandatory criteria for ${failedChecks.join(' and ')}.`;
  } else if (hasWarning) {
    status = 'warning';
    reason = 'Check Requirement: You meet primary criteria, but please review branch specialization or state domicile requirements in the official PDF.';
  } else {
    status = 'eligible';
    reason = `Eligible: Your qualification (${profile.degree || profile.educationLevel}), age (${userAge} yrs), and category (${profile.category}) strictly fulfill all official notification rules.`;
  }

  // Recommendation explanation
  let recommendationExplanation = '';
  if (status === 'eligible') {
    recommendationExplanation = `Recommended because your ${profile.educationLevel} / ${profile.degree || 'Degree'} (${profile.branch || 'Discipline'}) qualification and age (${userAge} yrs) directly match the notification requirements.`;
  } else if (status === 'warning') {
    recommendationExplanation = `Partially matching based on your ${profile.educationLevel}. Check specific discipline or domicile equivalence.`;
  } else {
    recommendationExplanation = `Not directly matching due to ${checks.filter(c => !c.pass).map(c => c.factor).join(', ')}.`;
  }

  return {
    jobId: job.id,
    status,
    score: Math.max(10, Math.min(100, totalScore)),
    title: job.title,
    reason,
    checks,
    recommendationExplanation,
  };
}
