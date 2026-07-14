import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { formatMoney } from '../utils/format';
import { studioValuation, studioProfitPreview } from '../utils/gameLogic';
import { FOUNDING_COST, FOUNDING_MIN_EXPERIENCE_MONTHS, HIRE_COST, nextStudioTier } from '../data/studio';
import { Card, SectionTitle } from './Card';
import { StatBar } from './StatBar';
import type { StudioType } from '../types';

const STUDIO_TYPE_INFO: { id: StudioType; label: string; icon: string }[] = [
  { id: 'software', label: 'Software Studio', icon: '💻' },
  { id: 'tech', label: 'Tech Startup', icon: '🚀' },
  { id: 'game', label: 'Game Studio', icon: '🎮' },
];

export function StudioPanel() {
  const character = useGameStore((s) => s.character)!;
  const foundStudio = useGameStore((s) => s.foundStudio);
  const hireEmployee = useGameStore((s) => s.hireEmployee);
  const fireEmployee = useGameStore((s) => s.fireEmployee);
  const upgradeStudioTier = useGameStore((s) => s.upgradeStudioTier);
  const sellStudio = useGameStore((s) => s.sellStudio);

  const [studioName, setStudioName] = useState('');
  const [studioType, setStudioType] = useState<StudioType>(character.track === 'game' ? 'game' : 'software');

  if (!character.studio) {
    const canAfford = character.money >= FOUNDING_COST;
    const hasExperience = character.experienceMonths >= FOUNDING_MIN_EXPERIENCE_MONTHS;
    const canFound = canAfford && hasExperience && studioName.trim().length > 0;

    return (
      <Card>
        <SectionTitle>Found Your Own Studio</SectionTitle>
        <p className="text-slate-400 text-sm mb-4">
          Start your own company and grow it from a garage to a global HQ. Requires {formatMoney(FOUNDING_COST)} and{' '}
          {Math.round(FOUNDING_MIN_EXPERIENCE_MONTHS / 12)}+ years of experience. Founding will end your current job.
        </p>

        <label className="block text-sm text-slate-300 mb-1.5">Studio name</label>
        <input
          value={studioName}
          onChange={(e) => setStudioName(e.target.value)}
          placeholder="e.g. Nova Interactive"
          maxLength={24}
          className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-violet-500 mb-4"
        />

        <label className="block text-sm text-slate-300 mb-2">Studio type</label>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {STUDIO_TYPE_INFO.map((t) => (
            <button
              key={t.id}
              onClick={() => setStudioType(t.id)}
              className={`rounded-xl border p-3 text-center transition-all ${
                studioType === t.id
                  ? 'border-violet-500 bg-violet-500/10 ring-1 ring-violet-500'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
              }`}
            >
              <div className="text-xl">{t.icon}</div>
              <div className="text-xs text-slate-300 mt-1">{t.label}</div>
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 mb-3 space-y-1">
          <div className={hasExperience ? 'text-emerald-400' : ''}>
            {hasExperience ? '✓' : '✗'} {Math.round(FOUNDING_MIN_EXPERIENCE_MONTHS / 12)}+ years experience
            ({Math.floor(character.experienceMonths / 12)}y {character.experienceMonths % 12}m so far)
          </div>
          <div className={canAfford ? 'text-emerald-400' : ''}>
            {canAfford ? '✓' : '✗'} {formatMoney(FOUNDING_COST)} in savings
          </div>
        </div>

        <button
          disabled={!canFound}
          onClick={() => foundStudio(studioType, studioName.trim())}
          className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-3 transition-colors"
        >
          Found Studio
        </button>
      </Card>
    );
  }

  const studio = character.studio;
  const next = nextStudioTier(studio.tier);
  const valuation = studioValuation(character);
  const profitPreview = studioProfitPreview(character);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div>
            <div className="text-white font-semibold text-lg">{studio.name}</div>
            <div className="text-slate-400 text-sm">{studio.tierName}</div>
          </div>
          <div className="text-right">
            <div className="text-slate-500 text-xs">Est. valuation</div>
            <div className="text-emerald-400 font-semibold">{formatMoney(valuation)}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-sm">
          <div>
            <div className="text-slate-500 text-xs">Employees</div>
            <div className="text-slate-200 font-semibold">{studio.employees}</div>
          </div>
          <div>
            <div className="text-slate-500 text-xs">Monthly Profit</div>
            <div className={`font-semibold ${profitPreview >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatMoney(profitPreview)}
            </div>
          </div>
          <div>
            <div className="text-slate-500 text-xs">Months Running</div>
            <div className="text-slate-200 font-semibold">{studio.monthsRunning}</div>
          </div>
          <div>
            <div className="text-slate-500 text-xs">Type</div>
            <div className="text-slate-200 font-semibold capitalize">{studio.type}</div>
          </div>
        </div>
        <StatBar label="Studio Reputation" value={studio.reputation} colorClass="bg-sky-500" icon="⭐" />
      </Card>

      <Card>
        <SectionTitle>Manage Team</SectionTitle>
        <div className="flex items-center gap-3">
          <button
            onClick={hireEmployee}
            disabled={character.money < HIRE_COST}
            className="rounded-lg bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-semibold px-4 py-2 transition-colors"
          >
            Hire ({formatMoney(HIRE_COST)})
          </button>
          <button
            onClick={fireEmployee}
            disabled={studio.employees <= 1}
            className="rounded-lg border border-slate-700 hover:border-rose-600 hover:text-rose-300 disabled:opacity-40 text-slate-300 text-sm font-medium px-4 py-2 transition-colors"
          >
            Lay Off
          </button>
        </div>
      </Card>

      {next && (
        <Card>
          <SectionTitle>Grow to {next.name}</SectionTitle>
          <div className="text-sm text-slate-400 mb-3 space-y-1">
            <div className={studio.employees >= next.minEmployees ? 'text-emerald-400' : ''}>
              {studio.employees >= next.minEmployees ? '✓' : '✗'} {next.minEmployees}+ employees
            </div>
            <div className={character.money >= next.upgradeCost ? 'text-emerald-400' : ''}>
              {character.money >= next.upgradeCost ? '✓' : '✗'} {formatMoney(next.upgradeCost)} investment
            </div>
          </div>
          <button
            onClick={upgradeStudioTier}
            disabled={studio.employees < next.minEmployees || character.money < next.upgradeCost}
            className="rounded-lg bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-semibold px-4 py-2 transition-colors"
          >
            Upgrade Studio
          </button>
        </Card>
      )}

      <Card>
        <SectionTitle>Exit</SectionTitle>
        <p className="text-slate-400 text-sm mb-3">
          Sell your studio for its current valuation of {formatMoney(valuation)}. You'll be free to seek employment
          again afterward.
        </p>
        <button
          onClick={sellStudio}
          className="rounded-lg border border-rose-800 text-rose-300 hover:bg-rose-950/50 text-sm font-medium px-4 py-2 transition-colors"
        >
          Sell Studio
        </button>
      </Card>
    </div>
  );
}
