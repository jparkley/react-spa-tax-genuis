import { useId } from 'react';
import { SectionCard } from '../ui/SectionCard';
import { Toggle } from '../ui/Toggle';
import { getAvailableYears } from '../../lib/yearUtils';
import type { TaxInputs, FilingStatus } from '../../types/tax.types';

const FILING_STATUSES: { value: FilingStatus; label: string }[] = [
  { value: 'single', label: 'Single' },
  { value: 'mfj',    label: 'Married Filing Jointly' },
  { value: 'mfs',    label: 'Married Filing Separately' },
  { value: 'hoh',    label: 'Head of Household' },
  { value: 'qss',    label: 'Qualifying Surviving Spouse' },
];

interface FilingInfoSectionProps {
  inputs: Pick<TaxInputs, 'taxYear' | 'filingStatus' | 'dependents' | 'age65Plus' | 'age50Plus' | 'blind'>;
  setField: <K extends keyof TaxInputs>(field: K, value: TaxInputs[K]) => void;
}

export function FilingInfoSection({ inputs, setField }: FilingInfoSectionProps) {
  const yearSelectId = useId();
  const statusSelectId = useId();
  const dependentsId = useId();
  const availableYears = getAvailableYears();

  return (
    <SectionCard title="Filing Information">
      {/* Tax Year */}
      <div className="flex flex-col gap-1">
        <label htmlFor={yearSelectId} className="text-sm text-gray-700">
          Tax Year
        </label>
        <select
          id={yearSelectId}
          value={inputs.taxYear}
          onChange={(e) => setField('taxYear', Number(e.target.value))}
          className="block w-full rounded-md border border-gray-300 py-1.5 px-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {availableYears.map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>
      </div>

      {/* Filing Status */}
      <div className="flex flex-col gap-1">
        <label htmlFor={statusSelectId} className="text-sm text-gray-700">
          Filing Status
        </label>
        <select
          id={statusSelectId}
          value={inputs.filingStatus}
          onChange={(e) => setField('filingStatus', e.target.value as FilingStatus)}
          className="block w-full rounded-md border border-gray-300 py-1.5 px-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {FILING_STATUSES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Dependents */}
      <div className="flex flex-col gap-1">
        <label htmlFor={dependentsId} className="text-sm text-gray-700">
          Number of Qualifying Dependents (for CTC)
        </label>
        <input
          id={dependentsId}
          type="number"
          min={0}
          step={1}
          value={inputs.dependents}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            setField('dependents', isNaN(v) ? 0 : Math.max(0, v));
          }}
          className="block w-full rounded-md border border-gray-300 py-1.5 px-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Age / disability toggles */}
      <div className="space-y-2 pt-1">
        <Toggle
          label="Age 65 or Older"
          checked={inputs.age65Plus}
          onChange={(v) => {
            setField('age65Plus', v);
            // Being 65+ implies 50+ for IRA catch-up purposes
            if (v) setField('age50Plus', true);
          }}
          helpText="Adds an additional standard deduction per qualifying condition."
        />
        <Toggle
          label="Age 50 or Older (IRA catch-up)"
          checked={inputs.age50Plus}
          onChange={(v) => setField('age50Plus', v)}
          helpText="Enables the higher IRA catch-up contribution limit."
          disabled={inputs.age65Plus}
        />
        <Toggle
          label="Blind Taxpayer"
          checked={inputs.blind}
          onChange={(v) => setField('blind', v)}
          helpText="Adds an additional standard deduction per qualifying condition."
        />
      </div>
    </SectionCard>
  );
}
