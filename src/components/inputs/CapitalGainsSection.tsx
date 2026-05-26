import { CollapsibleSection } from '../ui/CollapsibleSection';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Tooltip } from '../ui/Tooltip';
import type { TaxInputs } from '../../types/tax.types';

interface CapitalGainsSectionProps {
  inputs: Pick<TaxInputs, 'longTermCapitalGains' | 'shortTermCapitalGains'>;
  setField: <K extends keyof TaxInputs>(field: K, value: TaxInputs[K]) => void;
}

export function CapitalGainsSection({ inputs, setField }: CapitalGainsSectionProps) {
  return (
    <CollapsibleSection title="Capital Gains" defaultOpen={false}>
      <div className="space-y-3">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">
            Long-term gains are taxed at preferential 0%/15%/20% rates and stacked on top of ordinary income.
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex-1">
            <CurrencyInput
              label="Long-Term Capital Gains"
              value={inputs.longTermCapitalGains}
              onChange={(v) => setField('longTermCapitalGains', v)}
            />
          </div>
          <div className="mt-5">
            <Tooltip text="Long-term gains (assets held > 1 year) are taxed at preferential rates (0%, 15%, or 20%) based on your total taxable income. They are stacked on top of ordinary income to determine the applicable rate." />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex-1">
            <CurrencyInput
              label="Short-Term Capital Gains"
              value={inputs.shortTermCapitalGains}
              onChange={(v) => setField('shortTermCapitalGains', v)}
            />
          </div>
          <div className="mt-5">
            <Tooltip text="Short-term gains (assets held ≤ 1 year) are taxed as ordinary income at your regular bracket rates." />
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
}
