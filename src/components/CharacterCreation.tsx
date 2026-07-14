import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { Track } from '../types';

export function CharacterCreation() {
  const [name, setName] = useState('');
  const [track, setTrack] = useState<Track>('software');
  const newGame = useGameStore((s) => s.newGame);

  const canStart = name.trim().length > 0;

  return (
    <div className="min-h-svh w-full flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-10">
      <div className="w-full max-w-lg bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">👨‍💻</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Dev Career</h1>
          <p className="text-slate-400 text-sm mt-1">
            Fresh out of college with a CS degree. Build your career, start a studio, and build your life.
          </p>
        </div>

        <label className="block text-sm text-slate-300 mb-1.5">Your name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          maxLength={20}
          className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-violet-500 mb-6"
        />

        <label className="block text-sm text-slate-300 mb-2">Pick your path</label>
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button
            onClick={() => setTrack('software')}
            className={`rounded-2xl border p-4 text-left transition-all ${
              track === 'software'
                ? 'border-violet-500 bg-violet-500/10 ring-1 ring-violet-500'
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
            }`}
          >
            <div className="text-2xl mb-1">💻</div>
            <div className="text-white font-semibold text-sm">Software Developer</div>
            <div className="text-slate-400 text-xs mt-1">Startups &rarr; Big Tech</div>
          </button>
          <button
            onClick={() => setTrack('game')}
            className={`rounded-2xl border p-4 text-left transition-all ${
              track === 'game'
                ? 'border-violet-500 bg-violet-500/10 ring-1 ring-violet-500'
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
            }`}
          >
            <div className="text-2xl mb-1">🎮</div>
            <div className="text-white font-semibold text-sm">Game Developer</div>
            <div className="text-slate-400 text-xs mt-1">Indie &rarr; AAA Studios</div>
          </button>
        </div>

        <button
          disabled={!canStart}
          onClick={() => newGame(name.trim(), track)}
          className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-3.5 transition-colors"
        >
          Start Your Career
        </button>
      </div>
    </div>
  );
}
