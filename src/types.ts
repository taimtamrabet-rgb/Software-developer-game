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
}

export interface GameEvent {
  id: string;
  month: number;
  text: string;
  kind: 'good' | 'bad' | 'neutral';
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
}

export interface GameState {
  character: Character | null;
  currentJobOffers: JobOffer[];
}
