export interface BracketDetail {
  rate: number;
  incomeInBracket: number;
  taxInBracket: number;
}

// Dynamic year — not a fixed union
export type TaxYear = number;

export type FilingStatus = 'single' | 'mfj' | 'mfs' | 'hoh' | 'qss';

export interface TaxBracket {
  rate: number;
  min: number;
  max: number | null;
}

export interface LtcgBracket {
  /** 0, 0.15, or 0.20 */
  rate: number;
  /** Upper bound of total taxable income for this rate; null = no limit */
  maxIncome: number | null;
}

export interface ChildTaxCreditConfig {
  amountPerChild: number;
  phaseOutThreshold: Record<FilingStatus, number>;
  /** Reduction per $1,000 over threshold (always $50) */
  phaseOutRate: number;
}

export interface IraConfig {
  /** Standard limit (age < 50), e.g. 7000 */
  contributionLimit: number;
  /** Catch-up limit for age 50+, e.g. 8000 */
  catchUpContributionLimit: number;
  deductibilityPhaseOut: {
    /** Phase-out range when covered by workplace plan */
    withWorkplacePlan: Record<FilingStatus, { start: number; end: number }>;
    /** Phase-out when taxpayer has no plan but spouse does (MFJ only) */
    spouseHasWorkplacePlan: Partial<Record<FilingStatus, { start: number; end: number }>>;
  };
}

export interface YearTaxData {
  year: TaxYear;
  /** true if not yet officially published — use projected data banner */
  isProjected: boolean;
  federal: {
    brackets: Record<FilingStatus, TaxBracket[]>;
    standardDeduction: Record<FilingStatus, number>;
    /** Per-qualifying-condition additional std deduction, split by filing category */
    additionalStdDeduction: {
      singleOrHoh: { age65: number; blind: number };
      marriedOrQss: { age65: number; blind: number };
    };
    ssWageBase: number;
    additionalMedicareThreshold: Record<FilingStatus, number>;
    ltcgBrackets: Record<FilingStatus, LtcgBracket[]>;
    childTaxCredit: ChildTaxCreditConfig;
    ira: IraConfig;
  };
  california: {
    brackets: Record<FilingStatus, TaxBracket[]>;
    standardDeduction: Record<FilingStatus, number>;
    sdiRate: number;
    mentalHealthSurchargeThreshold: number;
    mentalHealthSurchargeRate: number;
  };
}

export type TaxDataMap = Record<TaxYear, YearTaxData>;

export interface TaxInputs {
  taxYear: TaxYear;
  filingStatus: FilingStatus;
  dependents: number;
  age65Plus: boolean;
  /** Age 50+ enables IRA catch-up contribution limit (FR-06) */
  age50Plus: boolean;
  blind: boolean;
  wages: number;
  isSelfEmployed: boolean;
  selfEmploymentIncome: number;
  interestAndDividends: number;
  iraDistributions: number;
  tiaaWithdrawals: number;
  shortTermCapitalGains: number;
  longTermCapitalGains: number;
  preTaxDeductions: number;
  traditionalIraContribution: number;
  hasWorkplaceRetirementPlan: boolean;
  useItemizedDeductions: boolean;
  itemizedDeductionTotal: number;
}

export interface TaxResults {
  grossIncome: number;
  /** Effective IRA contribution limit (standard or catch-up) */
  iraContributionLimit: number;
  /** Actual deductible IRA amount after phase-out */
  deductibleIraAmount: number;
  agi: number;
  federalTaxableIncome: number;
  ordinaryIncomeTax: number;
  ltcgTax: number;
  federalIncomeTaxBeforeCredits: number;
  childTaxCredit: number;
  federalIncomeTaxAfterCredits: number;
  federalEffectiveRate: number;
  federalMarginalRate: number;
  socialSecurityTax: number;
  medicareTax: number;
  selfEmploymentTax: number;
  caTaxableIncome: number;
  caIncomeTax: number;
  caMentalHealthTax: number;
  caSdiTax: number;
  caEffectiveRate: number;
  caMarginalRate: number;
  totalFederalBurden: number;
  totalCaBurden: number;
  combinedTax: number;
  overallEffectiveRate: number;
  afterTaxIncome: number;
  monthlyTakeHome: number;
  /** Per-bracket breakdown for the federal ordinary income tax */
  federalOrdinaryBracketDetails: BracketDetail[];
  /** Per-bracket breakdown for the CA income tax */
  caBracketDetails: BracketDetail[];
  /** Surfaces the projection flag from YearTaxData to the UI */
  isProjectedYear: boolean;
}
