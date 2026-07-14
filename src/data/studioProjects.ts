import type { StudioType } from '../types';

export interface StudioProjectTemplate {
  id: string;
  name: string;
  studioType: StudioType;
  icon: string;
  description: string;
  durationMonths: number;
  cost: number;
  baseProfit: number;
  viralChance: number;
  viralMultiplierMin: number;
  viralMultiplierMax: number;
}

export const STUDIO_PROJECTS: StudioProjectTemplate[] = [
  // Game studio projects
  {
    id: 'sandbox-game',
    name: 'Sandbox Game',
    studioType: 'game',
    icon: '🧱',
    description: 'An open-ended building/survival game. Low risk, but can go massively viral.',
    durationMonths: 4,
    cost: 30000,
    baseProfit: 45000,
    viralChance: 0.22,
    viralMultiplierMin: 3,
    viralMultiplierMax: 7,
  },
  {
    id: 'battle-royale',
    name: 'Battle Royale Arena',
    studioType: 'game',
    icon: '🎯',
    description: 'A competitive multiplayer shooter. High cost, high reward if it pops off.',
    durationMonths: 7,
    cost: 90000,
    baseProfit: 110000,
    viralChance: 0.16,
    viralMultiplierMin: 3,
    viralMultiplierMax: 8,
  },
  {
    id: 'narrative-adventure',
    name: 'Narrative Adventure',
    studioType: 'game',
    icon: '📖',
    description: 'A story-driven single-player game. Steady, reliable profit.',
    durationMonths: 5,
    cost: 40000,
    baseProfit: 55000,
    viralChance: 0.12,
    viralMultiplierMin: 2,
    viralMultiplierMax: 4,
  },
  {
    id: 'mobile-puzzle',
    name: 'Mobile Puzzle Game',
    studioType: 'game',
    icon: '🧩',
    description: 'A quick, cheap mobile release. Fast turnaround, modest upside.',
    durationMonths: 2,
    cost: 12000,
    baseProfit: 16000,
    viralChance: 0.18,
    viralMultiplierMin: 2,
    viralMultiplierMax: 5,
  },
  // Software studio projects
  {
    id: 'productivity-saas',
    name: 'Productivity SaaS',
    studioType: 'software',
    icon: '📊',
    description: 'A subscription tool for teams. Reliable recurring-style payout.',
    durationMonths: 4,
    cost: 35000,
    baseProfit: 50000,
    viralChance: 0.14,
    viralMultiplierMin: 2,
    viralMultiplierMax: 4,
  },
  {
    id: 'consumer-mobile-app',
    name: 'Consumer Mobile App',
    studioType: 'software',
    icon: '📱',
    description: 'A snappy consumer app chasing app-store charts. Can go viral fast.',
    durationMonths: 3,
    cost: 20000,
    baseProfit: 26000,
    viralChance: 0.2,
    viralMultiplierMin: 3,
    viralMultiplierMax: 6,
  },
  {
    id: 'enterprise-platform',
    name: 'Enterprise Platform',
    studioType: 'software',
    icon: '🏛️',
    description: 'A big-ticket B2B contract. Slow, expensive, but a huge guaranteed payout.',
    durationMonths: 8,
    cost: 120000,
    baseProfit: 160000,
    viralChance: 0.05,
    viralMultiplierMin: 1.5,
    viralMultiplierMax: 2.5,
  },
  {
    id: 'dev-tool-plugin',
    name: 'Dev Tool Plugin',
    studioType: 'software',
    icon: '🔌',
    description: 'A niche developer tool. Cheap and quick, low ceiling.',
    durationMonths: 2,
    cost: 10000,
    baseProfit: 13000,
    viralChance: 0.15,
    viralMultiplierMin: 2,
    viralMultiplierMax: 4,
  },
  // Tech startup projects
  {
    id: 'social-network-app',
    name: 'Social Network App',
    studioType: 'tech',
    icon: '💬',
    description: 'A social app chasing network effects. Extremely high viral upside.',
    durationMonths: 6,
    cost: 70000,
    baseProfit: 85000,
    viralChance: 0.2,
    viralMultiplierMin: 3,
    viralMultiplierMax: 9,
  },
  {
    id: 'fintech-app',
    name: 'Fintech App',
    studioType: 'tech',
    icon: '💳',
    description: 'A finance product with regulatory overhead. Slow, steady, dependable.',
    durationMonths: 6,
    cost: 80000,
    baseProfit: 100000,
    viralChance: 0.08,
    viralMultiplierMin: 1.5,
    viralMultiplierMax: 3,
  },
  {
    id: 'ai-assistant-product',
    name: 'AI Assistant Product',
    studioType: 'tech',
    icon: '🤖',
    description: 'A hyped-up AI product. Trendy, risky, potentially explosive.',
    durationMonths: 5,
    cost: 60000,
    baseProfit: 70000,
    viralChance: 0.25,
    viralMultiplierMin: 3,
    viralMultiplierMax: 10,
  },
  {
    id: 'marketplace-platform',
    name: 'Marketplace Platform',
    studioType: 'tech',
    icon: '🛒',
    description: 'A two-sided marketplace. Takes time to catch on, but scales well.',
    durationMonths: 7,
    cost: 65000,
    baseProfit: 80000,
    viralChance: 0.13,
    viralMultiplierMin: 2,
    viralMultiplierMax: 5,
  },
];

export function projectsForStudioType(type: StudioType): StudioProjectTemplate[] {
  return STUDIO_PROJECTS.filter((p) => p.studioType === type);
}
