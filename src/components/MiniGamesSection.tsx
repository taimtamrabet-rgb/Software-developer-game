import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { MINI_GAMES } from '../data/miniGames';
import { Card, SectionTitle } from './Card';
import { MiniGameModal } from './MiniGameModal';
import { BugSquashGame } from './minigames/BugSquashGame';
import { PatternMatchGame } from './minigames/PatternMatchGame';
import { PitchTimingGame } from './minigames/PitchTimingGame';
import { AdBlitzGame } from './minigames/AdBlitzGame';
import type { MiniGameId } from '../types';

const SKILL_COLORS: Record<string, string> = {
  coding: 'bg-violet-500',
  design: 'bg-indigo-500',
  business: 'bg-teal-500',
  marketing: 'bg-orange-500',
};

interface MiniGamesSectionProps {
  title?: string;
  description?: string;
}

export function MiniGamesSection({
  title = 'Mini-Games',
  description = 'Play a quick game for a skill boost based on your score — free, but costs energy and has a monthly play limit.',
}: MiniGamesSectionProps) {
  const character = useGameStore((s) => s.character)!;
  const playMiniGame = useGameStore((s) => s.playMiniGame);
  const [activeGame, setActiveGame] = useState<MiniGameId | null>(null);

  const activeGameDef = MINI_GAMES.find((g) => g.id === activeGame) ?? null;
  const atWork = !!character.currentJob;

  function handleComplete(score: number) {
    if (!activeGame) return;
    playMiniGame(activeGame, score);
    setActiveGame(null);
  }

  return (
    <Card>
      <SectionTitle>{title}</SectionTitle>
      <p className="text-slate-400 text-sm mb-3">
        {description}
        {atWork && ' Since you\'re on the clock, a strong score also earns a cash bonus.'}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {MINI_GAMES.map((game) => {
          const plays = character.miniGamePlaysThisMonth[game.id] ?? 0;
          const remaining = game.maxPlaysPerMonth - plays;
          const canPlay = remaining > 0 && character.energy >= game.energyCost;
          return (
            <div key={game.id} className="rounded-xl border border-slate-800 bg-slate-800/30 p-3.5">
              <div className="flex items-center justify-between">
                <div className="text-white font-medium text-sm">{game.icon} {game.name}</div>
                <span className={`text-xs px-1.5 py-0.5 rounded ${SKILL_COLORS[game.skill]} bg-opacity-20 text-slate-200 capitalize`}>
                  {game.skill}
                </span>
              </div>
              <div className="text-slate-400 text-xs mt-1">{game.description}</div>
              <div className="flex items-center justify-between mt-2.5 text-xs text-slate-400">
                <span>
                  ⚡{game.energyCost} &middot; {remaining}/{game.maxPlaysPerMonth} left &middot; up to +{game.maxSkillGain} skill
                  {atWork && ' + bonus pay'}
                </span>
              </div>
              <button
                onClick={() => setActiveGame(game.id)}
                disabled={!canPlay}
                className="w-full mt-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs font-semibold py-2 transition-colors"
              >
                Play
              </button>
            </div>
          );
        })}
      </div>

      {activeGameDef && (
        <MiniGameModal title={`${activeGameDef.icon} ${activeGameDef.name}`} onClose={() => setActiveGame(null)}>
          {activeGameDef.id === 'bug-squash' && <BugSquashGame onComplete={handleComplete} />}
          {activeGameDef.id === 'pattern-match' && <PatternMatchGame onComplete={handleComplete} />}
          {activeGameDef.id === 'pitch-timing' && <PitchTimingGame onComplete={handleComplete} />}
          {activeGameDef.id === 'ad-blitz' && <AdBlitzGame onComplete={handleComplete} />}
        </MiniGameModal>
      )}
    </Card>
  );
}
