import React from 'react';
import { Clock, CheckCircle, AlertCircle, CheckCheck, XCircle, ShieldAlert } from 'lucide-react';

export type ApplicationStatus =
  | 'PAYMENT_PENDING'
  | 'PAYMENT_RECEIVED'
  | 'APPLICATION_PENDING'
  | 'CONFIRMED'
  | 'REJECTED';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  const configs: Record<
    string,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode; dot: string }
  > = {
    PAYMENT_PENDING: {
      label: 'Payment Pending',
      bg: 'bg-amber-500/10',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-500/30',
      dot: 'bg-amber-500',
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    PAYMENT_RECEIVED: {
      label: 'Payment Received',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-500/30',
      dot: 'bg-emerald-500',
      icon: <CheckCircle className="w-3.5 h-3.5" />,
    },
    APPLICATION_PENDING: {
      label: 'Application Under Review',
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-700 dark:text-cyan-400',
      border: 'border-cyan-500/30',
      dot: 'bg-cyan-500',
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    CONFIRMED: {
      label: 'Confirmed / Selected',
      bg: 'bg-green-500/15',
      text: 'text-green-700 dark:text-green-400',
      border: 'border-green-500/40',
      dot: 'bg-green-500',
      icon: <CheckCheck className="w-3.5 h-3.5" />,
    },
    REJECTED: {
      label: 'Rejected',
      bg: 'bg-rose-500/10',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-500/30',
      dot: 'bg-rose-500',
      icon: <XCircle className="w-3.5 h-3.5" />,
    },
  };

  const config = configs[status] || {
    label: status.replace(/_/g, ' '),
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-300',
    dot: 'bg-gray-400',
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]} transition-colors`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};
