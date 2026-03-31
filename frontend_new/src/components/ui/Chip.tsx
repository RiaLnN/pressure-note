import React from 'react';

export interface ChipProps {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  disabled = false,
  onClick,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        'px-3 py-2 rounded-2xl text-sm font-medium transition-colors active:scale-95',
        'border border-border-subtle/60',
        selected
          ? 'bg-accent/10 text-accent border-accent/50'
          : 'bg-bg-surface-muted/10 text-text-muted hover:bg-bg-surface-muted/40',
        disabled ? 'opacity-60 cursor-not-allowed' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label}
    </button>
  );
};

