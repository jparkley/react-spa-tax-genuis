import { SectionCard } from '../ui/SectionCard';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Toggle } from '../ui/Toggle';
import { Tooltip } from '../ui/Tooltip';
import { CapitalGainsSection } from './CapitalGainsSection';
import { formatCurrency } from '../../lib/formatters';
import type { TaxInputs } from '../../types/tax.types';

interface IncomeSectionProps {
  inputs: Pick<
    TaxInputs,
    | 'wages'
    | 'isSelfEmployed'
    | 'selfEmploymentIncome'
    | 'interestAndDividends'
    | 'iraDistributions'
    | 'tiaaWithdrawals'
    | 'preTaxDeductions'
    | 'traditionalIraContribution'
    | 'hasWorkplaceRetirementPlan'
    | 'longTermCapitalGains'
    | 'shortTermCapitalGains'
    | 'age50Plus'
  >;
  setField: <K extends keyof TaxInputs>(field: K, value: TaxInputs[K]) => void;
  iraContributionLimit: number;
}

export function IncomeSection({ inputs, setField, iraContributionLimit }: IncomeSectionProps) {
  return (
    <SectionCard title="Income">
      <CurrencyInput
        label="W-2 Wages / Salary"
        value={inputs.wages}
        onChange={(v) => setField('wages', v)}
        helpText="From W-2 Box 1 — gross pay minus pre-tax deductions (401k, HSA, FSA, etc.). Note: in 2025, it was $122,800."
      />

      <Toggle
        label="Self-Employment Income"
        checked={inputs.isSelfEmployed}
        onChange={(v) => setField('isSelfEmployed', v)}
        helpText="Enables SE tax (15.3% on 92.35% of net SE income) and ½ SE deduction from AGI."
      />
      {inputs.isSelfEmployed && (
        <div className="pl-3 space-y-2">
          <div className="flex items-center gap-1">
            <div className="flex-1">
              <CurrencyInput
                label="Net Self-Employment Income"
                value={inputs.selfEmploymentIncome}
                onChange={(v) => setField('selfEmploymentIncome', v)}
              />
            </div>
            <div className="mt-5">
              <Tooltip text="Net self-employment income = gross SE revenue minus business expenses. SE tax is computed as 92.35% × net income × 15.3%. Half of SE tax is deductible above-the-line from AGI." />
            </div>
          </div>
        </div>
      )}

      <CurrencyInput
        label="Other Income 1 — Interest & Dividends"
        value={inputs.interestAndDividends}
        onChange={(v) => setField('interestAndDividends', v)}
        helpText="Ordinary interest and dividends (1099-INT / 1099-DIV) — taxed at regular bracket rates."
      />

      <CurrencyInput
        label="Other Income 2 — IRA Distributions"
        value={inputs.iraDistributions}
        onChange={(v) => setField('iraDistributions', v)}
        helpText="Taxable IRA withdrawals (1099-R) — treated as ordinary income."
      />

      <CurrencyInput
        label="Other Income 3 — TIAA Withdrawals"
        value={inputs.tiaaWithdrawals}
        onChange={(v) => setField('tiaaWithdrawals', v)}
        helpText="TIAA retirement account distributions (1099-R) — treated as ordinary income."
      />

      <div className="flex items-center gap-1">
        <div className="flex-1">
          <CurrencyInput
            label="Pre-Tax Deductions (401k / HSA / FSA)"
            value={inputs.preTaxDeductions}
            onChange={(v) => setField('preTaxDeductions', v)}
          />
        </div>
        <div className="mt-5">
          <Tooltip text="Employer-sponsored pre-tax contributions (e.g., 401(k), 403(b), HSA, FSA) reduce your gross income before AGI is calculated. Does not include Traditional IRA (entered below)." />
        </div>
      </div>

      {/* Capital Gains — collapsed by default (FR-65) */}
      <CapitalGainsSection inputs={inputs} setField={setField} />

      {/* IRA Contribution */}
      <div className="flex items-center gap-1">
        <div className="flex-1">
          <CurrencyInput
            label="Traditional IRA Contribution"
            value={inputs.traditionalIraContribution}
            onChange={(v) => setField('traditionalIraContribution', v)}
            max={iraContributionLimit}
            helpText={`Limit: ${formatCurrency(iraContributionLimit)}${inputs.age50Plus ? ' (catch-up, age 50+)' : ''}. MFJ with one spouse in a 401(k): fully deductible if MAGI ≤ $242,000 (2026).`}
          />
        </div>
        <div className="mt-5">
          <Tooltip text="Traditional IRA contributions may be fully or partially deductible depending on your income and whether you (or your spouse for MFJ) are covered by a workplace retirement plan. The deductible portion reduces your AGI." />
        </div>
      </div>

      <Toggle
        label="Wife has 401(k) through work (husband does not)"
        checked={inputs.hasWorkplaceRetirementPlan}
        onChange={(v) => setField('hasWorkplaceRetirementPlan', v)}
        helpText="Since only one spouse has a workplace plan, husband's IRA is fully deductible if MAGI ≤ $242,000 (2026)."
      />
    </SectionCard>
  );
}
