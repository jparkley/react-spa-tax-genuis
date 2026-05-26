import React, { useId } from 'react';
import clsx from 'clsx';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  helpText?: string;
  disabled?: boolean;
}

export function Toggle({ label, checked, onChange, helpText, disabled }: ToggleProps) {
  const id = useId();

  return (
    <label
      htmlFor={id}
      className={clsx(
        'flex items-start gap-3 cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      <div className="relative flex-shrink-0 mt-0.5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div
          className={clsx(
            'relative w-9 h-5 rounded-full transition-colors duration-200',
            'after:content-[""] after:absolute after:top-0.5 after:left-0.5',
            'after:bg-white after:rounded-full after:w-4 after:h-4',
            'after:transition-transform after:duration-200',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-1',
            checked
              ? 'bg-blue-600 after:translate-x-4'
              : 'bg-gray-300 after:translate-x-0',
          )}
        />
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-700">{label}</span>
        {helpText && (
          <span className="text-xs text-gray-500 mt-0.5">{helpText}</span>
        )}
      </div>
    </label>
  );
}
