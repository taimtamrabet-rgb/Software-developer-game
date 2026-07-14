import type { Character, SkillName } from '../types';

const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));

export interface DecisionOption {
  id: string;
  label: string;
  apply: (c: Character) => { text: string; kind: 'good' | 'bad' | 'neutral' };
}

export interface DecisionDef {
  id: string;
  title: string;
  description: string;
  weight: number;
  condition: (c: Character) => boolean;
  options: DecisionOption[];
}

export const DECISIONS: DecisionDef[] = [
  {
    id: 'side-hustle',
    title: 'Side Hustle Offer',
    description: 'A friend wants to pay you to help build a small project over the weekend. It would eat into your rest time.',
    weight: 10,
    condition: (c) => !c.studio,
    options: [
      {
        id: 'take-it',
        label: 'Take the gig',
        apply: (c) => {
          const pay = 1500 + Math.round(Math.random() * 2500);
          c.money += pay;
          c.energy = clamp(c.energy - 12);
          const skills: SkillName[] = ['coding', 'design', 'business', 'marketing'];
          const s = skills[Math.floor(Math.random() * skills.length)];
          c.skills[s] = clamp(c.skills[s] + 3);
          return { text: `You pulled it off, earning $${pay.toLocaleString()} and sharpening your ${s} skills.`, kind: 'good' };
        },
      },
      {
        id: 'decline',
        label: 'Decline, rest instead',
        apply: (c) => {
          c.happiness = clamp(c.happiness + 5);
          return { text: 'You turned it down and enjoyed a relaxing weekend instead.', kind: 'neutral' };
        },
      },
    ],
  },
  {
    id: 'hot-tip',
    title: 'A "Sure Thing" Investment',
    description: 'A coworker swears they have insider knowledge on a stock about to explode. They want you in before Monday.',
    weight: 7,
    condition: (c) => c.money >= 5000,
    options: [
      {
        id: 'invest',
        label: 'Invest $3,000',
        apply: (c) => {
          c.money -= 3000;
          if (Math.random() < 0.45) {
            const multiplier = 2 + Math.random() * 3;
            const payout = Math.round(3000 * multiplier);
            c.money += payout;
            return { text: `It actually paid off! Your $3,000 turned into $${payout.toLocaleString()}.`, kind: 'good' };
          }
          c.happiness = clamp(c.happiness - 6);
          return { text: 'It crashed. Your $3,000 is gone, and so is the coworker’s credibility.', kind: 'bad' };
        },
      },
      {
        id: 'skip',
        label: "Skip it, sounds like a scam",
        apply: () => ({ text: 'You kept your money in your own pocket. Probably wise.', kind: 'neutral' }),
      },
    ],
  },
  {
    id: 'conference-invite',
    title: 'Conference Speaking Invite',
    description: 'A tech conference wants you on a panel. It pays a small honorarium but will wear you out.',
    weight: 8,
    condition: (c) => !!c.currentJob || !!c.studio,
    options: [
      {
        id: 'accept',
        label: 'Accept the invite',
        apply: (c) => {
          c.energy = clamp(c.energy - 15);
          c.reputation = clamp(c.reputation + 8);
          c.money += 500;
          return { text: 'The talk went great — your reputation is growing and you pocketed a $500 honorarium.', kind: 'good' };
        },
      },
      {
        id: 'decline',
        label: 'Decline, too busy',
        apply: (c) => {
          c.energy = clamp(c.energy + 5);
          return { text: 'You stayed home and kept your energy for more important things.', kind: 'neutral' };
        },
      },
    ],
  },
  {
    id: 'team-conflict',
    title: 'Studio Drama',
    description: 'Two of your employees are feuding over creative direction and it’s tanking morale.',
    weight: 9,
    condition: (c) => !!c.studio && c.studio.employees >= 2,
    options: [
      {
        id: 'mediate',
        label: 'Mediate personally',
        apply: (c) => {
          c.energy = clamp(c.energy - 10);
          if (c.studio) c.studio.reputation = clamp(c.studio.reputation + 6);
          return { text: 'You smoothed things over. The team feels heard again.', kind: 'good' };
        },
      },
      {
        id: 'ignore',
        label: 'Let them sort it out',
        apply: (c) => {
          if (c.studio) {
            c.studio.reputation = clamp(c.studio.reputation - 4);
            if (Math.random() < 0.3 && c.studio.employees > 1) {
              c.studio.employees -= 1;
              return { text: 'It got worse. One of them quit in frustration.', kind: 'bad' };
            }
          }
          return { text: 'It fizzled out on its own, but morale took a small hit.', kind: 'bad' };
        },
      },
    ],
  },
  {
    id: 'burnout-check',
    title: 'Running on Empty',
    description: 'You’ve barely slept in weeks. A doctor friend tells you to take it seriously before it gets worse.',
    weight: 12,
    condition: (c) => c.energy < 35,
    options: [
      {
        id: 'break',
        label: 'Take a real break',
        apply: (c) => {
          c.energy = clamp(c.energy + 30);
          c.happiness = clamp(c.happiness + 15);
          return { text: 'You unplugged for a bit and came back feeling human again.', kind: 'good' };
        },
      },
      {
        id: 'push-through',
        label: 'Push through it',
        apply: (c) => {
          c.happiness = clamp(c.happiness - 10);
          c.reputation = clamp(c.reputation + 4);
          return { text: 'You white-knuckled it. People noticed your dedication, but it cost you.', kind: 'bad' };
        },
      },
    ],
  },
  {
    id: 'raise-negotiation',
    title: 'A Rival Offer',
    description: 'A competitor slides into your inbox with a higher salary offer, hoping to poach you.',
    weight: 9,
    condition: (c) => !!c.currentJob,
    options: [
      {
        id: 'negotiate',
        label: 'Use it to negotiate a raise',
        apply: (c) => {
          if (!c.currentJob) return { text: '', kind: 'neutral' };
          const success = c.reputation >= 25 || Math.random() < 0.5;
          if (success) {
            const raise = Math.round(c.currentJob.salary * (0.15 + Math.random() * 0.15));
            c.currentJob.salary += raise;
            c.reputation = clamp(c.reputation + 2);
            return { text: `Your manager matched the pressure with a $${raise.toLocaleString()}/mo raise to keep you.`, kind: 'good' };
          }
          c.happiness = clamp(c.happiness - 5);
          return { text: 'They called your bluff. No raise, and things feel a little awkward now.', kind: 'bad' };
        },
      },
      {
        id: 'ignore-offer',
        label: 'Ignore it, stay loyal',
        apply: (c) => {
          c.reputation = clamp(c.reputation + 1);
          return { text: 'You stayed put. Loyalty has its own quiet rewards.', kind: 'neutral' };
        },
      },
    ],
  },
  {
    id: 'investor-offer',
    title: 'Investor Term Sheet',
    description: 'An investor offers a cash injection for your studio in exchange for giving up some control.',
    weight: 8,
    condition: (c) => !!c.studio,
    options: [
      {
        id: 'take-money',
        label: 'Take the investment',
        apply: (c) => {
          const amount = 50000 + Math.round(Math.random() * 60000);
          c.money += amount;
          if (c.studio) c.studio.reputation = clamp(c.studio.reputation - 5);
          return { text: `You took the deal: $${amount.toLocaleString()} in the bank, but some of the studio isn’t fully yours anymore.`, kind: 'good' };
        },
      },
      {
        id: 'stay-independent',
        label: 'Stay independent',
        apply: (c) => {
          if (c.studio) c.studio.reputation = clamp(c.studio.reputation + 5);
          c.reputation = clamp(c.reputation + 3);
          return { text: 'You turned it down. The studio stays fully yours — for better or worse.', kind: 'neutral' };
        },
      },
    ],
  },
  {
    id: 'charity-drive',
    title: 'Alumni Charity Drive',
    description: 'Your old university is running a fundraiser and asks if you’d like to contribute.',
    weight: 6,
    condition: (c) => c.money >= 3000,
    options: [
      {
        id: 'donate',
        label: 'Donate $2,000',
        apply: (c) => {
          c.money -= 2000;
          c.reputation = clamp(c.reputation + 10);
          c.happiness = clamp(c.happiness + 6);
          return { text: 'Your name is now on a plaque somewhere. Feels pretty good.', kind: 'good' };
        },
      },
      {
        id: 'skip-donation',
        label: 'Not this time',
        apply: () => ({ text: 'You kept your wallet closed this round.', kind: 'neutral' }),
      },
    ],
  },
  {
    id: 'media-feature',
    title: 'Media Spotlight',
    description: 'A journalist wants to profile you for a "rising talent in tech" feature.',
    weight: 7,
    condition: (c) => c.reputation >= 15,
    options: [
      {
        id: 'do-interview',
        label: 'Do the interview',
        apply: (c) => {
          c.reputation = clamp(c.reputation + 10);
          c.happiness = clamp(c.happiness + 4);
          return { text: 'The piece went over well. Your name is getting around.', kind: 'good' };
        },
      },
      {
        id: 'stay-private',
        label: 'Stay out of the spotlight',
        apply: (c) => {
          c.happiness = clamp(c.happiness + 2);
          return { text: 'You kept a low profile. Some peace and quiet, at least.', kind: 'neutral' };
        },
      },
    ],
  },
  {
    id: 'mentor-junior',
    title: 'Mentorship Request',
    description: 'A junior colleague asks you to mentor them after hours. It’s unpaid, but they’re eager to learn.',
    weight: 8,
    condition: (c) => !!c.currentJob,
    options: [
      {
        id: 'mentor',
        label: 'Take them under your wing',
        apply: (c) => {
          c.energy = clamp(c.energy - 8);
          c.reputation = clamp(c.reputation + 6);
          c.happiness = clamp(c.happiness + 4);
          return { text: 'Watching them grow reminded you why you love this field.', kind: 'good' };
        },
      },
      {
        id: 'decline-mentor',
        label: "Politely decline",
        apply: (c) => {
          c.energy = clamp(c.energy + 3);
          return { text: 'You kept your evenings free. No hard feelings.', kind: 'neutral' };
        },
      },
    ],
  },
];

export function pickDecision(c: Character): DecisionDef | null {
  const eligible = DECISIONS.filter((d) => d.condition(c));
  if (eligible.length === 0) return null;
  const totalWeight = eligible.reduce((s, d) => s + d.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const d of eligible) {
    roll -= d.weight;
    if (roll <= 0) return d;
  }
  return eligible[eligible.length - 1];
}

export function decisionById(id: string): DecisionDef | undefined {
  return DECISIONS.find((d) => d.id === id);
}
