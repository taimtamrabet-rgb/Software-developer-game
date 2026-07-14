import type { MiniGameId, SkillName } from '../types';

export interface MiniGameDef {
  id: MiniGameId;
  name: string;
  skill: SkillName;
  icon: string;
  description: string;
  energyCost: number;
  maxPlaysPerMonth: number;
  minSkillGain: number;
  maxSkillGain: number;
}

export const MINI_GAMES: MiniGameDef[] = [
  {
    id: 'bug-squash',
    name: 'Bug Squash',
    skill: 'coding',
    icon: '🐛',
    description: 'Click the bugs before they scurry off. Tests your reflexes as a developer.',
    energyCost: 12,
    maxPlaysPerMonth: 3,
    minSkillGain: 1,
    maxSkillGain: 6,
  },
  {
    id: 'pattern-match',
    name: 'Pattern Match',
    skill: 'design',
    icon: '🎨',
    description: 'Memorize and repeat the color sequence. Tests your visual design memory.',
    energyCost: 12,
    maxPlaysPerMonth: 3,
    minSkillGain: 1,
    maxSkillGain: 6,
  },
  {
    id: 'pitch-timing',
    name: 'Pitch Perfect',
    skill: 'business',
    icon: '📈',
    description: 'Stop the meter in the sweet spot to nail your investor pitch.',
    energyCost: 12,
    maxPlaysPerMonth: 3,
    minSkillGain: 1,
    maxSkillGain: 6,
  },
  {
    id: 'ad-blitz',
    name: 'Ad Blitz',
    skill: 'marketing',
    icon: '📣',
    description: 'Tap the on-brand ads before the off-brand ones sneak past.',
    energyCost: 12,
    maxPlaysPerMonth: 3,
    minSkillGain: 1,
    maxSkillGain: 6,
  },
];

export function miniGameFor(id: MiniGameId): MiniGameDef {
  return MINI_GAMES.find((g) => g.id === id) ?? MINI_GAMES[0];
}
