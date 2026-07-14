import { useGameStore } from '../store/gameStore';
import { formatMoney } from '../utils/format';
import { Card, SectionTitle } from './Card';
import type { Track } from '../types';

export function CareerPanel() {
  const character = useGameStore((s) => s.character)!;
  const offers = useGameStore((s) => s.currentJobOffers);
  const applyToJob = useGameStore((s) => s.applyToJob);
  const quitJob = useGameStore((s) => s.quitJob);
  const switchTrack = useGameStore((s) => s.switchTrack);
  const refreshJobOffers = useGameStore((s) => s.refreshJobOffers);

  const hasStudio = !!character.studio;
  const otherTrack: Track = character.track === 'software' ? 'game' : 'software';

  return (
    <div className="flex flex-col gap-4">
      {character.currentJob && (
        <Card>
          <SectionTitle>Current Job</SectionTitle>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-white font-semibold">{character.currentJob.title}</div>
              <div className="text-slate-400 text-sm">
                {character.currentJob.companyName} &middot; {character.currentJob.tierName}
              </div>
              <div className="text-emerald-400 text-sm font-medium mt-1">
                {formatMoney(character.currentJob.salary)}/mo
              </div>
            </div>
            <button
              onClick={quitJob}
              className="rounded-lg border border-rose-800 text-rose-300 hover:bg-rose-950/50 text-sm font-medium px-3 py-2 transition-colors"
            >
              Quit
            </button>
          </div>
        </Card>
      )}

      {hasStudio && (
        <Card>
          <div className="text-sm text-slate-400">
            You're running your own studio full-time. Sell it from the Studio tab if you want to return to employment.
          </div>
        </Card>
      )}

      {!hasStudio && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <SectionTitle>
              Job Market &middot; {character.track === 'software' ? 'Software' : 'Game'} Dev
            </SectionTitle>
            <button
              onClick={refreshJobOffers}
              className="text-xs text-violet-400 hover:text-violet-300 shrink-0"
            >
              ↻ Refresh
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {offers.map((offer) => (
              <div key={offer.id} className="rounded-xl border border-slate-800 bg-slate-800/30 p-3.5">
                <div className="text-white font-medium text-sm">{offer.title}</div>
                <div className="text-slate-400 text-xs">{offer.companyName} &middot; {offer.tierName}</div>
                <div className="flex items-center justify-between mt-2.5">
                  <span className="text-emerald-400 text-sm font-semibold">{formatMoney(offer.salary)}/mo</span>
                  <button
                    onClick={() => applyToJob(offer.id)}
                    className="rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold px-3 py-1.5 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <SectionTitle>Career Switch</SectionTitle>
        <p className="text-slate-400 text-sm mb-3">
          Retrain to become a {otherTrack === 'software' ? 'software' : 'game'} developer. Costs $5,000 and 30 energy,
          and resets some of your career experience.
        </p>
        <button
          onClick={() => switchTrack(otherTrack)}
          disabled={character.money < 5000}
          className="rounded-lg border border-slate-700 hover:border-violet-500 hover:text-violet-300 disabled:opacity-40 disabled:hover:border-slate-700 disabled:hover:text-inherit text-slate-300 text-sm font-medium px-4 py-2 transition-colors"
        >
          Switch to {otherTrack === 'software' ? 'Software Development' : 'Game Development'}
        </button>
      </Card>
    </div>
  );
}
