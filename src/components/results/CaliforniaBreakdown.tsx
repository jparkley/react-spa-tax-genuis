import { SectionCard } from '../ui/SectionCard';
import { ResultRow } from '../ui/ResultRow';
import { Tooltip } from '../ui/Tooltip';
import type { TaxResults } from '../../types/tax.types';

interface CaliforniaBreakdownProps {
  results: TaxResults;
}

export function CaliforniaBreakdown({ results }: CaliforniaBreakdownProps) {
  const showMH = results.caMentalHealthTax > 0;

  return (
    <SectionCard title="California State Tax Breakdown">
      <ResultRow label="CA Taxable Income" value={results.caTaxableIncome} highlight />

      <div className="border-t border-gray-100 my-1" />

      <ResultRow label="CA Income Tax" value={results.caIncomeTax} />

      {showMH && (
        <div className="flex items-center justify-between py-1">
          <span className="text-sm text-gray-600 flex items-center">
            CA Mental Health Services Tax
            <Tooltip text="California levies an additional 1% tax on CA taxable income exceeding $1,000,000. This raises the top effective CA rate to 13.3% (12.3% + 1%)." />
          </span>
          <span className="text-sm text-gray-800 tabular-nums">
            ${results.caMentalHealthTax.toLocaleString()}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between py-1">
        <span className="text-sm text-gray-600 flex items-center">
          CA SDI
          <Tooltip text="California State Disability Insurance. Applied at the published rate for the selected year on W-2 wages only — not on SE income, capital gains, or other income. There is no wage cap as of 2024." />
        </span>
        <span className="text-sm text-gray-800 tabular-nums">
          ${results.caSdiTax.toLocaleString()}
        </span>
      </div>

      <div className="border-t border-gray-100 my-1" />

      <div className="flex items-center justify-between py-1">
        <span className="text-sm text-gray-700 font-medium flex items-center">
          CA Effective Rate
          <Tooltip text="CA income tax ÷ gross income. Reflects the portion of gross income going to CA income tax (excludes SDI)." />
        </span>
        <span className="text-sm text-gray-900 tabular-nums font-medium">
          {(results.caEffectiveRate * 100).toFixed(2)}%
        </span>
      </div>

      <div className="flex items-center justify-between py-1">
        <span className="text-sm text-gray-700 font-medium flex items-center">
          CA Marginal Rate
          <Tooltip text="The top California bracket rate applied to your income — the rate on your last dollar of CA taxable income." />
        </span>
        <span className="text-sm text-gray-900 tabular-nums font-medium">
          {(results.caMarginalRate * 100).toFixed(1)}%
        </span>
      </div>
    </SectionCard>
  );
}
