import type { Character } from '../types';

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (c: Character, netWorth: number) => boolean;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first-job',
    title: 'First Paycheck',
    description: 'Landed your first job.',
    icon: '💼',
    condition: (c) => c.jobsHeld >= 1,
  },
  {
    id: 'net-worth-10k',
    title: 'Getting Started',
    description: 'Reached $10,000 net worth.',
    icon: '💵',
    condition: (_c, netWorth) => netWorth >= 10000,
  },
  {
    id: 'net-worth-100k',
    title: 'Six Figures',
    description: 'Reached $100,000 net worth.',
    icon: '💰',
    condition: (_c, netWorth) => netWorth >= 100000,
  },
  {
    id: 'net-worth-1m',
    title: 'Millionaire',
    description: 'Reached $1,000,000 net worth.',
    icon: '🤑',
    condition: (_c, netWorth) => netWorth >= 1000000,
  },
  {
    id: 'net-worth-10m',
    title: 'Tech Mogul',
    description: 'Reached $10,000,000 net worth.',
    icon: '👑',
    condition: (_c, netWorth) => netWorth >= 10000000,
  },
  {
    id: 'senior-status',
    title: 'Senior Status',
    description: 'Reached Senior level or higher.',
    icon: '⭐',
    condition: (c) => (c.currentJob?.level ?? 0) >= 3,
  },
  {
    id: 'big-leagues',
    title: 'Big Leagues',
    description: 'Landed a job at a top-tier company.',
    icon: '🏙️',
    condition: (c) => (c.currentJob?.tier ?? 0) >= 4,
  },
  {
    id: 'founder',
    title: 'Founder',
    description: 'Founded your own studio.',
    icon: '🚀',
    condition: (c) => c.studiosFounded >= 1,
  },
  {
    id: 'cashed-out',
    title: 'Cashed Out',
    description: 'Sold a studio.',
    icon: '🏦',
    condition: (c) => c.studiosSold >= 1,
  },
  {
    id: 'serial-founder',
    title: 'Serial Founder',
    description: 'Founded three different studios.',
    icon: '🏭',
    condition: (c) => c.studiosFounded >= 3,
  },
  {
    id: 'homeowner',
    title: 'Homeowner',
    description: 'Bought your first home.',
    icon: '🏠',
    condition: (c) => c.housing.price > 0,
  },
  {
    id: 'nice-ride',
    title: 'Nice Ride',
    description: 'Bought your first car.',
    icon: '🚗',
    condition: (c) => !!c.car,
  },
  {
    id: 'living-large',
    title: 'Living Large',
    description: 'Own a mansion or better.',
    icon: '🏰',
    condition: (c) => c.housing.price >= 2400000,
  },
  {
    id: 'jack-of-all-trades',
    title: 'Jack of All Trades',
    description: 'Reached 50+ in every skill.',
    icon: '🧠',
    condition: (c) => c.skills.coding >= 50 && c.skills.design >= 50 && c.skills.business >= 50 && c.skills.marketing >= 50,
  },
  {
    id: 'retired',
    title: 'Living the Dream',
    description: 'Retired from the industry.',
    icon: '🏆',
    condition: (c) => c.retired,
  },
];

export function checkAchievements(c: Character, netWorth: number): AchievementDef[] {
  const unlocked: AchievementDef[] = [];
  for (const a of ACHIEVEMENTS) {
    if (!c.achievementsUnlocked.includes(a.id) && a.condition(c, netWorth)) {
      c.achievementsUnlocked.push(a.id);
      unlocked.push(a);
    }
  }
  return unlocked;
}
