import React from 'react';
import clsx from 'clsx';

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ title, children, className }: SectionCardProps) {
  return (
    <div className={clsx('bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden', className)}>
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</h2>
      </div>
      <div className="p-4 space-y-3">{children}</div>
    </div>
  );
}
