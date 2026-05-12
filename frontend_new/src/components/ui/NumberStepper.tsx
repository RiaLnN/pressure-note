import React from 'react';

export interface NumberStepperProps {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (next: number) => void;
}

function clamp(value: number, min?: number, max?: number) {
  let next = value;
  if (typeof min === 'number') next = Math.max(min, next);
  if (typeof max === 'number') next = Math.min(max, next);
  return next;
}

export const NumberStepper: React.FC<NumberStepperProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <div className="text-xs font-semibold tracking-[0.18em] uppercase text-text-soft">
          {label}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          className="size-10 rounded-2xl border border-border-subtle/60 bg-bg-surface-muted/30 flex items-center justify-center text-accent font-bold active:scale-95"
          onClick={() => onChange(clamp(value - step, min, max))}
        >
          -
        </button>

        <div className="min-w-[72px] px-4 py-3 rounded-2xl border border-border-subtle/60 bg-bg-surface-muted/50 text-center">
          <div className="text-2xl font-bold leading-none tabular-nums">{value}</div>
          {unit ? <div className="text-[11px] text-text-muted mt-1">{unit}</div> : null}
        </div>

        <button
          type="button"
          className="size-10 rounded-2xl border border-border-subtle/60 bg-bg-surface-muted/30 flex items-center justify-center text-accent font-bold active:scale-95"
          onClick={() => onChange(clamp(value + step, min, max))}
        >
          +
        </button>
      </div>
    </div>
  );
};

