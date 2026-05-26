import type {
  TaxInputs,
  TaxResults,
  YearTaxData,
  TaxBracket,
  LtcgBracket,
  FilingStatus,
  ChildTaxCreditConfig,
} from '../types/tax.types';

// ---------------------------------------------------------------------------
// Helper: progressive bracket tax
// ---------------------------------------------------------------------------

function applyBrackets(income: number, brackets: TaxBracket[]): number {
  if (income <= 0) return 0;
  let tax = 0;
  for (const bracket of brackets) {
    if (income <= bracket.min) break;
    const top = bracket.max ?? Infinity;
    tax += (Math.min(income, top) - bracket.min) * bracket.rate;
  }
  return tax;
}

// ---------------------------------------------------------------------------
// Helper: marginal rate — the bracket rate that applies to the last dollar
// ---------------------------------------------------------------------------

function getMarginalRate(income: number, brackets: TaxBracket[]): number {
  if (income <= 0) return brackets[0]?.rate ?? 0;
  let marginal = brackets[0]?.rate ?? 0;
  for (const bracket of brackets) {
    if (income > bracket.min) marginal = bracket.rate;
  }
  return marginal;
}

// ---------------------------------------------------------------------------
// Helper: LTCG stacking rule
// LTCG brackets test against *total* taxable income (ordinary + LTCG).
// ordinaryStack = the ordinary taxable income that sits below the LTCG.
// ---------------------------------------------------------------------------

function applyLtcgBrackets(
  ltcgAmount: number,
  ordinaryStack: number,
  brackets: LtcgBracket[],
): number {
  if (ltcgAmount <= 0) return 0;
  let tax = 0;
  let remaining = ltcgAmount;
  let currentBottom = ordinaryStack;

  for (const bracket of brackets) {
    if (remaining <= 0) break;
    const bracketTop = bracket.maxIncome ?? Infinity;
    if (currentBottom >= bracketTop) continue;

    const room = bracketTop - currentBottom;
    const inBracket = Math.min(remaining, room);
    tax += inBracket * bracket.rate;
    remaining -= inBracket;
    currentBottom += inBracket;
  }
  return tax;
}

// ---------------------------------------------------------------------------
// Helper: additional standard deduction (age 65+ / blind)
// ---------------------------------------------------------------------------

function computeAdditionalStdDeduction(
  filingStatus: FilingStatus,
  age65Plus: boolean,
  blind: boolean,
  yearData: YearTaxData,
): number {
  const isMarriedOrQss = ['mfj', 'mfs', 'qss'].includes(filingStatus);
  const amounts = isMarriedOrQss
    ? yearData.federal.additionalStdDeduction.marriedOrQss
    : yearData.federal.additionalStdDeduction.singleOrHoh;

  return (age65Plus ? amounts.age65 : 0) + (blind ? amounts.blind : 0);
}

// ---------------------------------------------------------------------------
// Helper: deductible IRA amount (with phase-out)
// ---------------------------------------------------------------------------

function computeIraDeductible(
  contribution: number,
  magi: number,
  age50Plus: boolean,
  filingStatus: FilingStatus,
  hasWorkplacePlan: boolean,
  yearData: YearTaxData,
): number {
  const ira = yearData.federal.ira;
  const limit = age50Plus ? ira.catchUpContributionLimit : ira.contributionLimit;
  const capped = Math.min(contribution, limit);

  if (!hasWorkplacePlan) return capped;

  const phaseOut = ira.deductibilityPhaseOut.withWorkplacePlan[filingStatus];
  if (magi <= phaseOut.start) return capped;
  if (magi >= phaseOut.end) return 0;

  const range = phaseOut.end - phaseOut.start;
  const excess = magi - phaseOut.start;
  const deductible = Math.round(capped * (1 - excess / range));
  return Math.max(0, deductible);
}

// ---------------------------------------------------------------------------
// Helper: Child Tax Credit with IRS Form 8812 ceiling-division phase-out
// ---------------------------------------------------------------------------

function computeCTC(
  agi: number,
  dependents: number,
  config: ChildTaxCreditConfig,
  filingStatus: FilingStatus,
): number {
  if (dependents <= 0) return 0;
  const baseCredit = dependents * config.amountPerChild;
  const threshold = config.phaseOutThreshold[filingStatus];
  const excess = Math.max(0, agi - threshold);
  // Ceiling division: ceil(excess / 1000) * $50
  const reduction = Math.ceil(excess / 1000) * config.phaseOutRate;
  return Math.max(0, baseCredit - reduction);
}

// ---------------------------------------------------------------------------
// Main calculation function — pure, no side effects
// ---------------------------------------------------------------------------

export function calculateTaxes(inputs: TaxInputs, yearData: YearTaxData): TaxResults {
  const {
    filingStatus,
    dependents,
    age65Plus,
    age50Plus,
    blind,
    wages,
    isSelfEmployed,
    selfEmploymentIncome,
    otherIncome,
    shortTermCapitalGains,
    longTermCapitalGains,
    preTaxDeductions,
    traditionalIraContribution,
    hasWorkplaceRetirementPlan,
    useItemizedDeductions,
    itemizedDeductionTotal,
  } = inputs;

  const seIncome = isSelfEmployed ? Math.max(0, selfEmploymentIncome) : 0;

  // -------------------------------------------------------------------
  // Pre-computation: SE tax (does not depend on AGI)
  // -------------------------------------------------------------------
  const selfEmploymentTax = seIncome > 0
    ? Math.round(seIncome * 0.9235 * 0.153)
    : 0;

  // -------------------------------------------------------------------
  // Step 1: Gross income
  // -------------------------------------------------------------------
  const grossIncome = Math.max(0, wages)
    + Math.max(0, shortTermCapitalGains)
    + Math.max(0, longTermCapitalGains)
    + Math.max(0, otherIncome)
    + seIncome;

  // -------------------------------------------------------------------
  // Step 2 & 3: pre-IRA AGI (subtract pre-tax deductions + ½ SE deduction)
  // -------------------------------------------------------------------
  const halfSe = seIncome > 0 ? Math.round(selfEmploymentTax / 2) : 0;
  const afterSeAgi = grossIncome
    - Math.max(0, preTaxDeductions)
    - halfSe;

  // -------------------------------------------------------------------
  // Step 4: IRA deductible amount
  // MAGI = afterSeAgi (before IRA deduction — IRS definition)
  // -------------------------------------------------------------------
  const iraContributionLimit = age50Plus
    ? yearData.federal.ira.catchUpContributionLimit
    : yearData.federal.ira.contributionLimit;

  const deductibleIraAmount = computeIraDeductible(
    Math.max(0, traditionalIraContribution),
    afterSeAgi,
    age50Plus,
    filingStatus,
    hasWorkplaceRetirementPlan,
    yearData,
  );

  // -------------------------------------------------------------------
  // Step 5: AGI
  // -------------------------------------------------------------------
  const agi = afterSeAgi - deductibleIraAmount;

  // -------------------------------------------------------------------
  // Step 6: Federal taxable income
  // -------------------------------------------------------------------
  const baseStdDeduction = yearData.federal.standardDeduction[filingStatus];
  const additionalStdDed = computeAdditionalStdDeduction(
    filingStatus, age65Plus, blind, yearData,
  );
  const totalStdDeduction = baseStdDeduction + additionalStdDed;

  const federalDeduction = useItemizedDeductions
    ? Math.max(0, itemizedDeductionTotal)
    : totalStdDeduction;

  const federalTaxableIncome = Math.max(0, agi - federalDeduction);

  // -------------------------------------------------------------------
  // Step 7: Split ordinary vs LTCG stack
  // -------------------------------------------------------------------
  const ltcgAmount = Math.min(Math.max(0, longTermCapitalGains), federalTaxableIncome);
  const ordinaryTaxableIncome = federalTaxableIncome - ltcgAmount;

  // -------------------------------------------------------------------
  // Step 8: Ordinary income tax (includes STCG — already in ordinary stack)
  // -------------------------------------------------------------------
  const ordinaryIncomeTax = Math.round(
    applyBrackets(ordinaryTaxableIncome, yearData.federal.brackets[filingStatus]),
  );

  // -------------------------------------------------------------------
  // Step 9: LTCG tax (stacked on top of ordinary income)
  // -------------------------------------------------------------------
  const ltcgTax = Math.round(
    applyLtcgBrackets(ltcgAmount, ordinaryTaxableIncome, yearData.federal.ltcgBrackets[filingStatus]),
  );

  // -------------------------------------------------------------------
  // Step 10: Child Tax Credit
  // Phase-out is based on AGI (from step 5)
  // -------------------------------------------------------------------
  const federalIncomeTaxBeforeCredits = ordinaryIncomeTax + ltcgTax;
  const ctcComputed = computeCTC(
    agi,
    dependents,
    yearData.federal.childTaxCredit,
    filingStatus,
  );
  const childTaxCredit = Math.min(ctcComputed, federalIncomeTaxBeforeCredits);
  const federalIncomeTaxAfterCredits = Math.max(0, federalIncomeTaxBeforeCredits - childTaxCredit);

  // -------------------------------------------------------------------
  // Step 11: Social Security tax
  // Applied to W-2 wages only, up to SS wage base
  // -------------------------------------------------------------------
  const socialSecurityTax = Math.round(
    Math.min(Math.max(0, wages), yearData.federal.ssWageBase) * 0.062,
  );

  // -------------------------------------------------------------------
  // Step 12: Medicare tax (standard + Additional Medicare)
  // Applied to wages + SE income
  // -------------------------------------------------------------------
  const earnedIncome = Math.max(0, wages) + seIncome;
  const standardMedicare = earnedIncome * 0.0145;
  const amtThreshold = yearData.federal.additionalMedicareThreshold[filingStatus];
  const additionalMedicare = Math.max(0, earnedIncome - amtThreshold) * 0.009;
  const medicareTax = Math.round(standardMedicare + additionalMedicare);

  // -------------------------------------------------------------------
  // Step 13: SE tax already computed in pre-computation (surfaced as line item)
  // -------------------------------------------------------------------

  // -------------------------------------------------------------------
  // Federal rates
  // -------------------------------------------------------------------
  const federalMarginalRate = getMarginalRate(
    ordinaryTaxableIncome,
    yearData.federal.brackets[filingStatus],
  );
  const federalEffectiveRate = grossIncome > 0
    ? federalIncomeTaxAfterCredits / grossIncome
    : 0;

  // -------------------------------------------------------------------
  // California — Step 1: start from Federal AGI
  // Step 2: CA taxable income
  // -------------------------------------------------------------------
  const caStdDeduction = yearData.california.standardDeduction[filingStatus];
  const caDeduction = useItemizedDeductions
    ? Math.max(0, itemizedDeductionTotal)
    : caStdDeduction;
  const caTaxableIncome = Math.max(0, agi - caDeduction);

  // Step 3: CA income tax
  const caIncomeTax = Math.round(
    applyBrackets(caTaxableIncome, yearData.california.brackets[filingStatus]),
  );

  // Step 4: CA Mental Health Services Tax
  const caMhThreshold = yearData.california.mentalHealthSurchargeThreshold;
  const caMentalHealthTax = caTaxableIncome > caMhThreshold
    ? Math.round((caTaxableIncome - caMhThreshold) * yearData.california.mentalHealthSurchargeRate)
    : 0;

  // Step 5: CA SDI (applied to W-2 wages only)
  const caSdiTax = Math.round(Math.max(0, wages) * yearData.california.sdiRate);

  // CA rates
  const caMarginalRate = getMarginalRate(
    caTaxableIncome,
    yearData.california.brackets[filingStatus],
  );
  const caEffectiveRate = grossIncome > 0 ? caIncomeTax / grossIncome : 0;

  // -------------------------------------------------------------------
  // Summary totals
  // -------------------------------------------------------------------
  const totalFederalBurden = federalIncomeTaxAfterCredits
    + socialSecurityTax
    + medicareTax
    + (isSelfEmployed ? selfEmploymentTax : 0);

  const totalCaBurden = caIncomeTax + caMentalHealthTax + caSdiTax;
  const combinedTax = totalFederalBurden + totalCaBurden;
  const overallEffectiveRate = grossIncome > 0 ? combinedTax / grossIncome : 0;
  const afterTaxIncome = grossIncome - combinedTax;
  const monthlyTakeHome = afterTaxIncome / 12;

  return {
    grossIncome,
    iraContributionLimit,
    deductibleIraAmount,
    agi,
    federalTaxableIncome,
    ordinaryIncomeTax,
    ltcgTax,
    federalIncomeTaxBeforeCredits,
    childTaxCredit,
    federalIncomeTaxAfterCredits,
    federalEffectiveRate,
    federalMarginalRate,
    socialSecurityTax,
    medicareTax,
    selfEmploymentTax: isSelfEmployed ? selfEmploymentTax : 0,
    caTaxableIncome,
    caIncomeTax,
    caMentalHealthTax,
    caSdiTax,
    caEffectiveRate,
    caMarginalRate,
    totalFederalBurden,
    totalCaBurden,
    combinedTax,
    overallEffectiveRate,
    afterTaxIncome,
    monthlyTakeHome,
    isProjectedYear: yearData.isProjected,
  };
}
