import { FilingInfoSection } from './FilingInfoSection';
import { IncomeSection } from './IncomeSection';
import { DeductionsSection } from './DeductionsSection';
import { ResetButton } from './ResetButton';
import type { TaxInputs, TaxResults } from '../../types/tax.types';
import { getTaxDataForYear } from '../../data/taxData';

interface InputPanelProps {
  inputs: TaxInputs;
  results: TaxResults;
  setField: <K extends keyof TaxInputs>(field: K, value: TaxInputs[K]) => void;
  onReset: () => void;
}

export function InputPanel({ inputs, results, setField, onReset }: InputPanelProps) {
  const yearData = getTaxDataForYear(inputs.taxYear);

  // Compute displayed federal std deduction (including additional for age/blind)
  const isMarriedOrQss = ['mfj', 'mfs', 'qss'].includes(inputs.filingStatus);
  const addlAmounts = isMarriedOrQss
    ? yearData.federal.additionalStdDeduction.marriedOrQss
    : yearData.federal.additionalStdDeduction.singleOrHoh;
  const additionalStd =
    (inputs.age65Plus ? addlAmounts.age65 : 0) + (inputs.blind ? addlAmounts.blind : 0);
  const federalStdDeduction =
    yearData.federal.standardDeduction[inputs.filingStatus] + additionalStd;
  const caStdDeduction = yearData.california.standardDeduction[inputs.filingStatus];

  return (
    <>
      <FilingInfoSection inputs={inputs} setField={setField} />
      <IncomeSection
        inputs={inputs}
        setField={setField}
        iraContributionLimit={results.iraContributionLimit}
        magi={results.magi}
        filingStatus={inputs.filingStatus}
        rothPhaseOut={yearData.federal.rothIra.contributionPhaseOut[inputs.filingStatus]}
        k401Limit={yearData.federal.k401EmployeeLimit}
      />
      <DeductionsSection
        inputs={inputs}
        setField={setField}
        federalStdDeduction={federalStdDeduction}
        caStdDeduction={caStdDeduction}
      />
      <ResetButton onReset={onReset} />
    </>
  );
}
