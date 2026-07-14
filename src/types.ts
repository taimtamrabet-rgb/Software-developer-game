export type Track = 'software' | 'game';
export type StudioType = 'software' | 'game' | 'tech';

export interface JobTier {
  tier: number;
  track: Track;
  name: string;
  minExperienceMonths: number;
  minSkill: number;
  baseSalary: number;
  companyNames: string[];
}

export interface TitleLevel {
  level: number;
  title: string;
  minMonthsAtTier: number;
  salaryMultiplier: number;
}

export type WorkMode = 'standard' | 'overtime' | 'light' | 'passion';

export interface CurrentJob {
  track: Track;
  tier: number;
  tierName: string;
  companyName: string;
  title: string;
  level: number;
  salary: number;
  monthsAtJob: number;
  monthsAtTier: number;
  workMode: WorkMode;
}

export interface JobOffer {
  id: string;
  track: Track;
  tier: number;
  tierName: string;
  companyName: string;
  title: string;
  level: number;
  salary: number;
}

export interface HousingOption {
  id: string;
  name: string;
  price: number;
  monthlyCost: number;
  happinessBonus: number;
  minMoneyToBuy: number;
}

export interface CarOption {
  id: string;
  name: string;
  price: number;
  monthlyCost: number;
  happinessBonus: number;
}

export interface Course {
  id: string;
  name: string;
  skill: SkillName;
  cost: number;
  energyCost: number;
  skillGain: number;
  description: string;
}

export type SkillName = 'coding' | 'design' | 'business' | 'marketing';

export interface Skills {
  coding: number;
  design: number;
  business: number;
  marketing: number;
}

export interface StudioProjectInstance {
  templateId: string;
  name: string;
  totalMonths: number;
  monthsRemaining: number;
  cost: number;
  baseProfit: number;
  viralChance: number;
  viralMultiplierMin: number;
  viralMultiplierMax: number;
}

export interface StudioState {
  type: StudioType;
  name: string;
  tier: number;
  tierName: string;
  employees: number;
  reputation: number;
  monthsRunning: number;
  cashBuffer: number;
  lastMonthProfit: number;
  activeProject: StudioProjectInstance | null;
  projectsCompleted: number;
}

export interface GameEvent {
  id: string;
  month: number;
  text: string;
  kind: 'good' | 'bad' | 'neutral' | 'achievement';
}

export type MiniGameId = 'bug-squash' | 'pattern-match' | 'pitch-timing' | 'ad-blitz';

export interface DecisionOptionMeta {
  id: string;
  label: string;
  hint?: string;
}

export interface PendingDecision {
  decisionId: string;
  title: string;
  description: string;
  options: DecisionOptionMeta[];
}

export interface Character {
  name: string;
  track: Track;
  age: number;
  monthsElapsed: number;
  money: number;
  energy: number;
  happiness: number;
  experienceMonths: number;
  skills: Skills;
  reputation: number;
  currentJob: CurrentJob | null;
  housing: HousingOption;
  car: CarOption | null;
  studio: StudioState | null;
  retired: boolean;
  eventLog: GameEvent[];
  jobsHeld: number;
  studiosFounded: number;
  studiosSold: number;
  peakNetWorth: number;
  miniGamePlaysThisMonth: Partial<Record<MiniGameId, number>>;
  practicePlaysThisMonth: Partial<Record<SkillName, number>>;
  redeemedCodes: string[];
  achievementsUnlocked: string[];
  pendingDecision: PendingDecision | null;
}

export interface GameState {
  character: Character | null;
  currentJobOffers: JobOffer[];
}
