import { useState } from 'react';
import { useGameStore } from './store/gameStore';
import { CharacterCreation } from './components/CharacterCreation';
import { EndScreen } from './components/EndScreen';
import { TopBar } from './components/TopBar';
import { NavBar, type Tab } from './components/NavBar';
import { EventToast } from './components/EventToast';
import { OverviewPanel } from './components/OverviewPanel';
import { CareerPanel } from './components/CareerPanel';
import { StudioPanel } from './components/StudioPanel';
import { SkillsPanel } from './components/SkillsPanel';
import { LifePanel } from './components/LifePanel';

function App() {
  const character = useGameStore((s) => s.character);
  const [tab, setTab] = useState<Tab>('overview');

  if (!character) return <CharacterCreation />;
  if (character.retired) return <EndScreen />;

  return (
    <div className="min-h-svh bg-slate-950 text-slate-200">
      <TopBar />
      <EventToast />
      <div className="max-w-5xl mx-auto flex">
        <NavBar active={tab} onChange={setTab} />
        <main className="flex-1 min-w-0 p-4 pb-24 md:pb-6">
          {tab === 'overview' && <OverviewPanel />}
          {tab === 'career' && <CareerPanel />}
          {tab === 'studio' && <StudioPanel />}
          {tab === 'skills' && <SkillsPanel />}
          {tab === 'life' && <LifePanel />}
        </main>
      </div>
    </div>
  );
}

export default App;
