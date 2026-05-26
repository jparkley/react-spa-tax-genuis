/**
 * Format a number as USD currency, rounded to the nearest dollar.
 * e.g. 12345.6 → "$12,346"
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

/**
 * Format a decimal rate as a percentage with up to 2 decimal places.
 * e.g. 0.2234 → "22.34%"
 */
export function formatPercent(value: number, decimals = 2): string {
  return (value * 100).toFixed(decimals) + '%';
}

/**
 * Parse a currency string (possibly with commas and $ sign) to a number.
 * Returns 0 for empty or invalid strings.
 */
export function parseCurrencyString(raw: string): number {
  const cleaned = raw.replace(/[$,\s]/g, '');
  if (cleaned === '' || cleaned === '-') return 0;
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Round a dollar amount to the nearest dollar.
 */
export function roundDollar(value: number): number {
  return Math.round(value);
}
