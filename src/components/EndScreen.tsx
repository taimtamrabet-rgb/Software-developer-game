import { useGameStore } from '../store/gameStore';
import { formatMoney } from '../utils/format';
import { computeNetWorth } from '../utils/gameLogic';

export function EndScreen() {
  const character = useGameStore((s) => s.character)!;
  const resetGame = useGameStore((s) => s.resetGame);
  const netWorth = computeNetWorth(character);
  const years = Math.floor(character.experienceMonths / 12);

  return (
    <div className="min-h-svh w-full flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-10">
      <div className="w-full max-w-lg bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
        <div className="text-5xl mb-3">🏆</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{character.name} has retired</h1>
        <p className="text-slate-400 text-sm mb-6">Age {character.age} &middot; A career well spent.</p>

        <div className="grid grid-cols-2 gap-4 text-left mb-8">
          <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4">
            <div className="text-slate-500 text-xs">Final Net Worth</div>
            <div className="text-emerald-400 font-bold text-lg">{formatMoney(netWorth)}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4">
            <div className="text-slate-500 text-xs">Peak Net Worth</div>
            <div className="text-emerald-400 font-bold text-lg">{formatMoney(character.peakNetWorth)}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4">
            <div className="text-slate-500 text-xs">Years Worked</div>
            <div className="text-white font-bold text-lg">{years}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4">
            <div className="text-slate-500 text-xs">Studios Founded / Sold</div>
            <div className="text-white font-bold text-lg">{character.studiosFounded} / {character.studiosSold}</div>
          </div>
        </div>

        <button
          onClick={resetGame}
          className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3.5 transition-colors"
        >
          Start a New Career
        </button>
      </div>
    </div>
  );
}
