import { useState } from 'react';
import { formatCurrency, formatPercent } from '../../lib/formatters';
import type { TaxResults } from '../../types/tax.types';

interface SummaryCardProps {
  results: TaxResults;
}

export function SummaryCard({ results }: SummaryCardProps) {
  const [showFedBreakdown, setShowFedBreakdown] = useState(false);
  const hasFedDetail = results.totalFederalBurden > 0;

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-md p-5 text-white">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-blue-200 text-sm font-medium uppercase tracking-wide">After-Tax Income</p>
          <p className="text-base font-bold mt-1">{formatCurrency(results.afterTaxIncome)}</p>
        </div>
        <div>
          <p className="text-blue-200 text-sm font-medium uppercase tracking-wide">Combined Tax</p>
          <p className="text-base font-bold mt-1">{formatCurrency(results.combinedTax)}</p>
        </div>
        <div>
          <p className="text-blue-200 text-sm font-medium uppercase tracking-wide">Overall Eff. Rate</p>
          <p className="text-base font-bold mt-1">{formatPercent(results.overallEffectiveRate)}</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-blue-500 grid grid-cols-2 gap-4">
        <div>
          <p className="text-blue-200 text-sm">Gross Income</p>
          <p className="text-base font-semibold">{formatCurrency(results.grossIncome)}</p>
        </div>
        <div
          onMouseEnter={() => hasFedDetail && setShowFedBreakdown(true)}
          onMouseLeave={() => setShowFedBreakdown(false)}
        >
          <p className="text-blue-200 text-sm">Total Federal Burden</p>
          <p className={`text-base font-semibold ${hasFedDetail ? 'cursor-help border-b border-dashed border-blue-300 w-fit' : ''}`}>
            {formatCurrency(results.totalFederalBurden)}
          </p>
          {showFedBreakdown && (
            <div className="mt-2 rounded-lg bg-white/15 p-2 text-xs space-y-1">
              <div className="flex justify-between gap-4">
                <span className="text-blue-100">Federal Income Tax</span>
                <span className="tabular-nums">{formatCurrency(results.federalIncomeTaxAfterCredits)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-blue-100">Social Security</span>
                <span className="tabular-nums">{formatCurrency(results.socialSecurityTax)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-blue-100">Medicare</span>
                <span className="tabular-nums">{formatCurrency(results.medicareTax)}</span>
              </div>
              {results.selfEmploymentTax > 0 && (
                <div className="flex justify-between gap-4">
                  <span className="text-blue-100">SE Tax</span>
                  <span className="tabular-nums">{formatCurrency(results.selfEmploymentTax)}</span>
                </div>
              )}
              <div className="flex justify-between gap-4 border-t border-blue-300/50 pt-1 font-semibold">
                <span>Total</span>
                <span className="tabular-nums">{formatCurrency(results.totalFederalBurden)}</span>
              </div>
            </div>
          )}
        </div>
        <div>
          <p className="text-blue-200 text-sm">Total CA Burden</p>
          <p className="text-base font-semibold">{formatCurrency(results.totalCaBurden)}</p>
        </div>
        <div>
          <p className="text-blue-200 text-sm">AGI</p>
          <p className="text-base font-semibold">{formatCurrency(results.agi)}</p>
        </div>
      </div>
    </div>
  );
}
