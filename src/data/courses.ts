import type { Course } from '../types';

export const COURSES: Course[] = [
  {
    id: 'coding-systems',
    name: 'Systems Design Bootcamp',
    skill: 'coding',
    cost: 1200,
    energyCost: 30,
    skillGain: 10,
    description: 'Learn to architect large-scale systems. A guaranteed, bigger boost than practice alone.',
  },
  {
    id: 'design-advanced',
    name: 'Advanced Design Masterclass',
    skill: 'design',
    cost: 1400,
    energyCost: 30,
    skillGain: 11,
    description: 'Study under industry veterans. A guaranteed, bigger boost than practice alone.',
  },
  {
    id: 'business-mba',
    name: 'Weekend MBA Course',
    skill: 'business',
    cost: 1600,
    energyCost: 25,
    skillGain: 9,
    description: 'Learn finance, strategy, and operations. A guaranteed, bigger boost than practice alone.',
  },
  {
    id: 'marketing-growth',
    name: 'Growth Hacking Workshop',
    skill: 'marketing',
    cost: 900,
    energyCost: 25,
    skillGain: 9,
    description: 'Master growth loops and user acquisition. A guaranteed, bigger boost than practice alone.',
  },
];
