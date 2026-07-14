import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { formatMoney, formatMonthYear } from '../utils/format';
import { StatBar } from './StatBar';

export function TopBar() {
  const character = useGameStore((s) => s.character)!;
  const startYear = useGameStore((s) => s.startYear);
  const advanceMonth = useGameStore((s) => s.advanceMonth);
  const retire = useGameStore((s) => s.retire);
  const redeemCode = useGameStore((s) => s.redeemCode);
  const [menuOpen, setMenuOpen] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [codeMessage, setCodeMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const avatar = character.studio ? '🏢' : character.track === 'software' ? '💻' : '🎮';

  function handleRedeem() {
    if (!codeInput.trim()) return;
    const success = redeemCode(codeInput);
    setCodeMessage(success ? { text: 'Code redeemed!', ok: true } : { text: 'Invalid or already used code', ok: false });
    setCodeInput('');
    window.setTimeout(() => setCodeMessage(null), 3000);
  }

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
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900 shadow-xl overflow-hidden z-30">
              <div className="px-4 py-2.5 border-b border-slate-800">
                <div className="text-xs text-slate-500 mb-1.5">Social Code</div>
                <div className="flex gap-1.5">
                  <input
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRedeem();
                    }}
                    placeholder="Enter code"
                    className="flex-1 min-w-0 rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500"
                  />
                  <button
                    onClick={handleRedeem}
                    className="shrink-0 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold px-3 py-1.5 transition-colors"
                  >
                    Go
                  </button>
                </div>
                {codeMessage && (
                  <div className={`text-xs mt-1.5 ${codeMessage.ok ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {codeMessage.text}
                  </div>
                )}
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
