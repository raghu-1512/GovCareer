/**
 * Indian Regional Formatters Utility (GovCareer)
 * Formats currency, dates, numbers, and salary ranges according to Indian regional standards (Lakhs, Crores, DD/MM/YYYY, en-IN locale).
 */

/**
 * Format any number into the Indian numbering grouping system (e.g. 12,34,567 instead of 1,234,567)
 */
export function formatIndianNumber(value: number | string | undefined | null): string {
  if (value === undefined || value === null || value === '') return '0';
  const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
  if (isNaN(num)) return '0';
  
  return new Intl.NumberFormat('en-IN').format(num);
}

/**
 * Format large numbers in compact Indian units (Thousands, Lakhs, Crores)
 * e.g. 150000 -> "1.5 Lakh", 12000000 -> "1.2 Crore", 25000 -> "25k"
 */
export function formatIndianCompactNumber(value: number | string | undefined | null): string {
  if (value === undefined || value === null || value === '') return '0';
  const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
  if (isNaN(num)) return '0';

  if (Math.abs(num) >= 10000000) {
    const crore = num / 10000000;
    return `${crore % 1 === 0 ? crore.toFixed(0) : crore.toFixed(2).replace(/\.?0+$/, '')} Crore`;
  }
  if (Math.abs(num) >= 100000) {
    const lakh = num / 100000;
    return `${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(2).replace(/\.?0+$/, '')} Lakh`;
  }
  if (Math.abs(num) >= 1000) {
    const thousand = num / 1000;
    return `${thousand % 1 === 0 ? thousand.toFixed(0) : thousand.toFixed(1).replace(/\.?0+$/, '')}k`;
  }
  return formatIndianNumber(num);
}

/**
 * Format currency in Indian Rupees (INR) with standard symbol ₹ and en-IN digit grouping
 * @example formatIndianCurrency(44900) => "₹44,900"
 * @example formatIndianCurrency(1500000, { compact: true }) => "₹15 Lakh"
 */
export function formatIndianCurrency(
  amount: number | string | undefined | null,
  options: { compact?: boolean; symbol?: boolean; suffixPerMonth?: boolean; suffixPerAnnum?: boolean } = {}
): string {
  if (amount === undefined || amount === null || amount === '') return '₹0';
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/[₹,\s]/g, '')) : amount;
  if (isNaN(num)) return '₹0';

  const sym = options.symbol === false ? '' : '₹';
  let formatted = '';

  if (options.compact) {
    formatted = `${sym}${formatIndianCompactNumber(num)}`;
  } else {
    formatted = `${sym}${new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(num)}`;
  }

  if (options.suffixPerMonth) formatted += ' / month';
  if (options.suffixPerAnnum) formatted += ' / year';

  return formatted;
}

/**
 * Format salary ranges for government posts (e.g. ₹44,900 – ₹1,42,400)
 */
export function formatIndianSalaryRange(
  min: number | undefined | null,
  max: number | undefined | null,
  options: { payLevel?: string; compact?: boolean } = {}
): string {
  const minFormatted = formatIndianCurrency(min, { compact: options.compact });
  const maxFormatted = formatIndianCurrency(max, { compact: options.compact });

  let range = `${minFormatted} – ${maxFormatted}`;
  if (options.payLevel) {
    range += ` (${options.payLevel})`;
  }
  return range;
}

/**
 * Format dates using Indian standard representations:
 * - 'medium' (default): 15 Aug 2026
 * - 'long': 15 August 2026
 * - 'numeric': 15/08/2026 (DD/MM/YYYY)
 * - 'short': 15 Aug
 */
export function formatIndianDate(
  dateInput: string | number | Date | undefined | null,
  options: { format?: 'short' | 'medium' | 'long' | 'numeric'; includeTime?: boolean } = {}
): string {
  if (!dateInput) return 'TBA';

  const date = typeof dateInput === 'string' || typeof dateInput === 'number' 
    ? new Date(dateInput) 
    : dateInput;

  if (isNaN(date.getTime())) return String(dateInput);

  const { format = 'medium', includeTime = false } = options;

  const day = String(date.getDate()).padStart(2, '0');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthFullNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthNum = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  let result = '';
  switch (format) {
    case 'numeric':
      result = `${day}/${monthNum}/${year}`; // DD/MM/YYYY
      break;
    case 'long':
      result = `${date.getDate()} ${monthFullNames[date.getMonth()]} ${year}`;
      break;
    case 'short':
      result = `${date.getDate()} ${monthNames[date.getMonth()]}`;
      break;
    case 'medium':
    default:
      result = `${date.getDate()} ${monthNames[date.getMonth()]} ${year}`;
      break;
  }

  if (includeTime) {
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    result += ` at ${formattedHours}:${minutes} ${ampm}`;
  }

  return result;
}

/**
 * Format relative deadline days with urgency flags
 */
export function formatIndianRelativeDeadline(dateInput: string | Date | undefined | null): {
  text: string;
  daysRemaining: number;
  isUrgent: boolean;
  isExpired: boolean;
} {
  if (!dateInput) {
    return { text: 'No deadline specified', daysRemaining: 999, isUrgent: false, isExpired: false };
  }

  const targetDate = new Date(dateInput);
  if (isNaN(targetDate.getTime())) {
    return { text: 'TBA', daysRemaining: 999, isUrgent: false, isExpired: false };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      text: `Closed on ${formatIndianDate(targetDate, { format: 'numeric' })}`,
      daysRemaining: diffDays,
      isUrgent: false,
      isExpired: true,
    };
  }

  if (diffDays === 0) {
    return {
      text: 'Closing Today! (Last Date)',
      daysRemaining: 0,
      isUrgent: true,
      isExpired: false,
    };
  }

  if (diffDays === 1) {
    return {
      text: 'Closing Tomorrow! (1 day left)',
      daysRemaining: 1,
      isUrgent: true,
      isExpired: false,
    };
  }

  if (diffDays <= 7) {
    return {
      text: `Closing in ${diffDays} days (${formatIndianDate(targetDate, { format: 'short' })})`,
      daysRemaining: diffDays,
      isUrgent: true,
      isExpired: false,
    };
  }

  return {
    text: `Deadline: ${formatIndianDate(targetDate, { format: 'medium' })} (${diffDays} days)`,
    daysRemaining: diffDays,
    isUrgent: false,
    isExpired: false,
  };
}

/**
 * Format vacancies count with Indian numbers and compact representation for massive recruitment drives
 */
export function formatIndianVacancies(vacancies: number | undefined | null): { formatted: string; compact: string } {
  if (!vacancies) return { formatted: '0', compact: '0' };
  return {
    formatted: `${formatIndianNumber(vacancies)} Posts`,
    compact: vacancies >= 10000 ? formatIndianCompactNumber(vacancies) : formatIndianNumber(vacancies),
  };
}
