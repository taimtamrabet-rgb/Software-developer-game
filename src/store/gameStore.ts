import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Character, GameEvent, JobOffer, MiniGameId, SkillName, StudioType, Track, WorkMode,
} from '../types';
import { tiersFor, titleForMonthsAtTier, highestUnlockedTier } from '../data/companies';
import { HOUSING_OPTIONS, CAR_OPTIONS } from '../data/assets';
import { COURSES } from '../data/courses';
import { maybeTriggerEvent } from '../data/events';
import { miniGameFor } from '../data/miniGames';
import { workModeFor } from '../data/workModes';
import { STUDIO_PROJECTS } from '../data/studioProjects';
import {
  STUDIO_TIERS, FOUNDING_COST, FOUNDING_MIN_EXPERIENCE_MONTHS, HIRE_COST,
  nextStudioTier,
} from '../data/studio';
import { clamp, computeNetWorth, studioValuation, studioProfitPreview } from '../utils/gameLogic';

const START_YEAR = 2026;
const MAX_LOG = 30;

const PRACTICE_ENERGY_COST = 10;
const PRACTICE_SKILL_GAIN = 2;
const PRACTICE_MAX_PER_MONTH = 3;

function relevantSkillFor(track: Track, skills: Character['skills']): number {
  return track === 'software' ? skills.coding : skills.design;
}

function studioMatchesTrack(track: Track, type: StudioType): boolean {
  return track === 'game' ? type === 'game' : type === 'software' || type === 'tech';
}

function generateOffers(c: Character): JobOffer[] {
  const tiers = tiersFor(c.track);
  const relevantSkill = relevantSkillFor(c.track, c.skills);
  const maxTier = highestUnlockedTier(c.track, c.experienceMonths, relevantSkill).tier;
  const offers: JobOffer[] = [];
  const count = 4;
  for (let i = 0; i < count; i++) {
    let tierNum = maxTier;
    if (Math.random() < 0.35 && tierNum > 1) tierNum -= 1;
    const tierDef = tiers.find((t) => t.tier === tierNum) ?? tiers[0];
    const company = tierDef.companyNames[Math.floor(Math.random() * tierDef.companyNames.length)];
    const monthsAtTierGuess = Math.max(0, Math.min(30, c.experienceMonths - tierDef.minExperienceMonths));
    const titleLevel = titleForMonthsAtTier(monthsAtTierGuess);
    const salary = Math.round(tierDef.baseSalary * titleLevel.salaryMultiplier * (0.92 + Math.random() * 0.22));
    offers.push({
      id: `${tierDef.tier}-${i}-${Math.random().toString(36).slice(2, 8)}`,
      track: c.track,
      tier: tierDef.tier,
      tierName: tierDef.name,
      companyName: company,
      title: titleLevel.title,
      level: titleLevel.level,
      salary,
    });
  }
  return offers;
}

function pushEvent(c: Character, text: string, kind: GameEvent['kind']) {
  const event: GameEvent = {
    id: `${c.monthsElapsed}-${Math.random().toString(36).slice(2, 8)}`,
    month: c.monthsElapsed,
    text,
    kind,
  };
  c.eventLog = [event, ...c.eventLog].slice(0, MAX_LOG);
}

interface GameStore {
  character: Character | null;
  currentJobOffers: JobOffer[];
  startYear: number;
  newGame: (name: string, track: Track) => void;
  resetGame: () => void;
  refreshJobOffers: () => void;
  applyToJob: (offerId: string) => void;
  quitJob: () => void;
  setWorkMode: (mode: WorkMode) => void;
  switchTrack: (track: Track) => void;
  takeCourse: (courseId: string) => void;
  practiceSkill: (skill: SkillName) => void;
  playMiniGame: (id: MiniGameId, score: number) => void;
  buyHouse: (houseId: string) => void;
  sellHouse: () => void;
  buyCar: (carId: string) => void;
  sellCar: () => void;
  foundStudio: (type: StudioType, name: string) => void;
  hireEmployee: () => void;
  fireEmployee: () => void;
  upgradeStudioTier: () => void;
  startStudioProject: (templateId: string) => void;
  sellStudio: () => void;
  retire: () => void;
  advanceMonth: () => void;
}

function freshCharacter(name: string, track: Track): Character {
  return {
    name,
    track,
    age: 22,
    monthsElapsed: 0,
    money: 4000,
    energy: 85,
    happiness: 65,
    experienceMonths: 0,
    skills: { coding: track === 'software' ? 15 : 8, design: track === 'game' ? 15 : 8, business: 5, marketing: 5 },
    reputation: 10,
    currentJob: null,
    housing: HOUSING_OPTIONS[0],
    car: null,
    studio: null,
    retired: false,
    eventLog: [],
    jobsHeld: 0,
    studiosFounded: 0,
    studiosSold: 0,
    peakNetWorth: 4000,
    miniGamePlaysThisMonth: {},
    practicePlaysThisMonth: {},
  };
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      character: null,
      currentJobOffers: [],
      startYear: START_YEAR,

      newGame: (name, track) => {
        const character = freshCharacter(name, track);
        set({ character, currentJobOffers: generateOffers(character) });
      },

      resetGame: () => set({ character: null, currentJobOffers: [] }),

      refreshJobOffers: () => {
        const c = get().character;
        if (!c) return;
        set({ currentJobOffers: generateOffers(c) });
      },

      applyToJob: (offerId) => {
        const state = get();
        if (!state.character) return;
        const offer = state.currentJobOffers.find((o) => o.id === offerId);
        if (!offer) return;
        const c: Character = structuredClone(state.character);
        if (c.studio) return; // must sell studio first
        c.currentJob = {
          track: offer.track,
          tier: offer.tier,
          tierName: offer.tierName,
          companyName: offer.companyName,
          title: offer.title,
          level: offer.level,
          salary: offer.salary,
          monthsAtJob: 0,
          monthsAtTier: 0,
          workMode: 'standard',
        };
        c.jobsHeld += 1;
        pushEvent(c, `You accepted a ${offer.title} position at ${offer.companyName}.`, 'good');
        set({ character: c, currentJobOffers: generateOffers(c) });
      },

      quitJob: () => {
        const state = get();
        if (!state.character || !state.character.currentJob) return;
        const c: Character = structuredClone(state.character);
        pushEvent(c, `You quit your job at ${c.currentJob!.companyName}.`, 'neutral');
        c.currentJob = null;
        c.reputation = clamp(c.reputation - 2);
        set({ character: c, currentJobOffers: generateOffers(c) });
      },

      setWorkMode: (mode) => {
        const state = get();
        if (!state.character || !state.character.currentJob) return;
        const c: Character = structuredClone(state.character);
        c.currentJob!.workMode = mode;
        set({ character: c });
      },

      switchTrack: (track) => {
        const state = get();
        if (!state.character) return;
        const c: Character = structuredClone(state.character);
        if (c.track === track) return;
        if (c.money < 5000) return;
        c.money -= 5000;
        c.energy = clamp(c.energy - 30);
        c.experienceMonths = Math.round(c.experienceMonths * 0.5);
        c.track = track;
        pushEvent(c, `You retrained and switched careers to become a ${track === 'software' ? 'software' : 'game'} developer.`, 'neutral');
        set({ character: c, currentJobOffers: generateOffers(c) });
      },

      takeCourse: (courseId) => {
        const state = get();
        if (!state.character) return;
        const course = COURSES.find((co) => co.id === courseId);
        if (!course) return;
        const c: Character = structuredClone(state.character);
        if (c.money < course.cost || c.energy < course.energyCost) return;
        c.money -= course.cost;
        c.energy = clamp(c.energy - course.energyCost);
        c.skills[course.skill as SkillName] = clamp(c.skills[course.skill as SkillName] + course.skillGain);
        pushEvent(c, `You completed "${course.name}", improving your ${course.skill} skill.`, 'good');
        set({ character: c, currentJobOffers: generateOffers(c) });
      },

      practiceSkill: (skill) => {
        const state = get();
        if (!state.character) return;
        const c: Character = structuredClone(state.character);
        const plays = c.practicePlaysThisMonth[skill] ?? 0;
        if (plays >= PRACTICE_MAX_PER_MONTH || c.energy < PRACTICE_ENERGY_COST) return;
        c.energy = clamp(c.energy - PRACTICE_ENERGY_COST);
        c.skills[skill] = clamp(c.skills[skill] + PRACTICE_SKILL_GAIN);
        c.practicePlaysThisMonth[skill] = plays + 1;
        set({ character: c });
      },

      playMiniGame: (id, score) => {
        const state = get();
        if (!state.character) return;
        const def = miniGameFor(id);
        const c: Character = structuredClone(state.character);
        const plays = c.miniGamePlaysThisMonth[id] ?? 0;
        if (plays >= def.maxPlaysPerMonth || c.energy < def.energyCost) return;
        const clampedScore = Math.max(0, Math.min(100, score));
        const gain = Math.round(def.minSkillGain + (def.maxSkillGain - def.minSkillGain) * (clampedScore / 100));
        c.energy = clamp(c.energy - def.energyCost);
        c.skills[def.skill] = clamp(c.skills[def.skill] + gain);
        c.miniGamePlaysThisMonth[id] = plays + 1;
        pushEvent(c, `You scored ${clampedScore}% in ${def.name}, gaining +${gain} ${def.skill}.`, gain >= 4 ? 'good' : 'neutral');
        set({ character: c });
      },

      buyHouse: (houseId) => {
        const state = get();
        if (!state.character) return;
        const target = HOUSING_OPTIONS.find((h) => h.id === houseId);
        if (!target) return;
        const c: Character = structuredClone(state.character);
        if (target.price === 0) {
          c.housing = target;
        } else {
          if (c.money < target.price) return;
          if (c.housing.price > 0) c.money += Math.round(c.housing.price * 0.7);
          c.money -= target.price;
          c.housing = target;
        }
        pushEvent(c, `You moved into: ${target.name}.`, 'neutral');
        set({ character: c });
      },

      sellHouse: () => {
        const state = get();
        if (!state.character || state.character.housing.price === 0) return;
        const c: Character = structuredClone(state.character);
        c.money += Math.round(c.housing.price * 0.7);
        pushEvent(c, `You sold your home: ${c.housing.name}.`, 'neutral');
        c.housing = HOUSING_OPTIONS[0];
        set({ character: c });
      },

      buyCar: (carId) => {
        const state = get();
        if (!state.character) return;
        const target = CAR_OPTIONS.find((cc) => cc.id === carId);
        if (!target) return;
        const c: Character = structuredClone(state.character);
        if (c.car) c.money += Math.round(c.car.price * 0.65);
        if (c.money < target.price) return;
        c.money -= target.price;
        c.car = target;
        pushEvent(c, `You bought a ${target.name}.`, 'neutral');
        set({ character: c });
      },

      sellCar: () => {
        const state = get();
        if (!state.character || !state.character.car) return;
        const c: Character = structuredClone(state.character);
        const oldCar = c.car!;
        c.money += Math.round(oldCar.price * 0.65);
        pushEvent(c, `You sold your ${oldCar.name}.`, 'neutral');
        c.car = null;
        set({ character: c });
      },

      foundStudio: (type, name) => {
        const state = get();
        if (!state.character) return;
        const c: Character = structuredClone(state.character);
        if (c.money < FOUNDING_COST || c.experienceMonths < FOUNDING_MIN_EXPERIENCE_MONTHS || c.studio) return;
        c.money -= FOUNDING_COST;
        c.currentJob = null;
        const matches = studioMatchesTrack(c.track, type);
        c.studio = {
          type,
          name,
          tier: 1,
          tierName: STUDIO_TIERS[0].name,
          employees: 1,
          reputation: matches ? 45 : 35,
          monthsRunning: 0,
          cashBuffer: 0,
          lastMonthProfit: 0,
          activeProject: null,
          projectsCompleted: 0,
        };
        c.studiosFounded += 1;
        pushEvent(
          c,
          matches
            ? `You founded your own studio: ${name}! Your background gives you a head start.`
            : `You founded your own studio: ${name}, branching into a new field from your career background.`,
          'good',
        );
        set({ character: c, currentJobOffers: generateOffers(c) });
      },

      hireEmployee: () => {
        const state = get();
        if (!state.character || !state.character.studio) return;
        const c: Character = structuredClone(state.character);
        if (c.money < HIRE_COST) return;
        c.money -= HIRE_COST;
        c.studio!.employees += 1;
        pushEvent(c, `You hired a new employee. Team size: ${c.studio!.employees}.`, 'neutral');
        set({ character: c });
      },

      fireEmployee: () => {
        const state = get();
        if (!state.character || !state.character.studio) return;
        const c: Character = structuredClone(state.character);
        if (c.studio!.employees <= 1) return;
        c.studio!.employees -= 1;
        c.studio!.reputation = clamp(c.studio!.reputation - 2);
        pushEvent(c, `You let an employee go. Team size: ${c.studio!.employees}.`, 'bad');
        set({ character: c });
      },

      upgradeStudioTier: () => {
        const state = get();
        if (!state.character || !state.character.studio) return;
        const c: Character = structuredClone(state.character);
        const next = nextStudioTier(c.studio!.tier);
        if (!next) return;
        if (c.studio!.employees < next.minEmployees || c.money < next.upgradeCost) return;
        c.money -= next.upgradeCost;
        c.studio!.tier = next.tier;
        c.studio!.tierName = next.name;
        pushEvent(c, `Your studio grew into a ${next.name}!`, 'good');
        set({ character: c });
      },

      startStudioProject: (templateId) => {
        const state = get();
        if (!state.character || !state.character.studio) return;
        if (state.character.studio.activeProject) return;
        const template = STUDIO_PROJECTS.find((p) => p.id === templateId);
        if (!template) return;
        const c: Character = structuredClone(state.character);
        if (c.money < template.cost) return;
        c.money -= template.cost;
        c.studio!.activeProject = {
          templateId: template.id,
          name: template.name,
          totalMonths: template.durationMonths,
          monthsRemaining: template.durationMonths,
          cost: template.cost,
          baseProfit: template.baseProfit,
          viralChance: template.viralChance,
          viralMultiplierMin: template.viralMultiplierMin,
          viralMultiplierMax: template.viralMultiplierMax,
        };
        pushEvent(c, `Your studio started development on "${template.name}".`, 'neutral');
        set({ character: c });
      },

      sellStudio: () => {
        const state = get();
        if (!state.character || !state.character.studio) return;
        const c: Character = structuredClone(state.character);
        const valuation = studioValuation(c);
        c.money += valuation;
        c.studiosSold += 1;
        c.reputation = clamp(c.reputation + 10);
        pushEvent(c, `You sold ${c.studio!.name} for ${valuation.toLocaleString()}!`, 'good');
        c.studio = null;
        set({ character: c, currentJobOffers: generateOffers(c) });
      },

      retire: () => {
        const state = get();
        if (!state.character) return;
        const c: Character = structuredClone(state.character);
        c.retired = true;
        pushEvent(c, `${c.name} retired from the industry.`, 'neutral');
        set({ character: c });
      },

      advanceMonth: () => {
        const state = get();
        if (!state.character || state.character.retired) return;
        const c: Character = structuredClone(state.character);

        c.monthsElapsed += 1;
        c.age = 22 + Math.floor(c.monthsElapsed / 12);
        c.miniGamePlaysThisMonth = {};
        c.practicePlaysThisMonth = {};

        if (c.currentJob) {
          const mode = workModeFor(c.currentJob.workMode);
          const pay = Math.round(c.currentJob.salary * mode.salaryMultiplier);
          c.money += pay;
          c.experienceMonths += 1;
          c.currentJob.monthsAtJob += 1;
          c.currentJob.monthsAtTier += 1;
          const skillKey: SkillName = c.track === 'software' ? 'coding' : 'design';
          c.skills[skillKey] = clamp(c.skills[skillKey] + (1 + Math.random()) * mode.skillMultiplier);
          c.skills.business = clamp(c.skills.business + Math.random() * 0.4 * mode.skillMultiplier);
          c.reputation = clamp(c.reputation + 0.5 + mode.reputationDelta);
          c.energy = clamp(c.energy - mode.energyCost);
          c.happiness = clamp(c.happiness + mode.happinessDelta);

          const newTitle = titleForMonthsAtTier(c.currentJob.monthsAtTier);
          if (newTitle.level > c.currentJob.level) {
            const tierDef = tiersFor(c.currentJob.track).find((t) => t.tier === c.currentJob!.tier);
            c.currentJob.level = newTitle.level;
            c.currentJob.title = newTitle.title;
            if (tierDef) c.currentJob.salary = Math.round(tierDef.baseSalary * newTitle.salaryMultiplier);
            pushEvent(c, `You were promoted to ${newTitle.title} at ${c.currentJob.companyName}!`, 'good');
          }
        } else if (!c.studio) {
          c.happiness = clamp(c.happiness - 6);
          c.energy = clamp(c.energy + 8);
        }

        if (c.studio) {
          const profit = studioProfitPreview(c);
          c.money += profit;
          c.studio.lastMonthProfit = profit;
          c.studio.monthsRunning += 1;
          c.studio.reputation = clamp(c.studio.reputation + (profit > 0 ? 0.6 : -0.8));
          c.experienceMonths += 1;
          c.skills.business = clamp(c.skills.business + 0.8);
          c.energy = clamp(c.energy - 5);

          if (c.studio.activeProject) {
            c.studio.activeProject.monthsRemaining -= 1;
            if (c.studio.activeProject.monthsRemaining <= 0) {
              const proj = c.studio.activeProject;
              const isViral = Math.random() < proj.viralChance;
              const randomFactor = 0.85 + Math.random() * 0.3;
              const multiplier = isViral
                ? proj.viralMultiplierMin + Math.random() * (proj.viralMultiplierMax - proj.viralMultiplierMin)
                : randomFactor;
              const payout = Math.round(proj.baseProfit * multiplier);
              c.money += payout;
              c.studio.projectsCompleted += 1;
              c.studio.reputation = clamp(c.studio.reputation + (isViral ? 15 : 4));
              pushEvent(
                c,
                isViral
                  ? `"${proj.name}" went VIRAL! Your studio earned ${payout.toLocaleString()}!`
                  : `"${proj.name}" launched and earned ${payout.toLocaleString()}.`,
                isViral ? 'good' : 'neutral',
              );
              c.studio.activeProject = null;
            }
          }
        }

        const livingCost = 500;
        c.money -= c.housing.monthlyCost + (c.car?.monthlyCost ?? 0) + livingCost;

        const targetHappiness = 50 + c.housing.happinessBonus * 0.3 + (c.car?.happinessBonus ?? 0) * 0.3 + (c.energy - 50) * 0.15;
        c.happiness = clamp(c.happiness + (targetHappiness - c.happiness) * 0.12);
        c.energy = clamp(c.energy + 9);

        const event = maybeTriggerEvent(c);
        if (event && event.text) pushEvent(c, event.text, event.kind);

        if (c.money < 0) {
          c.happiness = clamp(c.happiness - 8);
        }

        c.peakNetWorth = Math.max(c.peakNetWorth, computeNetWorth(c));

        if (c.age >= 75) {
          c.retired = true;
          pushEvent(c, `${c.name} reached 75 and retired from the industry.`, 'neutral');
        }

        set({ character: c, currentJobOffers: generateOffers(c) });
      },
    }),
    {
      name: 'dev-career-game-save',
      version: 2,
      migrate: (persistedState) => {
        const state = persistedState as GameStore;
        const c = state?.character;
        if (c) {
          if (c.currentJob && !c.currentJob.workMode) c.currentJob.workMode = 'standard';
          if (c.studio && c.studio.activeProject === undefined) c.studio.activeProject = null;
          if (c.studio && c.studio.projectsCompleted === undefined) c.studio.projectsCompleted = 0;
          if (!c.miniGamePlaysThisMonth) c.miniGamePlaysThisMonth = {};
          if (!c.practicePlaysThisMonth) c.practicePlaysThisMonth = {};
        }
        return state;
      },
    },
  ),
);
