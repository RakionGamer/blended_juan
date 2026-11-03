import React from 'react';
import { Badge } from '../ui/badge.jsx';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils.js';

export default function RiskBadge({ level, score, className }) {
  const normLevel = (level || 'Bajo').toLowerCase();

  const configs = {
    alto: {
      variant: 'destructive',
      className: 'bg-red-600 text-white hover:bg-red-600/90 font-medium',
      label: 'Alto',
      icon: AlertCircle
    },
    medio: {
      variant: 'warning',
      className: 'bg-amber-500 text-zinc-950 hover:bg-amber-500/90 font-medium',
      label: 'Medio',
      icon: AlertTriangle
    },
    bajo: {
      variant: 'success',
      className: 'bg-emerald-600 text-white hover:bg-emerald-600/90 font-medium',
      label: 'Bajo',
      icon: CheckCircle2
    }
  };

  const current = configs[normLevel] || configs.bajo;
  const Icon = current.icon;

  return (
    <Badge
      variant={current.variant}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold tabular-nums shadow-xs',
        current.className,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{current.label}</span>
      {score !== undefined && (
        <span className="opacity-90 font-mono text-[11px] font-normal pl-1 border-l border-white/20">
          {(score * 100).toFixed(0)}%
        </span>
      )}
    </Badge>
  );
}
