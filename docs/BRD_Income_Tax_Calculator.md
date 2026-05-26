# Business Requirements Document

## Income Tax Calculator — Federal & California State (Single-Page React/TypeScript App)

**Version:** 1.2
**Date:** May 25, 2026
**Status:** Draft

---

## 1. Executive Summary

This document defines the business requirements for a single-page React/TypeScript web application that calculates estimated U.S. federal income tax and California state income tax. Unlike multi-step wizard-style calculators (e.g., HRBlock, FTB), all inputs are presented on a single page with real-time result updates, giving users an immediate, transparent view of their full tax picture.

---

## 2. Business Objectives

- Provide users with a fast, accurate, single-page tax estimation tool without page navigation or form wizards.
- Cover both federal (IRS) and California (FTB) tax obligations in one unified experience.
- Display a clear breakdown of effective tax rates, marginal tax rates, and after-tax income.
- Support common filing scenarios: single filers, married couples, heads of household, and qualifying surviving spouses.
- Be maintainable and updatable as tax brackets change annually, with dynamic year support requiring no code changes.

---

## 3. Scope

### 3.1 In Scope

- Federal income tax calculation (ordinary income brackets + standard/itemized deduction)
- California state income tax calculation (CA SDI, CA income tax brackets + standard/itemized deduction)
- California Mental Health Services Tax (1% surcharge on income > $1M)
- FICA taxes: Social Security and Medicare (including Additional Medicare Tax)
- Capital gains tax differentiation (long-term vs. short-term rates)
- Self-employment tax (optional toggle)
- Child Tax Credit (CTC) — applied against federal income tax liability
- Traditional IRA contribution deduction with age-based contribution limits (standard limit for under 50; catch-up limit for age 50 and older) and deductibility phase-out based on income and workplace plan coverage
- **Dynamic tax year support:** The app begins at tax year 2026 and automatically includes the current year plus the next 7 calendar years. The available year range is derived at runtime so no code changes are required as years advance.
- Real-time recalculation on any input change (no "Calculate" button required)
- Responsive layout for desktop and tablet

### 3.2 Out of Scope

- Filing or e-filing of any tax forms
- State taxes other than California
- Alternative Minimum Tax (AMT) — noted as future enhancement
- Tax credits other than the Child Tax Credit — noted as future enhancement
- Integration with any payroll or financial data source

---

## 4. Users & Personas

This application is intended for a **small, defined group of internal users** whose sole purpose is to obtain a quick, reliable federal and California state income tax estimate. The user base is not public-facing and is not expected to expand beyond this initial cohort without a formal scope revision.

| Attribute                | Description                                                            |
| ------------------------ | ---------------------------------------------------------------------- |
| User type                | Internal / invited users only                                          |
| Primary goal             | Quickly estimate annual federal and CA state tax liability             |
| Technical sophistication | Moderate — familiar with financial terminology (AGI, FICA, deductions) |
| Access model             | Direct URL access; no authentication required in v1.0                  |
| Volume                   | Low (< 50 concurrent users expected)                                   |

Because the audience is known and technically comfortable, the UI may assume baseline financial literacy. Extensive onboarding flows, guided tours, and beginner-oriented explanations are not required, though field-level tooltips on complex terms remain in scope (see FR-64).

---

## 5. Functional Requirements

### 5.1 Input Panel — Filing Information

| ID    | Requirement            | Notes                                                                                                                                                                                                            |
| ----- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-01 | Tax year selector      | Dynamically populated: starts at 2026 and includes the current calendar year through current year + 7. Options are computed at runtime — no hardcoded year list. Default selection is the current calendar year. |
| FR-02 | Filing status selector | Single; Married Filing Jointly; Married Filing Separately; Head of Household; Qualifying Surviving Spouse                                                                                                        |
| FR-03 | Number of dependents   | Integer input (≥ 0); used for Child Tax Credit calculation                                                                                                                                                       |
| FR-04 | Age toggle (65+)       | Affects standard deduction (additional amount for seniors)                                                                                                                                                       |
| FR-05 | Blind taxpayer toggle  | Additional standard deduction for blind filers (IRS rules)                                                                                                                                                       |
| FR-06 | Age 50+ toggle         | Indicates the taxpayer is age 50 or older. Enables the IRA catch-up contribution limit for the selected tax year (e.g., $8,000 vs. $7,000 in 2026). Independent of FR-04; a filer who is 65+ is implicitly 50+ and both flags may be true simultaneously. For MFJ filers, this toggle applies to the primary taxpayer; per-spouse age tracking is out of scope for v1.0. |

### 5.2 Input Panel — Income

| ID    | Requirement                   | Notes                                                                                                          |
| ----- | ----------------------------- | -------------------------------------------------------------------------------------------------------------- |
| FR-10 | Gross wages / salary (W-2)    | Primary income field; numeric, formatted with commas                                                           |
| FR-11 | Self-employment income toggle | When enabled, shows net self-employment income field and applies SE tax                                        |
| FR-12 | Other taxable income          | Field for interest, dividends, alimony, etc. (treated as ordinary income)                                      |
| FR-13 | Pre-tax deductions            | 401(k), HSA, FSA contributions that reduce federal AGI. Does not include Traditional IRA (handled separately in FR-16). |
| FR-14 | Long-term capital gains       | Separate income field; taxed at preferential LTCG rates (0%, 15%, 20%) based on total income and filing status |
| FR-15 | Short-term capital gains      | Separate income field; treated as ordinary income and taxed at standard bracket rates                          |
| FR-16 | Traditional IRA contribution  | Numeric input for the taxpayer's Traditional IRA contribution for the tax year. The UI enforces the annual contribution limit: standard limit for age < 50 (e.g., $7,000 in 2026); catch-up limit for age 50+ (e.g., $8,000 in 2026), driven by FR-06 and the limit stored in tax data. Contribution is deducted from AGI subject to the deductibility phase-out rules in FR-17. Tooltip explains contribution limits and phase-out. |
| FR-17 | Workplace retirement plan coverage toggle | Checkbox indicating whether the taxpayer is covered by an employer-sponsored retirement plan (401(k), 403(b), SIMPLE IRA, pension, etc.). When enabled, the Traditional IRA deduction is phased out based on MAGI and filing status per IRS rules. When disabled (no workplace plan), the full contribution is deductible regardless of income. Phase-out thresholds are stored per tax year in tax data. |

### 5.3 Input Panel — Deductions

| ID    | Requirement                | Notes                                                                                                                                                                            |
| ----- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-20 | Deduction type toggle      | "Standard" or "Itemized" radio/toggle                                                                                                                                            |
| FR-21 | Standard deduction display | Auto-populated based on filing status, tax year, age, and blind status; read-only                                                                                                |
| FR-22 | Itemized deduction entry   | Shown only when "Itemized" is selected; optional line-item breakdown: mortgage interest, state/local taxes (SALT, capped at $10,000), charitable contributions, medical expenses |
| FR-23 | CA standard deduction      | Separate, smaller CA-specific standard deduction displayed alongside                                                                                                             |

### 5.4 Input Panel — Credits

| ID    | Requirement            | Notes                                                                                                                                                                                                                                                                                                             |
| ----- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-24 | Child Tax Credit (CTC) | Auto-calculated based on number of qualifying dependents (FR-03), filing status, and AGI. Displays computed credit amount. Phase-out applied per current IRS thresholds for the selected tax year. Credit applied after income tax is computed; cannot reduce tax below $0 (non-refundable portion only in v1.0). |

### 5.5 Results Panel — Federal Taxes

| ID     | Requirement                         | Notes                                                                                                           |
| ------ | ----------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| FR-30  | Adjusted Gross Income (AGI)         | Gross income (wages + ordinary income + STCG + LTCG) minus pre-tax deductions minus deductible Traditional IRA contribution (FR-16, subject to phase-out per FR-17) |
| FR-31  | Federal taxable income              | AGI minus applicable deduction                                                                                  |
| FR-32  | Federal income tax (before credits) | Calculated from applicable bracket table on ordinary income + STCG; LTCG taxed separately at preferential rates |
| FR-32a | LTCG tax                            | Computed separately using LTCG rate schedule for the selected year and filing status                            |
| FR-33  | Child Tax Credit applied            | CTC amount subtracted from pre-credit federal income tax; result floored at $0                                  |
| FR-34  | Federal income tax (after credits)  | FR-32 + FR-32a minus FR-33                                                                                      |
| FR-35  | Federal effective tax rate          | Federal income tax after credits ÷ gross income                                                                 |
| FR-36  | Federal marginal tax rate           | Top ordinary income bracket rate applying to last dollar of income                                              |
| FR-37  | Social Security tax                 | 6.2% on wages up to the annual wage base (dynamically loaded per tax year)                                      |
| FR-38  | Medicare tax                        | 1.45% standard + 0.9% Additional Medicare Tax on earned income > $200K (single) / $250K (MFJ)                   |
| FR-39  | Self-employment tax                 | 15.3% on net SE income (when FR-11 enabled); ½ SE deduction applied to AGI                                      |

### 5.6 Results Panel — California State Taxes

| ID    | Requirement                         | Notes                                                                                                               |
| ----- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| FR-40 | CA taxable income                   | Federal AGI (CA conformity basis) minus CA standard or itemized deduction                                           |
| FR-41 | CA income tax                       | Calculated from CA bracket table (10 brackets, up to 13.3%) for the selected tax year                               |
| FR-42 | CA Mental Health Services Tax       | 1% on CA taxable income exceeding $1,000,000                                                                        |
| FR-43 | CA SDI (State Disability Insurance) | Rate per selected tax year (e.g., 1.1% on all wages; no wage cap as of 2024); rate stored per year in tax data file |
| FR-44 | CA effective tax rate               | CA income tax ÷ gross income                                                                                        |
| FR-45 | CA marginal tax rate                | Top CA bracket rate applied                                                                                         |

### 5.7 Results Panel — Summary

| ID    | Requirement                 | Notes                                                                                                                                                     |
| ----- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-50 | Total federal tax burden    | Federal income tax (after credits) + SS + Medicare                                                                                                        |
| FR-51 | Total California tax burden | CA income tax + CA SDI + Mental Health Tax                                                                                                                |
| FR-52 | Combined total tax          | Sum of all federal and state taxes                                                                                                                        |
| FR-53 | Overall effective tax rate  | Combined total ÷ gross income                                                                                                                             |
| FR-54 | Estimated after-tax income  | Gross income minus combined total tax                                                                                                                     |
| FR-55 | After-tax monthly take-home | FR-54 ÷ 12                                                                                                                                                |
| FR-56 | Tax breakdown chart         | Visual bar or donut chart showing proportion of each tax component (federal income, LTCG tax, SS, Medicare, SE tax, CA income, CA SDI, Mental Health Tax) |

### 5.8 UX & Interaction Requirements

| ID    | Requirement                                                                                                                                |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| FR-60 | All inputs and results on a **single scrollable page** — no page navigation, modal wizards, or route changes                               |
| FR-61 | Results update in **real-time** as any input changes (no submit button)                                                                    |
| FR-62 | Numeric inputs auto-format with commas as user types (e.g., 120000 → 120,000)                                                              |
| FR-63 | Invalid or empty inputs gracefully default to $0 without error states blocking results                                                     |
| FR-64 | Tooltips or info icons (ⓘ) on complex fields (AGI, SE tax, CA SDI, LTCG rate, marginal rate, CTC phase-out) explaining the concept briefly |
| FR-65 | Collapsible sections for itemized deduction line items and capital gains fields to keep the page clean by default                          |
| FR-66 | "Reset" button to clear all inputs back to defaults                                                                                        |
| FR-67 | Tax year change recalculates all brackets, deductions, wage bases, SDI rates, and CTC thresholds immediately                               |

---

## 6. Non-Functional Requirements

| ID     | Requirement                                                                                                                 |
| ------ | --------------------------------------------------------------------------------------------------------------------------- |
| NFR-01 | **Framework:** React 18+ with TypeScript (strict mode)                                                                      |
| NFR-02 | **State management:** React `useState` / `useReducer`; no external state library required given single-page scope           |
| NFR-03 | **Styling:** Tailwind CSS or CSS Modules; no inline styles except for dynamic chart values                                  |
| NFR-04 | **Charting:** Recharts or similar lightweight library for the tax breakdown visualization                                   |
| NFR-05 | **No backend required:** All calculations performed client-side; tax bracket data stored as TypeScript constants            |
| NFR-06 | **Accuracy:** Results should match IRS Publication 15-T and FTB Schedule X/Y/Z tables within ±$1 rounding tolerance         |
| NFR-07 | **Performance:** Results should re-render within 100ms of any input change on a standard consumer device                    |
| NFR-08 | **Accessibility:** WCAG 2.1 AA — all inputs labeled, results readable by screen readers, sufficient color contrast          |
| NFR-09 | **Responsive design:** Fully functional on 768px+ viewports (desktop and tablet); mobile-optimized layout is a stretch goal |
| NFR-10 | **No PII storage:** No user data is transmitted or persisted; all data stays in browser memory                              |

---

## 7. Tax Calculation Logic Requirements

### 7.1 Tax Data Architecture — Dynamic Year Support

Tax bracket data must be stored as typed TypeScript constants in `/src/data/taxData.ts`, keyed by tax year. The year selector is populated dynamically at runtime:

```typescript
// Year range computed at runtime — no hardcoded list
const START_YEAR = 2026;
const currentYear = new Date().getFullYear();
const baseYear = Math.max(START_YEAR, currentYear);
const availableYears = Array.from({ length: 8 }, (_, i) => baseYear + i);
// e.g., in 2026 → [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033]
// e.g., in 2028 → [2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035]
```

For years beyond what has been officially published by the IRS/FTB, the app will display the most recent available bracket data with a UI notice indicating the values are estimated projections based on the last known year. This prevents the UI from blocking users while keeping accuracy expectations clear.

```
Structure: TaxBracket[] = { rate: number; min: number; max: number | null }[]
```

### 7.2 Calculation Order (Federal)

> **Pre-computation (no AGI dependency):** If SE income > 0, compute SE tax = 92.35% × net SE income × 15.3%. This value is needed in step 3 and step 13. SE tax does not depend on AGI, so it is safe to derive before AGI is finalized.

1. Compute gross income: W-2 wages + STCG + LTCG + other income + SE income
2. Subtract pre-tax deductions (401(k), HSA, FSA) → **pre-IRA AGI**
3. If SE income > 0: subtract ½ of the pre-computed SE tax from pre-IRA AGI (IRS above-the-line deduction; value comes from the pre-computation above)
4. Compute Traditional IRA deductible amount:
   a. Determine contribution limit: standard limit if age < 50 (FR-06 off); catch-up limit if age 50+ (FR-06 on) — both limits loaded from tax data for the selected year
   b. Cap user-entered IRA contribution (FR-16) at the applicable limit
   c. Determine MAGI for IRA phase-out purposes: MAGI = pre-IRA AGI (i.e., AGI after ½ SE deduction but before the IRA deduction itself — this matches the IRS definition of MAGI for Traditional IRA deductibility)
   d. If workplace plan coverage (FR-17) is enabled: compute the phase-out fraction using MAGI from step 4c and the filing-status phase-out range from tax data (e.g., for 2026 single with workplace plan: $79,000–$89,000); reduce the capped contribution linearly across the range; floor deductible amount at $0
   e. If workplace plan coverage is disabled: full capped contribution is deductible regardless of income
5. Subtract deductible IRA amount from pre-IRA AGI → **AGI**
6. Subtract standard or itemized deduction → **Federal Taxable Income**
7. Separate Federal Taxable Income into two stacks for tax computation:
   - **Ordinary income stack:** Federal Taxable Income minus LTCG
   - **LTCG stack:** LTCG portion (stacked on top of the ordinary income stack to determine applicable LTCG rate bracket — the 0%/15%/20% boundary is tested against *total* taxable income including LTCG, not ordinary income alone)
8. Apply progressive bracket table to ordinary income stack (includes STCG, which is taxed as ordinary income) → **Ordinary Income Tax**
9. Apply LTCG rate schedule to the LTCG stack: the applicable rate (0%, 15%, or 20%) is determined by where (ordinary income + LTCG) falls within the LTCG bracket thresholds for the filing status and selected year → **LTCG Tax**
10. Compute Child Tax Credit: phase-out is based on **AGI** (from step 5) — phase-out begins at $200K (single) / $400K (MFJ) for the selected year; subtract computed credit from (Ordinary Income Tax + LTCG Tax); floor result at $0
11. Compute SS tax: 6.2% × min(W-2 wages, annual SS wage base for selected year)
12. Compute Medicare tax: 1.45% × (W-2 wages + net SE income); add 0.9% Additional Medicare Tax on the portion of (W-2 wages + net SE income) exceeding the threshold for the filing status (e.g., $200K single / $250K MFJ)
13. Report SE tax from pre-computation above as a separate line item in results

### 7.3 Calculation Order (California)

1. Start from Federal AGI (CA conformity basis; the Traditional IRA deduction computed in §7.2 step 5 carries through because CA conforms to the federal treatment of deductible Traditional IRA contributions. MVP does not apply other CA-specific add-backs.)
2. Subtract CA standard or itemized deduction → **CA Taxable Income**
3. Apply CA progressive bracket table (10 brackets) for selected tax year → **CA Income Tax**
4. If CA taxable income > $1,000,000: add 1% Mental Health Services Tax on the excess above $1,000,000
5. Compute CA SDI: apply the SDI rate for the selected year to **W-2 wages only** (CA SDI does not apply to SE income, capital gains, interest, dividends, or other non-wage income)

### 7.4 Data Structures (TypeScript)

```typescript
// Dynamic year type — not a fixed union
type TaxYear = number;

type FilingStatus = "single" | "mfj" | "mfs" | "hoh" | "qss";

interface TaxBracket {
  rate: number;
  min: number;
  max: number | null;
}

interface LtcgBracket {
  rate: number; // 0, 0.15, or 0.20
  maxIncome: number | null; // upper bound of total taxable income for this rate
}

interface ChildTaxCreditConfig {
  amountPerChild: number;
  phaseOutThreshold: Record<FilingStatus, number>;
  phaseOutRate: number; // reduction per $1,000 over threshold
}

interface IraConfig {
  contributionLimit: number;          // standard limit (age < 50), e.g. 7000
  catchUpContributionLimit: number;   // limit for age 50+, e.g. 8000
  deductibilityPhaseOut: {
    // Income range over which the IRA deduction is phased out when covered by workplace plan
    withWorkplacePlan: Record<FilingStatus, { start: number; end: number }>;
    // When not covered by workplace plan but spouse is (MFJ only); null for other statuses
    spouseHasWorkplacePlan: Partial<Record<FilingStatus, { start: number; end: number }>>;
  };
}

interface YearTaxData {
  year: TaxYear;
  isProjected: boolean; // true if not yet officially published
  federal: {
    brackets: Record<FilingStatus, TaxBracket[]>;
    standardDeduction: Record<FilingStatus, number>;
    additionalStdDeduction: { age65: number; blind: number };
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
    mentalHealthSurchargeThreshold: number; // $1,000,000
    mentalHealthSurchargeRate: number; // 0.01
  };
}

// Master data map — keyed by year
type TaxDataMap = Record<TaxYear, YearTaxData>;

interface TaxInputs {
  taxYear: TaxYear;
  filingStatus: FilingStatus;
  dependents: number;
  age65Plus: boolean;
  age50Plus: boolean;              // true if taxpayer is age 50 or older (enables IRA catch-up limit)
  blind: boolean;
  wages: number;
  isSelfEmployed: boolean;
  selfEmploymentIncome: number;
  otherIncome: number;
  shortTermCapitalGains: number;
  longTermCapitalGains: number;
  preTaxDeductions: number;
  traditionalIraContribution: number;     // user-entered IRA contribution amount (FR-16)
  hasWorkplaceRetirementPlan: boolean;    // affects IRA deductibility phase-out (FR-17)
  useItemizedDeductions: boolean;
  itemizedDeductionTotal: number;
}

interface TaxResults {
  grossIncome: number;
  iraContributionLimit: number;          // effective limit for the year (standard or catch-up)
  deductibleIraAmount: number;           // actual deductible portion after phase-out
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
  isProjectedYear: boolean; // surfaces the projection flag to the UI
}
```

---

## 8. Page Layout Requirements

```
┌─────────────────────────────────────────────────────────┐
│  App Header: "Income Tax Calculator — Federal + CA"      │
├──────────────────────────┬──────────────────────────────┤
│  LEFT COLUMN (Inputs)    │  RIGHT COLUMN (Results)       │
│                          │                               │
│  ┌─ Filing Info ───────┐ │  ┌─ Summary Card ───────────┐│
│  │ Tax Year (dynamic)  │ │  │ After-Tax Income          ││
│  │ Filing Status       │ │  │ Monthly Take-Home         ││
│  │ Dependents          │ │  │ Combined Effective Rate   ││
│  │ Age 65+ / Blind     │ │  └──────────────────────────┘│
│  └─────────────────────┘ │                               │
│                          │  [⚠ Projected year banner     │
│  ┌─ Income ────────────┐ │   if isProjectedYear=true]   │
│  │ W-2 Wages           │ │                               │
│  │ Self-Employment     │ │  ┌─ Federal Breakdown ──────┐ │
│  │ Other Income        │ │  │ AGI / Taxable Income     │ │
│  │ Pre-Tax Deductions  │ │  │ Ordinary Income Tax      │ │
│  │ [▸ Capital Gains]   │ │  │ LTCG Tax                 │ │
│  │   Short-Term        │ │  │ Child Tax Credit         │ │
│  │   Long-Term         │ │  │ SS + Medicare            │ │
│  └─────────────────────┘ │  │ Eff. Rate / Marg. Rate   │ │
│                          │  └──────────────────────────┘ │
│  ┌─ Deductions ────────┐ │                               │
│  │ Standard/Itemized   │ │  ┌─ CA State Breakdown ─────┐ │
│  │ [Line items if sel] │ │  │ CA Taxable Income        │ │
│  └─────────────────────┘ │  │ CA Income Tax            │ │
│                          │  │ Mental Health Tax        │ │
│  [Reset All]             │  │ SDI                      │ │
│                          │  └──────────────────────────┘ │
│                          │                               │
│                          │  ┌─ Tax Breakdown Chart ────┐ │
│                          │  │ [Donut/Bar visualization] │ │
│                          │  └──────────────────────────┘ │
└──────────────────────────┴──────────────────────────────┘
```

On narrower viewports (< 1024px), the two columns stack vertically with the results below the inputs.

The Capital Gains sub-section under Income is collapsed by default and expands when the user clicks the disclosure triangle (FR-65).

---

## 9. Data Sources & Annual Maintenance

| Tax Component                         | Primary Source                                       | Update Frequency |
| ------------------------------------- | ---------------------------------------------------- | ---------------- |
| Federal income tax brackets           | IRS Revenue Procedure (published annually, ~Oct–Nov) | Annually         |
| Federal standard deduction            | IRS Rev. Proc.                                       | Annually         |
| LTCG rate thresholds                  | IRS Rev. Proc.                                       | Annually         |
| Child Tax Credit amounts & phase-outs | IRS (partially inflation-adjusted)                   | Annually         |
| Social Security wage base             | SSA announcement (Oct–Nov)                           | Annually         |
| Additional Medicare Tax thresholds    | IRS (currently not inflation-adjusted)               | As changed       |
| CA income tax brackets                | FTB (indexed for inflation annually)                 | Annually         |
| CA standard deduction                 | FTB (relatively static)                              | As changed       |
| CA SDI rate                           | EDD announcement                                     | Annually         |
| Traditional IRA contribution limits   | IRS Rev. Proc. (catch-up limit set by SECURE 2.0 with inflation indexing beginning 2024) | Annually |
| Traditional IRA deductibility phase-out thresholds | IRS Rev. Proc. (inflation-adjusted annually) | Annually |

**Maintenance requirement:** All per-year tax data is isolated in `/src/data/taxData.ts` as entries in a `TaxDataMap`. Adding a new tax year requires only appending a new `YearTaxData` object — no changes to calculation logic, UI components, or the year selector (which is derived at runtime).

**Projection handling:** Years not yet in `taxData.ts` should fall back to the most recently defined year's data, with `isProjected: true`. The UI must display a visible banner when projected data is in use (e.g., _"2031 brackets not yet published — estimates based on 2026 data"_).

---

## 10. Assumptions & Constraints

- **No AMT calculation** in v1.0; a disclaimer note will be displayed in the UI.
- **CTC is non-refundable only** in v1.0; the Additional Child Tax Credit (refundable portion) is a future enhancement.
- **LTCG stacking rules apply:** Long-term capital gains are stacked on top of ordinary income to determine which LTCG rate bracket applies.
- California calculations assume the user is a **full-year CA resident**.
- The app does **not** account for CA-specific income adjustments beyond the standard deduction difference.
- **Projected years** beyond the last published data will use the most recent available bracket data; this is disclosed to the user.
- The app is for **estimation purposes only** and must display a disclaimer that results are not tax advice and users should consult a tax professional.
- All dollar amounts are rounded to the nearest dollar in results display.
- The user base is small and internal; no authentication, rate limiting, or multi-tenancy features are required in v1.0.

---

## 11. Disclaimer Requirement

The application must display a persistent, visible disclaimer:

> _This calculator provides estimates for informational purposes only. It does not constitute tax advice. Tax situations vary; consult a licensed tax professional or CPA for personalized guidance. Results are based on published IRS and California FTB tax tables for the selected year; years not yet published use projected estimates._

---

## 12. Future Enhancements (Out of Scope for v1.0)

- Alternative Minimum Tax (AMT)
- Additional Child Tax Credit (refundable portion of CTC)
- Other tax credits (EITC, education credits, EV credits, etc.)
- Other state tax support
- Spouse income split display for Married Filing Jointly
- PDF export of results
- Year-over-year comparison view
- Mobile-optimized layout (< 768px)
- Automatic bracket inflation projection for future years (CPI-based estimates)
- Roth IRA contribution tracking and income phase-out display (does not reduce AGI but useful for planning)
- Per-spouse age and IRA tracking for Married Filing Jointly filers
- Non-deductible Traditional IRA basis tracking (Form 8606 scenario)

---

## 13. Acceptance Criteria

| #     | Criterion                                                                                                                      |
| ----- | ------------------------------------------------------------------------------------------------------------------------------ |
| AC-01 | All inputs visible on a single page without routing or modal navigation                                                        |
| AC-02 | Results update in real time on every input keystroke/change                                                                    |
| AC-03 | Federal tax calculation matches IRS tax tables within ±$1 for at least 10 representative test cases across all filing statuses |
| AC-04 | California tax calculation matches FTB Schedule X/Y/Z within ±$1 for at least 10 representative test cases                     |
| AC-05 | FICA taxes (SS, Medicare, Additional Medicare) calculate correctly at boundary income levels                                   |
| AC-06 | Self-employment tax toggle correctly adds SE tax and applies the ½ SE deduction to AGI                                         |
| AC-07 | Standard vs. itemized deduction toggle correctly switches deduction used in both federal and CA calculations                   |
| AC-08 | Tax year selector is dynamically generated at runtime; no hardcoded year list exists in the codebase                           |
| AC-09 | Year selector always shows the current calendar year through current year + 7 (or 2026 as minimum start, whichever is later)   |
| AC-10 | A projected-year banner is displayed when the selected year has no officially published bracket data                           |
| AC-11 | LTCG income is taxed at preferential rates (0%/15%/20%) and stacked correctly on top of ordinary income                        |
| AC-12 | Child Tax Credit is auto-calculated, phase-out is applied correctly, and credit does not reduce federal tax below $0           |
| AC-13 | Disclaimer is permanently visible                                                                                              |
| AC-14 | App builds without TypeScript errors in strict mode                                                                            |
| AC-15 | All result fields display $0 gracefully when income fields are empty                                                           |
| AC-16 | When age 50+ toggle (FR-06) is off, the IRA contribution input enforces the standard contribution limit for the selected year  |
| AC-17 | When age 50+ toggle (FR-06) is on, the IRA contribution input enforces the catch-up contribution limit for the selected year   |
| AC-18 | With workplace plan coverage enabled and AGI within the phase-out range, the deductible IRA amount is correctly prorated       |
| AC-19 | With workplace plan coverage disabled, the full IRA contribution (up to the applicable limit) is deducted from AGI             |
| AC-20 | AGI reflects the deductible IRA amount; federal and CA taxable income both reflect the updated AGI                             |

---

_End of Document_
