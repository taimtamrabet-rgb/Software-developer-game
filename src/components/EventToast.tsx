import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';

export function EventToast() {
  const latest = useGameStore((s) => s.character?.eventLog[0]);
  const [visibleId, setVisibleId] = useState<string | null>(null);

  useEffect(() => {
    if (!latest) return;
    setVisibleId(latest.id);
    const t = setTimeout(() => setVisibleId((id) => (id === latest.id ? null : id)), 4500);
    return () => clearTimeout(t);
  }, [latest]);

  if (!latest || visibleId !== latest.id) return null;

  const colors: Record<string, string> = {
    good: 'border-emerald-500/50 bg-emerald-950 text-emerald-200',
    bad: 'border-rose-500/50 bg-rose-950 text-rose-200',
    neutral: 'border-slate-600/50 bg-slate-900 text-slate-200',
  };

  return (
    <div className="fixed top-[80px] sm:top-[76px] left-0 right-0 sm:left-auto sm:right-4 z-30 flex justify-center sm:justify-end px-4 sm:px-0 pointer-events-none">
      <div
        className={`animate-toast-in pointer-events-auto max-w-sm w-full rounded-xl border px-4 py-3 text-sm shadow-2xl ${colors[latest.kind]}`}
      >
        {latest.text}
      </div>
    </div>
  );
}
