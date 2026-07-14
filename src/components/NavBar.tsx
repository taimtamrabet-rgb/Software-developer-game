export type Tab = 'overview' | 'career' | 'studio' | 'skills' | 'life';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'overview', label: 'Home', icon: '🏠' },
  { id: 'career', label: 'Career', icon: '💼' },
  { id: 'studio', label: 'Studio', icon: '🏢' },
  { id: 'skills', label: 'Skills', icon: '📚' },
  { id: 'life', label: 'Life', icon: '🛋️' },
];

interface NavBarProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export function NavBar({ active, onChange }: NavBarProps) {
  return (
    <>
      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-slate-950/95 backdrop-blur border-t border-slate-800 flex pb-[env(safe-area-inset-bottom)]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs transition-colors ${
              active === tab.id ? 'text-violet-400' : 'text-slate-500'
            }`}
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Desktop sidebar */}
      <nav className="hidden md:flex flex-col w-52 shrink-0 gap-1 p-4 border-r border-slate-800 h-[calc(100svh-73px)] sticky top-[73px]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors text-left ${
              active === tab.id
                ? 'bg-violet-500/15 text-violet-300'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </>
  );
}
