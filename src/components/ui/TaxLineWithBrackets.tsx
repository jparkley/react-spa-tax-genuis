import { useState } from 'react';
import clsx from 'clsx';
import type { BracketDetail } from '../../types/tax.types';
import { formatCurrency, formatPercent } from '../../lib/formatters';

interface ExtraLine {
  label: string;
  value: number;
  /** Display prefix before the formatted value, e.g. "−" for a credit */
  prefix?: string;
  bold?: boolean;
}

interface TaxLineWithBracketsProps {
  label: string;
  value: number;
  highlight?: boolean;
  bracketDetails: BracketDetail[];
  /** Additional summary rows shown below the bracket table (e.g. LTCG, CTC, total) */
  extras?: ExtraLine[];
}

export function TaxLineWithBrackets({
  label,
  value,
  highlight = false,
  bracketDetails,
  extras,
}: TaxLineWithBracketsProps) {
  const [open, setOpen] = useState(false);
  const hasDetail = value > 0 && (bracketDetails.length > 0 || (extras !== undefined && extras.length > 0));

  return (
    <div
      onMouseEnter={() => hasDetail && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Main row — mirrors ResultRow */}
      <div className="flex items-center justify-between py-1">
        <span className={clsx('text-sm', highlight ? 'text-gray-900 font-semibold' : 'text-gray-600')}>
          {label}
        </span>
        <span
          className={clsx(
            'text-sm tabular-nums',
            highlight ? 'text-gray-900 font-semibold' : 'text-gray-800',
            hasDetail && 'cursor-help border-b border-dashed border-gray-400',
          )}
          title={hasDetail ? 'Hover to see bracket breakdown' : undefined}
        >
          {formatCurrency(value)}
        </span>
      </div>

      {/* Inline bracket breakdown — shown on hover */}
      {open && hasDetail && (
        <div className="mb-2 rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs">
          {bracketDetails.length > 0 && (
            <table className="w-full">
              <thead>
                <tr className="text-gray-500 border-b border-blue-100">
                  <th className="text-left pb-1 font-medium">Rate</th>
                  <th className="text-right pb-1 font-medium">Income in bracket</th>
                  <th className="text-right pb-1 font-medium">Tax</th>
                </tr>
              </thead>
              <tbody>
                {bracketDetails.map((d, i) => (
                  <tr key={i} className="text-gray-700">
                    <td className="py-0.5 tabular-nums">{formatPercent(d.rate, 1)}</td>
                    <td className="py-0.5 text-right tabular-nums">{formatCurrency(d.incomeInBracket)}</td>
                    <td className="py-0.5 text-right tabular-nums">{formatCurrency(d.taxInBracket)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {extras && extras.length > 0 && (
            <div className={clsx('space-y-0.5', bracketDetails.length > 0 && 'mt-2 pt-2 border-t border-blue-100')}>
              {extras.map((e, i) => (
                <div key={i} className={clsx('flex justify-between', e.bold && 'font-semibold text-gray-900')}>
                  <span className="text-gray-600">{e.label}</span>
                  <span className="tabular-nums">
                    {e.prefix ?? ''}{formatCurrency(e.value)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
