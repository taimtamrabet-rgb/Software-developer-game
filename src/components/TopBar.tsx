import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { formatMoney, formatMonthYear } from '../utils/format';
import { StatBar } from './StatBar';

export function TopBar() {
  const character = useGameStore((s) => s.character)!;
  const startYear = useGameStore((s) => s.startYear);
  const advanceMonth = useGameStore((s) => s.advanceMonth);
  const retire = useGameStore((s) => s.retire);
  const [menuOpen, setMenuOpen] = useState(false);

  const avatar = character.studio ? '🏢' : character.track === 'software' ? '💻' : '🎮';

  return (
    <div className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur border-b border-slate-800">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center text-xl shrink-0">
          {avatar}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white truncate">{character.name}</span>
            <span className="text-xs text-slate-400">Age {character.age}</span>
            <span className="text-xs text-slate-500">&middot;</span>
            <span className="text-xs text-slate-400">{formatMonthYear(character.monthsElapsed, startYear)}</span>
          </div>
          <div className="text-emerald-400 font-bold text-sm sm:text-base tabular-nums">
            {formatMoney(character.money)}
          </div>
        </div>
        <div className="hidden sm:flex gap-4 w-56">
          <StatBar label="Energy" value={character.energy} colorClass="bg-amber-500" icon="⚡" />
          <StatBar label="Happiness" value={character.happiness} colorClass="bg-pink-500" icon="😊" />
        </div>
        <button
          onClick={advanceMonth}
          className="shrink-0 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-4 py-2.5 transition-colors whitespace-nowrap"
        >
          Next Month &rarr;
        </button>
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-9 h-9 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-colors"
            aria-label="Menu"
          >
            ⋮
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-800 bg-slate-900 shadow-xl overflow-hidden z-30">
              <div className="w-full flex items-center justify-between px-4 py-2.5 text-sm border-b border-slate-800">
                <span className="text-slate-500">Social Code</span>
                <span className="text-slate-300 font-medium tabular-nums">0925</span>
              </div>
              <button
                onClick={() => {
                  if (confirm('Retire now and end your career?')) retire();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800"
              >
                Retire
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="sm:hidden max-w-5xl mx-auto px-4 pb-3 flex gap-4">
        <StatBar label="Energy" value={character.energy} colorClass="bg-amber-500" icon="⚡" />
        <StatBar label="Happiness" value={character.happiness} colorClass="bg-pink-500" icon="😊" />
      </div>
    </div>
  );
}
