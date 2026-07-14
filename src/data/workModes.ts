import type { WorkMode } from '../types';

export interface WorkModeDef {
  id: WorkMode;
  name: string;
  hours: string;
  description: string;
  salaryMultiplier: number;
  energyCost: number;
  skillMultiplier: number;
  happinessDelta: number;
  reputationDelta: number;
}

export const WORK_MODES: WorkModeDef[] = [
  {
    id: 'standard',
    name: 'Standard Hours',
    hours: '40 hrs/week',
    description: 'A normal, balanced workload.',
    salaryMultiplier: 1,
    energyCost: 7,
    skillMultiplier: 1,
    happinessDelta: 0,
    reputationDelta: 0,
  },
  {
    id: 'overtime',
    name: 'Crunch / Overtime',
    hours: '60+ hrs/week',
    description: 'Grind extra hours for a fat paycheck. Drains energy and happiness fast.',
    salaryMultiplier: 1.5,
    energyCost: 18,
    skillMultiplier: 1.3,
    happinessDelta: -8,
    reputationDelta: 0.3,
  },
  {
    id: 'light',
    name: 'Light Workload',
    hours: '25 hrs/week',
    description: 'Take it easy. Less pay, but you recover energy and stay happy.',
    salaryMultiplier: 0.6,
    energyCost: 3,
    skillMultiplier: 0.6,
    happinessDelta: 5,
    reputationDelta: 0,
  },
  {
    id: 'passion',
    name: 'Passion Project',
    hours: '40 hrs/week + nights',
    description: 'Use company time to build your own skills and name. Lower pay, big growth.',
    salaryMultiplier: 0.8,
    energyCost: 12,
    skillMultiplier: 2,
    happinessDelta: -2,
    reputationDelta: 0.8,
  },
];

export function workModeFor(id: WorkMode): WorkModeDef {
  return WORK_MODES.find((w) => w.id === id) ?? WORK_MODES[0];
}
