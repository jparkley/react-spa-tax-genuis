import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TaxResults } from '../../types/tax.types';
import { formatCurrency } from '../../lib/formatters';

interface TaxBreakdownChartProps {
  results: TaxResults;
}

const COLORS = [
  '#2563eb', // blue-600 — Federal income tax
  '#7c3aed', // violet-600 — LTCG tax
  '#0891b2', // cyan-600 — SS
  '#0d9488', // teal-600 — Medicare
  '#d97706', // amber-600 — SE tax
  '#dc2626', // red-600 — CA income tax
  '#16a34a', // green-600 — CA SDI
  '#9333ea', // purple-600 — Mental Health Tax
];

interface ChartEntry {
  name: string;
  value: number;
  color: string;
}

export function TaxBreakdownChart({ results }: TaxBreakdownChartProps) {
  const entries: ChartEntry[] = [
    { name: 'Federal Income Tax', value: results.federalIncomeTaxAfterCredits, color: COLORS[0] },
    { name: 'LTCG Tax',           value: results.ltcgTax,                       color: COLORS[1] },
    { name: 'Social Security',    value: results.socialSecurityTax,             color: COLORS[2] },
    { name: 'Medicare',           value: results.medicareTax,                   color: COLORS[3] },
    { name: 'SE Tax',             value: results.selfEmploymentTax,             color: COLORS[4] },
    { name: 'CA Income Tax',      value: results.caIncomeTax,                   color: COLORS[5] },
    { name: 'CA SDI',             value: results.caSdiTax,                      color: COLORS[6] },
    { name: 'CA Mental Health',   value: results.caMentalHealthTax,             color: COLORS[7] },
  ].filter((e) => e.value > 0);

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Tax Breakdown
        </h2>
        <p className="text-sm text-gray-500 text-center py-6">
          Enter income to see the tax breakdown chart.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
        Tax Breakdown
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={entries}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={2}
            dataKey="value"
          >
            {entries.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [formatCurrency(value), name]}
            contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
