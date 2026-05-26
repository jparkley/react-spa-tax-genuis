import { formatCurrency, formatPercent } from '../../lib/formatters';
import type { TaxResults } from '../../types/tax.types';

interface SummaryCardProps {
  results: TaxResults;
}

export function SummaryCard({ results }: SummaryCardProps) {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-md p-5 text-white">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <p className="text-blue-200 text-xs font-medium uppercase tracking-wide">After-Tax Income</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(results.afterTaxIncome)}</p>
        </div>
        <div>
          <p className="text-blue-200 text-xs font-medium uppercase tracking-wide">Monthly Take-Home</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(results.monthlyTakeHome)}</p>
        </div>
        <div>
          <p className="text-blue-200 text-xs font-medium uppercase tracking-wide">Combined Tax</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(results.combinedTax)}</p>
        </div>
        <div>
          <p className="text-blue-200 text-xs font-medium uppercase tracking-wide">Overall Eff. Rate</p>
          <p className="text-2xl font-bold mt-1">{formatPercent(results.overallEffectiveRate)}</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-blue-500 grid grid-cols-2 gap-4">
        <div>
          <p className="text-blue-200 text-xs">Gross Income</p>
          <p className="text-sm font-semibold">{formatCurrency(results.grossIncome)}</p>
        </div>
        <div>
          <p className="text-blue-200 text-xs">Total Federal Burden</p>
          <p className="text-sm font-semibold">{formatCurrency(results.totalFederalBurden)}</p>
        </div>
        <div>
          <p className="text-blue-200 text-xs">Total CA Burden</p>
          <p className="text-sm font-semibold">{formatCurrency(results.totalCaBurden)}</p>
        </div>
        <div>
          <p className="text-blue-200 text-xs">AGI</p>
          <p className="text-sm font-semibold">{formatCurrency(results.agi)}</p>
        </div>
      </div>
    </div>
  );
}
