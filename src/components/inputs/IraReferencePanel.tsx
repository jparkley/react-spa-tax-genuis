import { formatCurrency } from '../../lib/formatters';
import type { FilingStatus } from '../../types/tax.types';

interface IraReferencePanelProps {
  magi: number;
  iraContributionLimit: number;
  filingStatus: FilingStatus;
  rothPhaseOut: { start: number; end: number };
}

function computeRothAllowed(magi: number, limit: number, start: number, end: number): number {
  if (magi <= start) return limit;
  if (magi >= end) return 0;
  // Proportional reduction, rounded to nearest $10; minimum $200 if still eligible
  const raw = limit * (end - magi) / (end - start);
  const rounded = Math.round(raw / 10) * 10;
  return rounded < 200 ? 200 : rounded;
}

const FILING_STATUS_LABELS: Record<FilingStatus, string> = {
  single: 'Single',
  mfj:    'Married Filing Jointly',
  mfs:    'Married Filing Separately',
  hoh:    'Head of Household',
  qss:    'Qualifying Surviving Spouse',
};

export function IraReferencePanel({
  magi,
  iraContributionLimit,
  filingStatus,
  rothPhaseOut,
}: IraReferencePanelProps) {
  const { start, end } = rothPhaseOut;
  const rothAllowed = computeRothAllowed(magi, iraContributionLimit, start, end);

  const status: 'full' | 'partial' | 'none' =
    magi <= start ? 'full' : magi >= end ? 'none' : 'partial';

  const statusConfig = {
    full:    { label: 'Full contribution allowed', color: 'text-green-700 bg-green-50 border-green-200' },
    partial: { label: `Partial: ~${formatCurrency(rothAllowed)} allowed`, color: 'text-amber-700 bg-amber-50 border-amber-200' },
    none:    { label: 'Not eligible (MAGI too high)', color: 'text-red-700 bg-red-50 border-red-200' },
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-3 text-xs">

      {/* MAGI explanation */}
      <div>
        <p className="font-semibold text-gray-700 mb-1">How MAGI is calculated</p>
        <p className="text-gray-500 leading-relaxed">
          MAGI (Modified Adjusted Gross Income) for IRA purposes ={' '}
          gross income &minus; pre-tax workplace contributions (401k/HSA/FSA)
          {' '}&minus; ½ SE tax (if self-employed).
          It is calculated <em>before</em> the IRA deduction itself.
        </p>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-gray-600">Your estimated MAGI</span>
          <span className="font-semibold text-gray-900 tabular-nums">{formatCurrency(magi)}</span>
        </div>
      </div>

      <div className="border-t border-gray-200" />

      {/* Roth IRA reference */}
      <div>
        <p className="font-semibold text-gray-700 mb-1">
          Roth IRA — {FILING_STATUS_LABELS[filingStatus]}
        </p>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Contribution limit</span>
            <span className="tabular-nums text-gray-700">{formatCurrency(iraContributionLimit)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Phase-out range</span>
            <span className="tabular-nums text-gray-700">
              {formatCurrency(start)} – {formatCurrency(end)}
            </span>
          </div>
        </div>
        <div className={`mt-2 rounded px-2 py-1.5 border font-medium ${statusConfig[status].color}`}>
          {statusConfig[status].label}
        </div>
        <p className="mt-1.5 text-gray-400 leading-relaxed">
          Roth contributions are not tax-deductible and do not affect AGI, but qualified
          withdrawals in retirement are tax-free.
        </p>
      </div>
    </div>
  );
}
