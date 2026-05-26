export function AppHeader() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900">
          Tax Genius — Federal + CA Income Tax Calculator
        </h1>
        <p className="mt-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-1.5 leading-relaxed">
          <strong>Disclaimer:</strong> This calculator provides estimates for informational purposes
          only. It does not constitute tax advice. Tax situations vary; consult a licensed tax
          professional or CPA for personalized guidance. Results are based on published IRS and
          California FTB tax tables for the selected year; years not yet published use projected
          estimates. AMT and most refundable credits are not included.
        </p>
      </div>
    </header>
  );
}
