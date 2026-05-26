interface ProjectedYearBannerProps {
  year: number;
}

export function ProjectedYearBanner({ year }: ProjectedYearBannerProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-300 px-4 py-3"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5"
      >
        <path
          fillRule="evenodd"
          d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
      <p className="text-sm text-amber-800">
        <strong>{year} brackets not yet published</strong> — estimates are based on the most recently
        published tax data. Actual brackets may differ once officially released by the IRS and FTB.
      </p>
    </div>
  );
}
