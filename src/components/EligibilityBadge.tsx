import React from 'react';
import { EligibilityStatus } from '../types';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface EligibilityBadgeProps {
  status: EligibilityStatus;
  score?: number;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const EligibilityBadge: React.FC<EligibilityBadgeProps> = ({
  status,
  score,
  showScore = false,
  size = 'md',
  onClick,
}) => {
  const config = {
    eligible: {
      label: 'Eligible',
      icon: CheckCircle2,
      bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
      dotBg: 'bg-emerald-500',
    },
    warning: {
      label: 'Check Requirement',
      icon: AlertTriangle,
      bg: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
      dotBg: 'bg-amber-500',
    },
    not_eligible: {
      label: 'Not Eligible',
      icon: XCircle,
      bg: 'bg-rose-500/10 text-rose-700 border-rose-500/30',
      dotBg: 'bg-rose-500',
    },
  }[status];

  const Icon = config.icon;
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-medium px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3.5 py-1.5 gap-2',
  }[size];

  return (
    <span
      id={`eligibility-badge-${status}`}
      onClick={onClick}
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses} ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
      {showScore && score !== undefined && (
        <span className="opacity-80 ml-0.5 font-mono">({score}%)</span>
      )}
    </span>
  );
};
