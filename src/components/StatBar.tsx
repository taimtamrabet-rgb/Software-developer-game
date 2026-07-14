interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  colorClass?: string;
  icon?: string;
}

export function StatBar({ label, value, max = 100, colorClass = 'bg-violet-500', icon }: StatBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="truncate">{icon ? `${icon} ` : ''}{label}</span>
        <span className="tabular-nums text-slate-300">{Math.round(value)}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
