import type { Character } from '../types';
import { studioTierFor } from '../data/studio';

export function clamp(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, v));
}

export function studioValuation(c: Character): number {
  if (!c.studio) return 0;
  const profitPart = Math.max(c.studio.lastMonthProfit, 0) * 12 * 3;
  const employeePart = c.studio.employees * 10000;
  const repPart = c.studio.reputation * 500;
  return Math.round(profitPart + employeePart + repPart);
}

export function computeNetWorth(c: Character): number {
  const houseValue = c.housing.price > 0 ? c.housing.price : 0;
  const carValue = c.car ? c.car.price * 0.7 : 0;
  const studioValue = studioValuation(c);
  return Math.round(c.money + houseValue + carValue + studioValue);
}

export function studioProfitPreview(c: Character): number {
  if (!c.studio) return 0;
  const tierDef = studioTierFor(c.studio.tier);
  const revenue = c.studio.employees * tierDef.revenuePerEmployee * (0.5 + c.studio.reputation / 100);
  const salaries = c.studio.employees * 5500;
  return Math.round(revenue - salaries - tierDef.overhead);
}
