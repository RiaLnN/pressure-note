import React, { useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import type { PressureRead } from '../../../api/apiTypes';
import type { TargetPressure } from '../../../utils/pressure';
import { getPressureStatus } from '../../../utils/pressure';
import { PRESSURE_STATUS_STYLES } from '../../../utils/pressureStatus';
import { ADD_MEASUREMENT_CONFIG } from '../../main-screen/config';
import { STATS_TEXT } from '../constants';

type Slice = { id: string; label: string; value: number; color: string; cls: string };

function pct(part: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((part / total) * 100);
}

export const DistributionCard: React.FC<{
  measurements: PressureRead[];
  target: TargetPressure;
  disabled?: boolean;
}> = ({ measurements, target, disabled = false }) => {
  const computed = useMemo(() => {
    const counts = { Normal: 0, Elevated: 0, High: 0, Low: 0 } as const;
    const mutable = { ...counts } as Record<keyof typeof counts, number>;

    for (const m of measurements) {
      const status = getPressureStatus({ sys: m.sys, dia: m.dia, target });
      mutable[status] += 1;
    }

    const total = measurements.length;
    const slices: Slice[] = (Object.keys(mutable) as Array<keyof typeof mutable>).map((k) => {
      const label = ADD_MEASUREMENT_CONFIG.pressureStatusLabels[k];
      const style = PRESSURE_STATUS_STYLES[k];
      const color =
        k === 'Normal'
          ? 'var(--color-accent)'
          : k === 'Elevated'
            ? 'var(--color-text-status-elevated)'
            : k === 'High'
              ? 'var(--color-text-status-high)'
              : 'var(--color-text-status-low)';
      return { id: k, label, value: pct(mutable[k], total), color, cls: [style.text].join(' ') };
    });

    return { total, slices };
  }, [measurements, target]);

  return (
    <Card className={['p-6', disabled ? 'opacity-60' : ''].join(' ')}>
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-text-primary">{STATS_TEXT.distribution.title}</h2>
      </header>

      {disabled ? (
        <div className="rounded-2xl border border-border-subtle/60 bg-bg-surface-muted/10 p-4 text-sm text-text-soft">
          {STATS_TEXT.distribution.placeholder}
        </div>
      ) : (
        <div className="flex items-center gap-5">
          <div className="relative size-28">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="4"
              />
              {(() => {
                let offset = 0;
                return computed.slices
                  .filter((s) => s.value > 0)
                  .map((s) => {
                    const dash = `${s.value} ${100 - s.value}`;
                    const el = (
                      <path
                        key={s.id}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={s.color}
                        strokeWidth="4"
                        strokeDasharray={dash}
                        strokeDashoffset={-offset}
                        strokeLinecap="round"
                      />
                    );
                    offset += s.value;
                    return el;
                  });
              })()}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold tabular-nums">
                  {computed.slices.find((s) => s.id === 'Normal')?.value ?? 0}%
                </div>
                <div className="text-[11px] text-text-soft">{ADD_MEASUREMENT_CONFIG.pressureStatusLabels.Normal}</div>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            {computed.slices.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="inline-block size-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className={['truncate', s.cls].join(' ')}>{s.label}</span>
                </div>
                <span className="tabular-nums text-text-secondary">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

