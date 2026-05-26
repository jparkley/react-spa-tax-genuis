import { SummaryCard } from './SummaryCard';
import { ProjectedYearBanner } from './ProjectedYearBanner';
import { FederalBreakdown } from './FederalBreakdown';
import { CaliforniaBreakdown } from './CaliforniaBreakdown';
import { TaxBreakdownChart } from './TaxBreakdownChart';
import type { TaxResults } from '../../types/tax.types';

interface ResultsPanelProps {
  results: TaxResults;
  taxYear: number;
}

export function ResultsPanel({ results, taxYear }: ResultsPanelProps) {
  return (
    <>
      <SummaryCard results={results} />
      {results.isProjectedYear && <ProjectedYearBanner year={taxYear} />}
      <FederalBreakdown results={results} />
      <CaliforniaBreakdown results={results} />
      <TaxBreakdownChart results={results} />
    </>
  );
}
