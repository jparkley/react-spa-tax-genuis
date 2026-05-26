import React, { useState, useEffect, useId } from 'react';
import clsx from 'clsx';

interface CurrencyInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  /** Optional helper text shown below the input */
  helpText?: string;
  /** Hard cap on input value */
  max?: number;
  disabled?: boolean;
  placeholder?: string;
}

function formatDisplay(value: number): string {
  if (value === 0) return '';
  return new Intl.NumberFormat('en-US').format(value);
}

export function CurrencyInput({
  label,
  value,
  onChange,
  helpText,
  max,
  disabled,
  placeholder = '0',
}: CurrencyInputProps) {
  const id = useId();
  const [raw, setRaw] = useState(formatDisplay(value));
  const [focused, setFocused] = useState(false);

  // Sync display when value changes externally (e.g. reset)
  useEffect(() => {
    if (!focused) {
      setRaw(formatDisplay(value));
    }
  }, [value, focused]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target.value;
    setRaw(input);
    const stripped = input.replace(/[,$\s]/g, '');
    if (stripped === '' || stripped === '-') {
      onChange(0);
      return;
    }
    const parsed = parseFloat(stripped);
    if (!isNaN(parsed)) {
      const capped = max !== undefined ? Math.min(parsed, max) : parsed;
      onChange(Math.max(0, capped));
    }
  }

  function handleBlur() {
    setFocused(false);
    // Reformat on blur
    setRaw(formatDisplay(value));
  }

  function handleFocus() {
    setFocused(true);
    // Show raw number on focus (no commas, easier to edit)
    setRaw(value === 0 ? '' : String(value));
  }

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm text-gray-700">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 text-sm">
          $
        </span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={raw}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          aria-describedby={helpText ? `${id}-help` : undefined}
          className={clsx(
            'block w-full rounded-md border border-gray-300 py-1.5 pl-7 pr-3',
            'text-sm text-gray-900 placeholder-gray-400',
            'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
            disabled && 'bg-gray-50 opacity-60 cursor-not-allowed',
          )}
        />
      </div>
      {helpText && (
        <p id={`${id}-help`} className="text-xs text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
}
