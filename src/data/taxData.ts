import type { TaxBracket, LtcgBracket, YearTaxData } from '../types/tax.types';

// ---------------------------------------------------------------------------
// Shared bracket arrays for 2026 (= 2025 IRS published values — BRD §9)
// ---------------------------------------------------------------------------

const FED_BRACKETS_SINGLE_2026: TaxBracket[] = [
  { rate: 0.10, min: 0,       max: 11925   },
  { rate: 0.12, min: 11925,   max: 48475   },
  { rate: 0.22, min: 48475,   max: 103350  },
  { rate: 0.24, min: 103350,  max: 197300  },
  { rate: 0.32, min: 197300,  max: 250525  },
  { rate: 0.35, min: 250525,  max: 626350  },
  { rate: 0.37, min: 626350,  max: null    },
];

const FED_BRACKETS_MFJ_2026: TaxBracket[] = [
  { rate: 0.10, min: 0,       max: 23850   },
  { rate: 0.12, min: 23850,   max: 96950   },
  { rate: 0.22, min: 96950,   max: 206700  },
  { rate: 0.24, min: 206700,  max: 394600  },
  { rate: 0.32, min: 394600,  max: 501050  },
  { rate: 0.35, min: 501050,  max: 751600  },
  { rate: 0.37, min: 751600,  max: null    },
];

const FED_BRACKETS_HOH_2026: TaxBracket[] = [
  { rate: 0.10, min: 0,       max: 17000   },
  { rate: 0.12, min: 17000,   max: 64850   },
  { rate: 0.22, min: 64850,   max: 103350  },
  { rate: 0.24, min: 103350,  max: 197300  },
  { rate: 0.32, min: 197300,  max: 250500  },
  { rate: 0.35, min: 250500,  max: 626350  },
  { rate: 0.37, min: 626350,  max: null    },
];

// MFS uses the same bracket thresholds as Single
const FED_BRACKETS_MFS_2026 = FED_BRACKETS_SINGLE_2026;
// QSS uses MFJ rates and brackets
const FED_BRACKETS_QSS_2026 = FED_BRACKETS_MFJ_2026;

// ---------------------------------------------------------------------------
// LTCG brackets (thresholds are total taxable income — ordinary + LTCG)
// ---------------------------------------------------------------------------

const LTCG_SINGLE_2026: LtcgBracket[] = [
  { rate: 0.00, maxIncome: 47025   },
  { rate: 0.15, maxIncome: 518900  },
  { rate: 0.20, maxIncome: null    },
];

const LTCG_MFJ_2026: LtcgBracket[] = [
  { rate: 0.00, maxIncome: 94050   },
  { rate: 0.15, maxIncome: 583750  },
  { rate: 0.20, maxIncome: null    },
];

const LTCG_HOH_2026: LtcgBracket[] = [
  { rate: 0.00, maxIncome: 63000   },
  { rate: 0.15, maxIncome: 551350  },
  { rate: 0.20, maxIncome: null    },
];

const LTCG_MFS_2026: LtcgBracket[] = [
  { rate: 0.00, maxIncome: 47025   },
  { rate: 0.15, maxIncome: 291850  },
  { rate: 0.20, maxIncome: null    },
];

const LTCG_QSS_2026 = LTCG_MFJ_2026;

// ---------------------------------------------------------------------------
// California brackets 2026 (= 2025 FTB published values)
// Mental Health Surcharge (1% on CA taxable income > $1M) is computed separately
// ---------------------------------------------------------------------------

const CA_BRACKETS_SINGLE_2026: TaxBracket[] = [
  { rate: 0.010, min: 0,       max: 10756   },
  { rate: 0.020, min: 10756,   max: 25499   },
  { rate: 0.040, min: 25499,   max: 40245   },
  { rate: 0.060, min: 40245,   max: 55866   },
  { rate: 0.080, min: 55866,   max: 70606   },
  { rate: 0.093, min: 70606,   max: 360659  },
  { rate: 0.103, min: 360659,  max: 432787  },
  { rate: 0.113, min: 432787,  max: 721314  },
  { rate: 0.123, min: 721314,  max: null    },
];

const CA_BRACKETS_MFJ_2026: TaxBracket[] = [
  { rate: 0.010, min: 0,       max: 21512   },
  { rate: 0.020, min: 21512,   max: 50998   },
  { rate: 0.040, min: 50998,   max: 80490   },
  { rate: 0.060, min: 80490,   max: 111732  },
  { rate: 0.080, min: 111732,  max: 141212  },
  { rate: 0.093, min: 141212,  max: 721318  },
  { rate: 0.103, min: 721318,  max: 865574  },
  { rate: 0.113, min: 865574,  max: 1000000 },
  { rate: 0.123, min: 1000000, max: null    },
];

const CA_BRACKETS_HOH_2026: TaxBracket[] = [
  { rate: 0.010, min: 0,       max: 21527   },
  { rate: 0.020, min: 21527,   max: 51000   },
  { rate: 0.040, min: 51000,   max: 65744   },
  { rate: 0.060, min: 65744,   max: 81364   },
  { rate: 0.080, min: 81364,   max: 96107   },
  { rate: 0.093, min: 96107,   max: 490493  },
  { rate: 0.103, min: 490493,  max: 588593  },
  { rate: 0.113, min: 588593,  max: 980987  },
  { rate: 0.123, min: 980987,  max: null    },
];

const CA_BRACKETS_MFS_2026 = CA_BRACKETS_SINGLE_2026;
const CA_BRACKETS_QSS_2026  = CA_BRACKETS_MFJ_2026;

// ---------------------------------------------------------------------------
// 2026 — the only officially published year (isProjected: false)
// ---------------------------------------------------------------------------

export const taxData2026: YearTaxData = {
  year: 2026,
  isProjected: false,
  federal: {
    brackets: {
      single: FED_BRACKETS_SINGLE_2026,
      mfj:    FED_BRACKETS_MFJ_2026,
      mfs:    FED_BRACKETS_MFS_2026,
      hoh:    FED_BRACKETS_HOH_2026,
      qss:    FED_BRACKETS_QSS_2026,
    },
    standardDeduction: {
      single: 15000,
      mfj:    30000,
      mfs:    15000,
      hoh:    22500,
      qss:    30000,
    },
    additionalStdDeduction: {
      singleOrHoh:  { age65: 1600, blind: 1600 },
      marriedOrQss: { age65: 1300, blind: 1300 },
    },
    ssWageBase: 176100,
    additionalMedicareThreshold: {
      single: 200000,
      mfj:    250000,
      mfs:    125000,
      hoh:    200000,
      qss:    200000,
    },
    ltcgBrackets: {
      single: LTCG_SINGLE_2026,
      mfj:    LTCG_MFJ_2026,
      mfs:    LTCG_MFS_2026,
      hoh:    LTCG_HOH_2026,
      qss:    LTCG_QSS_2026,
    },
    childTaxCredit: {
      amountPerChild: 2000,
      phaseOutThreshold: {
        single: 200000,
        mfj:    400000,
        mfs:    200000,
        hoh:    200000,
        qss:    400000,
      },
      phaseOutRate: 50, // $50 reduction per $1,000 over threshold (ceiling division)
    },
    rothIra: {
      contributionPhaseOut: {
        single: { start: 150000, end: 165000 },
        mfj:    { start: 236000, end: 246000 },
        mfs:    { start: 0,      end: 10000  },
        hoh:    { start: 150000, end: 165000 },
        qss:    { start: 236000, end: 246000 },
      },
    },
    k401EmployeeLimit: 23500,
    ira: {
      contributionLimit:      7000,
      catchUpContributionLimit: 8000,
      deductibilityPhaseOut: {
        withWorkplacePlan: {
          single: { start: 79000,  end: 89000  },
          mfj:    { start: 126000, end: 146000 },
          mfs:    { start: 0,      end: 10000  },
          hoh:    { start: 79000,  end: 89000  },
          qss:    { start: 126000, end: 146000 },
        },
        spouseHasWorkplacePlan: {
          mfj: { start: 230000, end: 240000 },
        },
      },
    },
  },
  california: {
    brackets: {
      single: CA_BRACKETS_SINGLE_2026,
      mfj:    CA_BRACKETS_MFJ_2026,
      mfs:    CA_BRACKETS_MFS_2026,
      hoh:    CA_BRACKETS_HOH_2026,
      qss:    CA_BRACKETS_QSS_2026,
    },
    standardDeduction: {
      single: 5202,
      mfj:    10404,
      mfs:    5202,
      hoh:    10404,
      qss:    10404,
    },
    sdiRate: 0.011, // 1.1%, no wage cap
    mentalHealthSurchargeThreshold: 1000000,
    mentalHealthSurchargeRate: 0.01,
  },
};

// ---------------------------------------------------------------------------
// Projected years 2027–2033 — copies of 2026 data with isProjected: true
// ---------------------------------------------------------------------------

function makeProjected(base: YearTaxData, year: number): YearTaxData {
  return { ...base, year, isProjected: true };
}

// ---------------------------------------------------------------------------
// Master data map
// ---------------------------------------------------------------------------

const taxDataMap: { [year: number]: YearTaxData } = {
  2026: taxData2026,
  2027: makeProjected(taxData2026, 2027),
  2028: makeProjected(taxData2026, 2028),
  2029: makeProjected(taxData2026, 2029),
  2030: makeProjected(taxData2026, 2030),
  2031: makeProjected(taxData2026, 2031),
  2032: makeProjected(taxData2026, 2032),
  2033: makeProjected(taxData2026, 2033),
};

/**
 * Returns the YearTaxData for the requested year.
 * For years without published data, falls back to the most recent known year
 * and marks the result as projected.
 */
export function getTaxDataForYear(year: number): YearTaxData {
  if (taxDataMap[year]) return taxDataMap[year];

  // Find the most recent year we have data for
  const knownYears = Object.keys(taxDataMap)
    .map(Number)
    .sort((a, b) => b - a);

  const fallback = knownYears[0];
  return { ...taxDataMap[fallback], year, isProjected: true };
}
