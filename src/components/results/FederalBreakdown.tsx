import { SectionCard } from '../ui/SectionCard';
import { ResultRow } from '../ui/ResultRow';
import { Tooltip } from '../ui/Tooltip';
import { TaxLineWithBrackets } from '../ui/TaxLineWithBrackets';
import type { TaxResults } from '../../types/tax.types';

interface FederalBreakdownProps {
  results: TaxResults;
}

export function FederalBreakdown({ results }: FederalBreakdownProps) {
  const showLtcg = results.ltcgTax > 0;
  const showCtc  = results.childTaxCredit > 0;
  const showSe   = results.selfEmploymentTax > 0;

  return (
    <SectionCard title="Federal Tax Breakdown">
      <ResultRow label="Adjusted Gross Income (AGI)" value={results.agi} highlight />
      {results.deductibleIraAmount > 0 && (
        <ResultRow label="IRA Deduction Applied" value={results.deductibleIraAmount} sub />
      )}
      <ResultRow label="Federal Taxable Income" value={results.federalTaxableIncome} />

      <div className="border-t border-gray-100 my-1" />

      <ResultRow label="Ordinary Income Tax" value={results.ordinaryIncomeTax} />
      {showLtcg && (
        <ResultRow label="LTCG Tax" value={results.ltcgTax} sub />
      )}
      {showCtc && (
        <div className="flex items-center justify-between py-1">
          <span className="text-sm text-green-700 flex items-center">
            Child Tax Credit
            <Tooltip text="Non-refundable CTC reduces your federal income tax. Phase-out begins at $200K (single) / $400K (MFJ). CTC cannot reduce tax below $0 (v1.0 — refundable portion not included)." />
          </span>
          <span className="text-sm text-green-700 tabular-nums font-medium">
            −${results.childTaxCredit.toLocaleString()}
          </span>
        </div>
      )}
      <TaxLineWithBrackets
        label="Federal Income Tax (after credits)"
        value={results.federalIncomeTaxAfterCredits}
        highlight
        bracketDetails={results.federalOrdinaryBracketDetails}
        extras={[
          ...(results.ltcgTax > 0
            ? [{ label: '+ LTCG tax', value: results.ltcgTax }]
            : []),
          ...(results.childTaxCredit > 0
            ? [{ label: '− Child Tax Credit', value: results.childTaxCredit, prefix: '−' }]
            : []),
          { label: '= After credits', value: results.federalIncomeTaxAfterCredits, bold: true },
        ]}
      />

      <div className="border-t border-gray-100 my-1" />

      <div className="flex items-center justify-between py-1">
        <span className="text-sm text-gray-600 flex items-center">
          Social Security Tax
          <Tooltip text="6.2% on W-2 wages up to the annual Social Security wage base. Not applied to SE income (SE tax covers both halves)." />
        </span>
        <span className="text-sm text-gray-800 tabular-nums">
          ${results.socialSecurityTax.toLocaleString()}
        </span>
      </div>

      <div className="flex items-center justify-between py-1">
        <span className="text-sm text-gray-600 flex items-center">
          Medicare Tax
          <Tooltip text="1.45% standard Medicare tax on all earned income, plus 0.9% Additional Medicare Tax on earned income above $200K (single) / $250K (MFJ)." />
        </span>
        <span className="text-sm text-gray-800 tabular-nums">
          ${results.medicareTax.toLocaleString()}
        </span>
      </div>

      {showSe && (
        <div className="flex items-center justify-between py-1">
          <span className="text-sm text-gray-600 flex items-center">
            Self-Employment Tax
            <Tooltip text="15.3% on 92.35% of net SE income (covers both the employee and employer halves of SS + Medicare). Half of SE tax is deducted above-the-line from AGI." />
          </span>
          <span className="text-sm text-gray-800 tabular-nums">
            ${results.selfEmploymentTax.toLocaleString()}
          </span>
        </div>
      )}

      <div className="border-t border-gray-100 my-1" />

      <div className="flex items-center justify-between py-1">
        <span className="text-sm text-gray-700 flex items-center font-medium">
          Federal Effective Rate
          <Tooltip text="Federal income tax (after credits) ÷ gross income. Measures how much of your gross income goes to federal income tax only (not FICA)." />
        </span>
        <span className="text-sm text-gray-900 tabular-nums font-medium">
          {(results.federalEffectiveRate * 100).toFixed(2)}%
        </span>
      </div>

      <div className="flex items-center justify-between py-1">
        <span className="text-sm text-gray-700 flex items-center font-medium">
          Federal Marginal Rate
          <Tooltip text="The tax rate applied to your last dollar of ordinary taxable income. This is the rate that applies to any additional income you might earn." />
        </span>
        <span className="text-sm text-gray-900 tabular-nums font-medium">
          {(results.federalMarginalRate * 100).toFixed(0)}%
        </span>
      </div>
    </SectionCard>
  );
}
