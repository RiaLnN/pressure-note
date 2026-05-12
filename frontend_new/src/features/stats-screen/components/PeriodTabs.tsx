import React from 'react';
import type { StatsPeriod } from '../types';
import { STATS_TEXT } from '../constants';

const PERIODS: Array<{ id: StatsPeriod; label: string }> = [
  { id: '7d', label: STATS_TEXT.period.sevenDays },
  { id: '30d', label: STATS_TEXT.period.thirtyDays },
  { id: '1y', label: STATS_TEXT.period.year },
];

export const PeriodTabs: React.FC<{
  value: StatsPeriod;
  onChange: (p: StatsPeriod) => void;
}> = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-3 gap-2 rounded-3xl border border-border-subtle/60 bg-bg-surface-muted/20 p-2">
      {PERIODS.map((p) => {
        const active = p.id === value;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onChange(p.id)}
            className={[
              'rounded-2xl px-3 py-3 text-sm font-semibold whitespace-pre-line leading-tight transition-colors',
              active
                ? 'bg-bg-surface border border-border-subtle/60 text-text-primary'
                : 'text-text-muted hover:bg-bg-surface-muted/40',
            ].join(' ')}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
};

