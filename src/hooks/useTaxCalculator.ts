import { useReducer, useMemo, useCallback } from 'react';
import type { TaxInputs, TaxResults } from '../types/tax.types';
import { calculateTaxes } from '../lib/calculator';
import { getTaxDataForYear } from '../data/taxData';
import { getDefaultYear } from '../lib/yearUtils';

// ---------------------------------------------------------------------------
// Default inputs
// ---------------------------------------------------------------------------

export const DEFAULT_INPUTS: TaxInputs = {
  taxYear: getDefaultYear(),
  filingStatus: 'mfj',
  dependents: 2,
  age65Plus: false,
  age50Plus: true,
  blind: false,
  wages: 0,
  isSelfEmployed: false,
  selfEmploymentIncome: 0,
  interestAndDividends: 0,
  iraDistributions: 0,
  tiaaWithdrawals: 0,
  shortTermCapitalGains: 0,
  longTermCapitalGains: 0,
  preTaxDeductions: 0,
  traditionalIraContribution: 0,
  hasWorkplaceRetirementPlan: false,
  useItemizedDeductions: false,
  itemizedDeductionTotal: 0,
};

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

type Action =
  | { type: 'SET_FIELD'; field: keyof TaxInputs; value: TaxInputs[keyof TaxInputs] }
  | { type: 'RESET' };

function reducer(state: TaxInputs, action: Action): TaxInputs {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET':
      return { ...DEFAULT_INPUTS };
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export interface UseTaxCalculator {
  inputs: TaxInputs;
  results: TaxResults;
  setField: <K extends keyof TaxInputs>(field: K, value: TaxInputs[K]) => void;
  reset: () => void;
}

export function useTaxCalculator(): UseTaxCalculator {
  const [inputs, dispatch] = useReducer(reducer, DEFAULT_INPUTS);

  const results = useMemo<TaxResults>(() => {
    const yearData = getTaxDataForYear(inputs.taxYear);
    return calculateTaxes(inputs, yearData);
  }, [inputs]);

  const setField = useCallback(<K extends keyof TaxInputs>(field: K, value: TaxInputs[K]) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return { inputs, results, setField, reset };
}
