import React, { useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { STATS_TEXT } from '../constants';

type SeriesPoint = { date: string; sys: number | null; dia: number | null };

function toPoints(values: Array<number | null>, width: number, height: number, padding: number, min: number, max: number) {
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

  return { points: coords.filter(Boolean).join(' '), circles };
}

export const DynamicsChartCard: React.FC<{
  points: SeriesPoint[];
  labels: string[];
}> = ({ points, labels }) => {
  const width = 320;
  const height = 160;
  const padding = 14;

  const sysSeries = useMemo(() => points.map((p) => p.sys), [points]);
  const diaSeries = useMemo(() => points.map((p) => p.dia), [points]);

  const minMax = useMemo(() => {
    const present = [...sysSeries, ...diaSeries].filter((v): v is number => typeof v === 'number');
    if (present.length === 0) return null;
    return { min: Math.min(...present), max: Math.max(...present) };
  }, [sysSeries, diaSeries]);

  const hasData = !!minMax;
  const sys = useMemo(() => (minMax ? toPoints(sysSeries, width, height, padding, minMax.min, minMax.max) : null), [sysSeries, minMax]);
  const dia = useMemo(() => (minMax ? toPoints(diaSeries, width, height, padding, minMax.min, minMax.max) : null), [diaSeries, minMax]);

  return (
    <Card className="p-6">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-text-primary">{STATS_TEXT.dynamics.title}</h2>
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-[2px] w-5 bg-accent rounded-full" />
            {STATS_TEXT.dynamics.sys}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-[2px] w-5 bg-chart-line rounded-full" />
            {STATS_TEXT.dynamics.dia}
          </span>
        </div>
      </header>

      <div className="rounded-2xl bg-bg-chart-track/40 border border-border-subtle/40 p-3">
        {hasData && sys && dia ? (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[160px]" role="img" aria-label={STATS_TEXT.dynamics.title}>
            <polyline
              points={sys.points}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {sys.circles.map((c, idx) => (
              <circle
                key={`s-${idx}`}
                cx={c.cx}
                cy={c.cy}
                r="4"
                fill="var(--color-bg-surface)"
                stroke="var(--color-accent)"
                strokeWidth="2.5"
              />
            ))}

            <polyline
              points={dia.points}
              fill="none"
              stroke="var(--color-chart-line)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.95"
            />
          </svg>
        ) : (
          <p className="text-sm text-text-soft py-10 text-center">{STATS_TEXT.dynamics.empty}</p>
        )}
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

