import type { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-white font-semibold text-base mb-3">{children}</h2>;
}
