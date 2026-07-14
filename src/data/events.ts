import type { Character } from '../types';

export interface EventDef {
  id: string;
  weight: number;
  condition: (c: Character) => boolean;
  kind: 'good' | 'bad' | 'neutral';
  apply: (c: Character) => string;
}

const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));

export const EVENTS: EventDef[] = [
  {
    id: 'bonus',
    weight: 10,
    kind: 'good',
    condition: (c) => !!c.currentJob,
    apply: (c) => {
      const bonus = Math.round((c.currentJob?.salary ?? 1000) * 0.5);
      c.money += bonus;
      c.happiness = clamp(c.happiness + 6);
      return `Your manager surprised you with a $${bonus.toLocaleString()} performance bonus!`;
    },
  },
  {
    id: 'crunch',
    weight: 8,
    kind: 'bad',
    condition: (c) => !!c.currentJob,
    apply: (c) => {
      c.energy = clamp(c.energy - 20);
      c.happiness = clamp(c.happiness - 10);
      return `Crunch time hit the team hard. You're exhausted.`;
    },
  },
  {
    id: 'networking',
    weight: 9,
    kind: 'good',
    condition: () => true,
    apply: (c) => {
      c.reputation = clamp(c.reputation + 4);
      return `You made great connections at a tech meetup, boosting your reputation.`;
    },
  },
  {
    id: 'viral-project',
    weight: 5,
    kind: 'good',
    condition: (c) => !!c.currentJob && c.currentJob.tier <= 2,
    apply: (c) => {
      c.reputation = clamp(c.reputation + 8);
      c.skills.coding = clamp(c.skills.coding + 3);
      return `A side project you built went viral! Your reputation is growing.`;
    },
  },
  {
    id: 'health-scare',
    weight: 5,
    kind: 'bad',
    condition: () => true,
    apply: (c) => {
      const cost = 800 + Math.round(Math.random() * 1200);
      c.money -= cost;
      c.energy = clamp(c.energy - 15);
      return `An unexpected medical bill cost you $${cost.toLocaleString()}.`;
    },
  },
  {
    id: 'market-boom',
    weight: 4,
    kind: 'good',
    condition: (c) => !!c.studio,
    apply: (c) => {
      if (!c.studio) return '';
      c.studio.reputation = clamp(c.studio.reputation + 10);
      const boost = Math.round(c.studio.employees * 800 + 1000);
      c.money += boost;
      return `A market boom brought your studio a windfall of $${boost.toLocaleString()}.`;
    },
  },
  {
    id: 'market-crash',
    weight: 4,
    kind: 'bad',
    condition: (c) => !!c.studio,
    apply: (c) => {
      if (!c.studio) return '';
      c.studio.reputation = clamp(c.studio.reputation - 8);
      const loss = Math.round(c.studio.employees * 600 + 500);
      c.money = Math.max(0, c.money - loss);
      return `A downturn hurt your studio's revenue, costing you $${loss.toLocaleString()}.`;
    },
  },
  {
    id: 'burnout',
    weight: 6,
    kind: 'bad',
    condition: (c) => c.energy < 25,
    apply: (c) => {
      c.happiness = clamp(c.happiness - 15);
      return `You're running on empty. Burnout is taking a toll on your happiness.`;
    },
  },
  {
    id: 'recruiter-call',
    weight: 6,
    kind: 'neutral',
    condition: (c) => !!c.currentJob,
    apply: (c) => {
      c.reputation = clamp(c.reputation + 2);
      return `A recruiter reached out about new opportunities. Good to know you're in demand.`;
    },
  },
  {
    id: 'mentor',
    weight: 5,
    kind: 'good',
    condition: (c) => !!c.currentJob,
    apply: (c) => {
      const skills: (keyof Character['skills'])[] = ['coding', 'design', 'business', 'marketing'];
      const s = skills[Math.floor(Math.random() * skills.length)];
      c.skills[s] = clamp(c.skills[s] + 5);
      return `A mentor at work taught you something valuable, improving your ${s} skill.`;
    },
  },
];

export function maybeTriggerEvent(c: Character): { text: string; kind: 'good' | 'bad' | 'neutral' } | null {
  if (Math.random() > 0.35) return null;
  const eligible = EVENTS.filter((e) => e.condition(c));
  if (eligible.length === 0) return null;
  const totalWeight = eligible.reduce((s, e) => s + e.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const e of eligible) {
    roll -= e.weight;
    if (roll <= 0) {
      const text = e.apply(c);
      return { text, kind: e.kind };
    }
  }
  return null;
}
