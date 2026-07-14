import type { JobTier, Track, TitleLevel } from '../types';

export const TITLE_LEVELS: TitleLevel[] = [
  { level: 1, title: 'Junior', minMonthsAtTier: 0, salaryMultiplier: 1 },
  { level: 2, title: 'Mid-Level', minMonthsAtTier: 12, salaryMultiplier: 1.35 },
  { level: 3, title: 'Senior', minMonthsAtTier: 30, salaryMultiplier: 1.8 },
  { level: 4, title: 'Lead', minMonthsAtTier: 54, salaryMultiplier: 2.4 },
  { level: 5, title: 'Principal', minMonthsAtTier: 84, salaryMultiplier: 3.2 },
];

export const SOFTWARE_TIERS: JobTier[] = [
  {
    tier: 1,
    track: 'software',
    name: 'Startup',
    minExperienceMonths: 0,
    minSkill: 0,
    baseSalary: 3200,
    companyNames: ['ByteSprout', 'PixelForge Labs', 'Nimbus Apps', 'CodeCrate', 'Fizzle Software'],
  },
  {
    tier: 2,
    track: 'software',
    name: 'Growth-Stage Company',
    minExperienceMonths: 14,
    minSkill: 20,
    baseSalary: 5200,
    companyNames: ['Vertex Systems', 'Streamline Cloud', 'DataForge', 'Wavelink Technologies', 'BrightStack'],
  },
  {
    tier: 3,
    track: 'software',
    name: 'Mid-Size Tech Company',
    minExperienceMonths: 34,
    minSkill: 40,
    baseSalary: 8200,
    companyNames: ['Orbital Software', 'Quantify Inc.', 'NovaGrid', 'Cascade Digital', 'Ironclad Systems'],
  },
  {
    tier: 4,
    track: 'software',
    name: 'Big Tech',
    minExperienceMonths: 64,
    minSkill: 62,
    baseSalary: 13500,
    companyNames: ['Helion Technologies', 'Magnetar Corp', 'Zenith Systems', 'Continuum Inc.', 'Apex Global Tech'],
  },
  {
    tier: 5,
    track: 'software',
    name: 'Elite Tech Giant',
    minExperienceMonths: 100,
    minSkill: 82,
    baseSalary: 22000,
    companyNames: ['Meridian', 'Solace Technologies', 'Everest Systems', 'Infinitum', 'Paragon Global'],
  },
];

export const GAME_TIERS: JobTier[] = [
  {
    tier: 1,
    track: 'game',
    name: 'Indie Studio',
    minExperienceMonths: 0,
    minSkill: 0,
    baseSalary: 2800,
    companyNames: ['Two Pixel Games', 'Lantern Interactive', 'Scrappy Byte Studio', 'Moonpath Games', 'Tiny Fox Studio'],
  },
  {
    tier: 2,
    track: 'game',
    name: 'Small Studio',
    minExperienceMonths: 14,
    minSkill: 20,
    baseSalary: 4600,
    companyNames: ['Ember Interactive', 'Rustwood Games', 'Voxel Point Studios', 'Driftwood Games', 'Copperlight Studio'],
  },
  {
    tier: 3,
    track: 'game',
    name: 'AA Studio',
    minExperienceMonths: 34,
    minSkill: 40,
    baseSalary: 7400,
    companyNames: ['Frostbyte Games', 'Steelhaven Studios', 'Lucid Interactive', 'Redwing Games', 'Ashcroft Studios'],
  },
  {
    tier: 4,
    track: 'game',
    name: 'AAA Studio',
    minExperienceMonths: 64,
    minSkill: 62,
    baseSalary: 12500,
    companyNames: ['Titanforge Studios', 'Obsidian Peak Games', 'Northstar Interactive', 'Wraithborne Studios', 'Colossal Games'],
  },
  {
    tier: 5,
    track: 'game',
    name: 'Legendary Studio',
    minExperienceMonths: 100,
    minSkill: 82,
    baseSalary: 20000,
    companyNames: ['Everquest Dynamics', 'Dreamforge Entertainment', 'Starfall Studios', 'Mythwright Games', 'Pinnacle Interactive'],
  },
];

export function tiersFor(track: Track): JobTier[] {
  return track === 'software' ? SOFTWARE_TIERS : GAME_TIERS;
}

export function titleForMonthsAtTier(monthsAtTier: number): TitleLevel {
  let best = TITLE_LEVELS[0];
  for (const t of TITLE_LEVELS) {
    if (monthsAtTier >= t.minMonthsAtTier) best = t;
  }
  return best;
}

export function highestUnlockedTier(track: Track, experienceMonths: number, relevantSkill: number): JobTier {
  const tiers = tiersFor(track);
  let best = tiers[0];
  for (const t of tiers) {
    if (experienceMonths >= t.minExperienceMonths && relevantSkill >= t.minSkill) best = t;
  }
  return best;
}
