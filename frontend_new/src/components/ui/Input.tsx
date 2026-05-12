import React from 'react';

export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'number';
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  inputClassName?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  leftIcon,
  inputClassName = '',
  className = '',
}) => {
  return (
    <div
      className={[
        'w-full flex items-center gap-3 rounded-3xl border border-border-subtle/60 bg-bg-surface-muted/30 px-4',
        disabled ? 'opacity-60 cursor-not-allowed' : '',
        className,
      ].join(' ')}
    >
      {leftIcon ? <div className="text-text-muted">{leftIcon}</div> : null}
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={[
          'w-full py-3 bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted',
          inputClassName,
        ].join(' ')}
      />
    </div>
  );
};

