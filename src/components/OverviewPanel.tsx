import { useGameStore } from '../store/gameStore';
import { formatMoney } from '../utils/format';
import { computeNetWorth } from '../utils/gameLogic';
import { Card, SectionTitle } from './Card';
import { StatBar } from './StatBar';

export function OverviewPanel() {
  const character = useGameStore((s) => s.character)!;
  const netWorth = computeNetWorth(character);
  const years = Math.floor(character.experienceMonths / 12);
  const months = character.experienceMonths % 12;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <SectionTitle>Status</SectionTitle>
        {character.studio ? (
          <div>
            <div className="text-white font-semibold">{character.studio.name}</div>
            <div className="text-slate-400 text-sm">
              {character.studio.tierName} &middot; Founder &amp; CEO
            </div>
          </div>
        ) : character.currentJob ? (
          <div>
            <div className="text-white font-semibold">{character.currentJob.title}</div>
            <div className="text-slate-400 text-sm">
              {character.currentJob.companyName} &middot; {character.currentJob.tierName}
            </div>
          </div>
        ) : (
          <div className="text-slate-400 text-sm">Unemployed &mdash; check the Career tab for job offers.</div>
        )}
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-slate-500 text-xs">Net Worth</div>
            <div className="text-emerald-400 font-semibold tabular-nums">{formatMoney(netWorth)}</div>
          </div>
          <div>
            <div className="text-slate-500 text-xs">Experience</div>
            <div className="text-slate-200 font-semibold">{years}y {months}m</div>
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle>Wellbeing</SectionTitle>
        <div className="flex flex-col gap-3">
          <StatBar label="Energy" value={character.energy} colorClass="bg-amber-500" icon="⚡" />
          <StatBar label="Happiness" value={character.happiness} colorClass="bg-pink-500" icon="😊" />
          <StatBar label="Reputation" value={character.reputation} colorClass="bg-sky-500" icon="⭐" />
        </div>
      </Card>

      <Card>
        <SectionTitle>Skills</SectionTitle>
        <div className="flex flex-col gap-3">
          <StatBar label="Coding" value={character.skills.coding} colorClass="bg-violet-500" />
          <StatBar label="Design" value={character.skills.design} colorClass="bg-indigo-500" />
          <StatBar label="Business" value={character.skills.business} colorClass="bg-teal-500" />
          <StatBar label="Marketing" value={character.skills.marketing} colorClass="bg-orange-500" />
        </div>
      </Card>

      <Card>
        <SectionTitle>Life</SectionTitle>
        <div className="text-sm text-slate-300 space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500">Home</span>
            <span>{character.housing.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Car</span>
            <span>{character.car ? character.car.name : 'None'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Jobs Held</span>
            <span>{character.jobsHeld}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Studios Founded</span>
            <span>{character.studiosFounded}</span>
          </div>
        </div>
      </Card>

      <Card className="sm:col-span-2">
        <SectionTitle>Recent Events</SectionTitle>
        {character.eventLog.length === 0 ? (
          <div className="text-slate-500 text-sm">Nothing has happened yet. Advance the month to begin!</div>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {character.eventLog.slice(0, 12).map((e) => (
              <li
                key={e.id}
                className={`text-sm rounded-lg px-3 py-2 border ${
                  e.kind === 'good'
                    ? 'border-emerald-900 bg-emerald-950/40 text-emerald-200'
                    : e.kind === 'bad'
                    ? 'border-rose-900 bg-rose-950/40 text-rose-200'
                    : 'border-slate-800 bg-slate-800/30 text-slate-300'
                }`}
              >
                {e.text}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
