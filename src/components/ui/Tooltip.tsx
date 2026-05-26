import React, { useState, useRef } from 'react';

interface TooltipProps {
  text: string;
  children?: React.ReactNode;
}

export function Tooltip({ text, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  return (
    <span className="relative inline-flex items-center" ref={ref}>
      <button
        type="button"
        aria-label="More information"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full"
      >
        {children ?? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM9 9a1 1 0 112 0v4a1 1 0 11-2 0V9zm1-5.25a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" clipRule="evenodd" />
          </svg>
        )}
      </button>
      {visible && (
        <div
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg"
        >
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </span>
  );
}
