import clsx from 'clsx';
import { formatCurrency, formatPercent } from '../../lib/formatters';

interface ResultRowProps {
  label: string;
  value: number;
  type?: 'currency' | 'percent';
  /** Extra decimals for percent display */
  decimals?: number;
  highlight?: boolean;
  /** Indent the row slightly for sub-items */
  sub?: boolean;
  /** Show an em-dash instead of $0 when value is 0 and this is true */
  hideZero?: boolean;
}

export function ResultRow({
  label,
  value,
  type = 'currency',
  decimals = 2,
  highlight = false,
  sub = false,
  hideZero = false,
}: ResultRowProps) {
  const displayValue =
    hideZero && value === 0
      ? '—'
      : type === 'percent'
        ? formatPercent(value, decimals)
        : formatCurrency(value);

  return (
    <div
      className={clsx(
        'flex items-center justify-between py-1',
        sub ? 'pl-3' : '',
        highlight ? 'font-semibold' : '',
      )}
    >
      <span className={clsx('text-sm', highlight ? 'text-gray-900' : 'text-gray-600')}>
        {label}
      </span>
      <span
        className={clsx(
          'text-sm tabular-nums',
          highlight ? 'text-gray-900' : 'text-gray-800',
        )}
      >
        {displayValue}
      </span>
    </div>
  );
}
