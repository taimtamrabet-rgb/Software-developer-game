import { useGameStore } from '../store/gameStore';
import { COURSES } from '../data/courses';
import { formatMoney } from '../utils/format';
import { Card, SectionTitle } from './Card';
import { StatBar } from './StatBar';

const SKILL_COLORS: Record<string, string> = {
  coding: 'bg-violet-500',
  design: 'bg-indigo-500',
  business: 'bg-teal-500',
  marketing: 'bg-orange-500',
};

export function SkillsPanel() {
  const character = useGameStore((s) => s.character)!;
  const takeCourse = useGameStore((s) => s.takeCourse);

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
        <SectionTitle>Courses &amp; Training</SectionTitle>
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
