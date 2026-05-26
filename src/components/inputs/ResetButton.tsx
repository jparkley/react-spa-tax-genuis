interface ResetButtonProps {
  onReset: () => void;
}

export function ResetButton({ onReset }: ResetButtonProps) {
  return (
    <button
      type="button"
      onClick={onReset}
      className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
    >
      Reset All Fields
    </button>
  );
}
