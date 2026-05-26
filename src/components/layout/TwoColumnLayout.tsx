import React from 'react';

interface TwoColumnLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

export function TwoColumnLayout({ left, right }: TwoColumnLayoutProps) {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:w-[420px] flex-shrink-0 space-y-4">{left}</div>
        <div className="w-full flex-1 space-y-4">{right}</div>
      </div>
    </div>
  );
}
