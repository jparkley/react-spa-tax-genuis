# Changelog

## 2026-05-25

### `4013c74` — Personalize Traditional IRA toggle and contribution note
- Renamed "Covered by Workplace Retirement Plan" toggle to **"Wife has 401(k) through work (husband does not)"** to reflect the actual household situation.
- Updated toggle help text to explain that since only one spouse has a workplace plan, the husband's IRA is fully deductible if MAGI ≤ $242,000 (2026 non-covered spouse threshold).
- Updated Traditional IRA contribution help text to: *"MFJ with one spouse in a 401(k): fully deductible if MAGI ≤ $242,000 (2026)."*

### `144f23f` — Split Other Taxable Income into three fields
- Replaced the single **Other Taxable Income** field with three named fields:
  - **Other Income 1 — Interest & Dividends** (1099-INT / 1099-DIV)
  - **Other Income 2 — IRA Distributions** (1099-R taxable withdrawals)
  - **Other Income 3 — TIAA Withdrawals** (1099-R retirement distributions)
- All three are summed and taxed as ordinary income, same as before.

### `7830568` — Add clarifying notes to input fields
- **W-2 Wages / Salary**: added help text — *"From W-2 Box 1 — gross pay minus pre-tax deductions (401k, HSA, FSA, etc.). Note: in 2025, it was $122,800."*
- **Number of Qualifying Dependents**: renamed label from "for CTC" to "for Child Tax Credit".

### `c14b1e7` — Update default values on landing
- Filing status: **Married Filing Jointly** (was Single)
- Number of qualifying dependents: **2** (was 0)
- Age 50 or older: **toggled on** (was off)
- Reset button restores to these new defaults.

### `6674f9e` — Initial app implementation
- Full single-page React 18 + TypeScript (strict) app scaffolded with Vite, Tailwind CSS, and Recharts.
- Federal income tax: 7-bracket progressive calculation, standard/itemized deduction, LTCG stacking rule, Child Tax Credit with phase-out, FICA (SS + Medicare + Additional Medicare), SE tax with ½ deduction.
- California state tax: 9-bracket progressive calculation, CA SDI (1.1%, no cap), Mental Health Services Tax (1% on CA taxable income > $1M).
- Traditional IRA deductibility with age-based limits ($7,000 / $8,000 catch-up) and income phase-out.
- Dynamic tax year selector (2026–2033); years without published data show a projected-year banner.
- Tax breakdown donut chart (Recharts).
- All calculations client-side; no data transmitted or stored.
