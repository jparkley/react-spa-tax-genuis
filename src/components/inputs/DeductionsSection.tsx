import { useState, useEffect } from 'react';
import { SectionCard } from '../ui/SectionCard';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Tooltip } from '../ui/Tooltip';
import { formatCurrency } from '../../lib/formatters';
import type { TaxInputs } from '../../types/tax.types';

interface DeductionsSectionProps {
  inputs: Pick<TaxInputs, 'useItemizedDeductions' | 'itemizedDeductionTotal'>;
  setField: <K extends keyof TaxInputs>(field: K, value: TaxInputs[K]) => void;
  federalStdDeduction: number;
  caStdDeduction: number;
}

export function DeductionsSection({
  inputs,
  setField,
  federalStdDeduction,
  caStdDeduction,
}: DeductionsSectionProps) {
  // Line-item state lives locally; only the sum is dispatched (FR-22)
  const [mortgage, setMortgage] = useState(0);
  const [salt, setSalt] = useState(0);
  const [charitable, setCharitable] = useState(0);
  const [medical, setMedical] = useState(0);

  const SALT_CAP = 10000;
  const cappedSalt = Math.min(salt, SALT_CAP);

  useEffect(() => {
    const total = mortgage + cappedSalt + charitable + medical;
    setField('itemizedDeductionTotal', total);
  }, [mortgage, cappedSalt, charitable, medical]);

  const isItemized = inputs.useItemizedDeductions;

  return (
    <SectionCard title="Deductions">
      {/* Standard / Itemized toggle */}
      <div className="flex rounded-md border border-gray-300 overflow-hidden">
        <button
          type="button"
          onClick={() => setField('useItemizedDeductions', false)}
          className={`flex-1 py-1.5 text-sm font-medium transition-colors ${
            !isItemized
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Standard
        </button>
        <button
          type="button"
          onClick={() => setField('useItemizedDeductions', true)}
          className={`flex-1 py-1.5 text-sm font-medium transition-colors ${
            isItemized
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Itemized
        </button>
      </div>

      {!isItemized && (
        <div className="rounded-md bg-blue-50 border border-blue-100 px-3 py-2 space-y-1">
          <p className="text-xs text-blue-700">
            Federal standard deduction:{' '}
            <span className="font-semibold">{formatCurrency(federalStdDeduction)}</span>
          </p>
          <p className="text-xs text-blue-600">
            CA standard deduction:{' '}
            <span className="font-semibold">{formatCurrency(caStdDeduction)}</span>
          </p>
        </div>
      )}

      {isItemized && (
        <div className="space-y-3">
          <p className="text-xs text-gray-500">
            Itemized deductions apply to both federal and California returns.
          </p>
          <CurrencyInput
            label="Mortgage Interest"
            value={mortgage}
            onChange={setMortgage}
          />
          <div className="flex items-center gap-1">
            <div className="flex-1">
              <CurrencyInput
                label="State & Local Taxes (SALT)"
                value={salt}
                onChange={setSalt}
                helpText={`Capped at ${formatCurrency(SALT_CAP)} for federal. You entered ${formatCurrency(salt)}${salt > SALT_CAP ? ` — capped to ${formatCurrency(SALT_CAP)}` : ''}.`}
              />
            </div>
            <div className="mt-5">
              <Tooltip text="The federal SALT deduction is capped at $10,000 per year ($5,000 if MFS). This cap was established by the Tax Cuts and Jobs Act of 2017." />
            </div>
          </div>
          <CurrencyInput
            label="Charitable Contributions"
            value={charitable}
            onChange={setCharitable}
          />
          <CurrencyInput
            label="Medical Expenses"
            value={medical}
            onChange={setMedical}
            helpText="Only the amount exceeding 7.5% of your AGI is deductible (pre-applied manually here)."
          />
          <div className="rounded-md bg-gray-50 border border-gray-200 px-3 py-2">
            <p className="text-sm font-medium text-gray-700">
              Total itemized:{' '}
              <span className="text-blue-700 font-semibold">
                {formatCurrency(inputs.itemizedDeductionTotal)}
              </span>
            </p>
            {inputs.itemizedDeductionTotal < federalStdDeduction && (
              <p className="text-xs text-amber-600 mt-0.5">
                Standard deduction ({formatCurrency(federalStdDeduction)}) is larger — consider using standard.
              </p>
            )}
          </div>
        </div>
      )}
    </SectionCard>
  );
}
