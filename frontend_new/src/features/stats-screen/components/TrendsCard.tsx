import React from 'react';
import { Card } from '../../../components/ui/Card';
import { STATS_TEXT } from '../constants';

export const TrendsCard: React.FC<{ disabled?: boolean }> = ({ disabled = false }) => {
  return (
    <Card className={['p-6', disabled ? 'opacity-60' : ''].join(' ')}>
      <header className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-text-primary">{STATS_TEXT.trends.title}</h2>
      </header>

      <div className="space-y-3">
        <div className="rounded-2xl border border-border-subtle/60 bg-bg-surface-muted/10 p-4">
          <div className="text-sm font-semibold text-text-primary">Систолічний тренд</div>
          <div className="mt-1 text-xs text-text-soft">{STATS_TEXT.trends.placeholder}</div>
        </div>
        <div className="rounded-2xl border border-border-subtle/60 bg-bg-surface-muted/10 p-4">
          <div className="text-sm font-semibold text-text-primary">Діастолічний тренд</div>
          <div className="mt-1 text-xs text-text-soft">{STATS_TEXT.trends.placeholder}</div>
        </div>
      </div>
    </Card>
  );
};

