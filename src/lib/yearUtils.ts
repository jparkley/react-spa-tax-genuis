const START_YEAR = 2026;

/**
 * Returns the dynamically-computed array of available tax years.
 * Always starts at the later of START_YEAR or the current calendar year,
 * and includes 8 consecutive years (current year + 7).
 */
export function getAvailableYears(): number[] {
  const currentYear = new Date().getFullYear();
  const baseYear = Math.max(START_YEAR, currentYear);
  return Array.from({ length: 8 }, (_, i) => baseYear + i);
}

/**
 * Returns the default tax year (current calendar year, floored at START_YEAR).
 */
export function getDefaultYear(): number {
  const currentYear = new Date().getFullYear();
  return Math.max(START_YEAR, currentYear);
}
