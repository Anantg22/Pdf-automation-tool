'use client';

import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
}

export default function StatCard({ label, value, change, icon }: StatCardProps) {
  const isPositive = change && change > 0;

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--text-secondary)]">{label}</span>
        {icon && <div className="text-[var(--accent-primary)]">{icon}</div>}
      </div>
      
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold text-white">{value}</h3>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-[var(--accent-secondary)]' : 'text-red-500'}`}>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
    </div>
  );
}
