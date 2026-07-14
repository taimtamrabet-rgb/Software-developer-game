export interface StudioTierDef {
  tier: number;
  name: string;
  minEmployees: number;
  upgradeCost: number;
  revenuePerEmployee: number;
  overhead: number;
}

export const STUDIO_TIERS: StudioTierDef[] = [
  { tier: 1, name: 'Garage Startup', minEmployees: 0, upgradeCost: 0, revenuePerEmployee: 7500, overhead: 300 },
  { tier: 2, name: 'Small Office', minEmployees: 4, upgradeCost: 40000, revenuePerEmployee: 8200, overhead: 1500 },
  { tier: 3, name: 'Established Studio', minEmployees: 10, upgradeCost: 150000, revenuePerEmployee: 9000, overhead: 5000 },
  { tier: 4, name: 'Corporation', minEmployees: 25, upgradeCost: 600000, revenuePerEmployee: 10000, overhead: 15000 },
  { tier: 5, name: 'Global HQ', minEmployees: 60, upgradeCost: 2500000, revenuePerEmployee: 11500, overhead: 40000 },
];

export const FOUNDING_COST = 50000;
export const FOUNDING_MIN_EXPERIENCE_MONTHS = 30;

export const HIRE_COST = 8000;
export const AVG_EMPLOYEE_SALARY = 5500;

export function studioTierFor(tier: number): StudioTierDef {
  return STUDIO_TIERS.find((t) => t.tier === tier) ?? STUDIO_TIERS[0];
}

export function nextStudioTier(tier: number): StudioTierDef | null {
  return STUDIO_TIERS.find((t) => t.tier === tier + 1) ?? null;
}
