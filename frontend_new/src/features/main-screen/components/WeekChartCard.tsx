import React, { useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import type { PressureGroupWeekly } from '../../../api/apiTypes';
import { MAIN_SCREEN_TEXT } from '../constants';
import { formatWeekdayShort } from '../../../utils/date';

function getSysSeries(week: PressureGroupWeekly | null) {
  if (!week?.days?.length) return [];
  return week.days.map((d) => (d.average ? d.average.sys : null));
}

function toPoints(values: Array<number | null>, width: number, height: number, padding: number) {
  const present = values.filter((v): v is number => typeof v === 'number');
  if (present.length === 0) return { points: '', circles: [] as Array<{ cx: number; cy: number }>, min: 0, max: 0 };

  const min = Math.min(...present);
  const max = Math.max(...present);
  const span = Math.max(1, max - min);

  const stepX = (width - padding * 2) / Math.max(1, values.length - 1);

  const circles: Array<{ cx: number; cy: number }> = [];
  const coords = values.map((v, i) => {
    const x = padding + i * stepX;
    if (v == null) return null;
    const t = (v - min) / span;
    const y = padding + (1 - t) * (height - padding * 2);
    circles.push({ cx: x, cy: y });
    return `${x},${y}`;
  });

  const points = coords.filter(Boolean).join(' ');
  return { points, circles, min, max };
}

export const WeekChartCard: React.FC<{ week: PressureGroupWeekly | null; onDetails?: () => void }> = ({
  week,
  onDetails,
}) => {
  const width = 320;
  const height = 140;
  const padding = 14;

  const series = useMemo(() => getSysSeries(week), [week]);
  const labels = useMemo(
    () => (week?.days ?? []).map((d) => formatWeekdayShort(d.date)),
    [week],
  );

  const chart = useMemo(() => toPoints(series, width, height, padding), [series]);
  const hasData = chart.circles.length > 0;

  return (
    <Card className="p-6">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-text-primary">{MAIN_SCREEN_TEXT.week.title}</h2>
        <button
          type="button"
          onClick={onDetails}
          className="text-sm font-medium text-accent hover:text-accent-strong transition-colors"
        >
          {MAIN_SCREEN_TEXT.week.details}
        </button>
      </header>

      <div className="rounded-2xl bg-bg-chart-track/40 border border-border-subtle/40 p-3">
        {hasData ? (
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-[140px]"
            role="img"
            aria-label={MAIN_SCREEN_TEXT.week.title}
          >
            <defs>
              <linearGradient id="weekLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="var(--color-accent)" />
                <stop offset="1" stopColor="var(--color-chart-line)" />
              </linearGradient>
            </defs>

            <polyline
              points={chart.points}
              fill="none"
              stroke="url(#weekLine)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {chart.circles.map((c, idx) => (
              <circle
                key={idx}
                cx={c.cx}
                cy={c.cy}
                r="4"
                fill="var(--color-bg-surface)"
                stroke="var(--color-chart-point)"
                strokeWidth="2.5"
              />
            ))}
          </svg>
        ) : (
          <p className="text-sm text-text-soft py-10 text-center">{MAIN_SCREEN_TEXT.week.empty}</p>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-text-muted">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-[2px] w-6 bg-accent rounded-full" />
          {MAIN_SCREEN_TEXT.week.legend}
        </span>
        <span className="tabular-nums">
          {hasData ? `${Math.round(chart.min)}–${Math.round(chart.max)}` : ''}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-[11px] text-text-soft">
        {labels.slice(0, 7).map((l, idx) => (
          <div key={idx} className="text-center truncate">
            {l}
          </div>
        ))}
      </div>
    </Card>
  );
};

