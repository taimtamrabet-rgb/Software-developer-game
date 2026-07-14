import { useGameStore } from '../store/gameStore';
import { COURSES } from '../data/courses';
import { formatMoney } from '../utils/format';
import { Card, SectionTitle } from './Card';
import { StatBar } from './StatBar';
import { MiniGamesSection } from './MiniGamesSection';
import type { SkillName } from '../types';

const SKILL_COLORS: Record<string, string> = {
  coding: 'bg-violet-500',
  design: 'bg-indigo-500',
  business: 'bg-teal-500',
  marketing: 'bg-orange-500',
};

const PRACTICE_ENERGY_COST = 10;
const PRACTICE_MAX_PER_MONTH = 3;
const SKILLS: SkillName[] = ['coding', 'design', 'business', 'marketing'];

export function SkillsPanel() {
  const character = useGameStore((s) => s.character)!;
  const takeCourse = useGameStore((s) => s.takeCourse);
  const practiceSkill = useGameStore((s) => s.practiceSkill);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <SectionTitle>Your Skills</SectionTitle>
        <div className="flex flex-col gap-3">
          <StatBar label="Coding" value={character.skills.coding} colorClass={SKILL_COLORS.coding} />
          <StatBar label="Design" value={character.skills.design} colorClass={SKILL_COLORS.design} />
          <StatBar label="Business" value={character.skills.business} colorClass={SKILL_COLORS.business} />
          <StatBar label="Marketing" value={character.skills.marketing} colorClass={SKILL_COLORS.marketing} />
        </div>
      </Card>

      <Card>
        <SectionTitle>Free Practice</SectionTitle>
        <p className="text-slate-400 text-sm mb-3">
          Practice on your own time. No cost besides energy &mdash; up to {PRACTICE_MAX_PER_MONTH}&times; per skill each month.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SKILLS.map((skill) => {
            const plays = character.practicePlaysThisMonth[skill] ?? 0;
            const remaining = PRACTICE_MAX_PER_MONTH - plays;
            const canPlay = remaining > 0 && character.energy >= PRACTICE_ENERGY_COST;
            return (
              <button
                key={skill}
                onClick={() => practiceSkill(skill)}
                disabled={!canPlay}
                className="rounded-xl border border-slate-800 bg-slate-800/30 disabled:opacity-40 hover:border-violet-500 p-3 text-center transition-colors"
              >
                <div className="text-white text-sm font-medium capitalize">{skill}</div>
                <div className="text-slate-500 text-xs mt-1">⚡{PRACTICE_ENERGY_COST} &middot; {remaining} left</div>
              </button>
            );
          })}
        </div>
      </Card>

      <MiniGamesSection />

      <Card>
        <SectionTitle>Paid Courses</SectionTitle>
        <p className="text-slate-400 text-sm mb-3">Spend money for a guaranteed, bigger skill boost.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {COURSES.map((course) => {
            const canAfford = character.money >= course.cost && character.energy >= course.energyCost;
            return (
              <div key={course.id} className="rounded-xl border border-slate-800 bg-slate-800/30 p-3.5">
                <div className="flex items-center justify-between">
                  <div className="text-white font-medium text-sm">{course.name}</div>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${SKILL_COLORS[course.skill]} bg-opacity-20 text-slate-200 capitalize`}>
                    {course.skill}
                  </span>
                </div>
                <div className="text-slate-400 text-xs mt-1">{course.description}</div>
                <div className="flex items-center justify-between mt-2.5 text-xs text-slate-400">
                  <span>{formatMoney(course.cost)} &middot; ⚡{course.energyCost} &middot; +{course.skillGain} skill</span>
                </div>
                <button
                  onClick={() => takeCourse(course.id)}
                  disabled={!canAfford}
                  className="w-full mt-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs font-semibold py-2 transition-colors"
                >
                  Take Course
                </button>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
