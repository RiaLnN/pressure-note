import React from 'react';
import { Card } from '../../../components/ui/Card';

export const KpiCard: React.FC<{
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  accent?: 'green' | 'orange' | 'neutral';
}> = ({ title, value, subtitle, accent = 'neutral' }) => {
  const accentCls =
    accent === 'green'
      ? 'bg-bg-status-normal/40 border-border-status-normal/40'
      : accent === 'orange'
        ? 'bg-bg-status-elevated/40 border-border-status-elevated/40'
        : 'bg-bg-surface-muted/10 border-border-subtle/60';

  return (
    <Card className={['p-4', 'border', accentCls].join(' ')}>
      <div className="text-xs font-semibold tracking-[0.18em] uppercase text-text-soft">{title}</div>
      <div className="mt-2 text-3xl font-bold leading-none tabular-nums">{value}</div>
      {subtitle ? <div className="mt-2 text-xs text-text-muted">{subtitle}</div> : null}
    </Card>
  );
};

