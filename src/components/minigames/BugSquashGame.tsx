import { useEffect, useRef, useState } from 'react';

const TOTAL = 10;
const VISIBLE_MS = 900;

export function BugSquashGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [spawned, setSpawned] = useState(0);
  const [hits, setHits] = useState(0);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const timeoutRef = useRef<number | undefined>(undefined);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    spawnNext(0, 0);
    return () => window.clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function spawnNext(spawnedCount: number, hitCount: number) {
    if (spawnedCount >= TOTAL) {
      const score = Math.round((hitCount / TOTAL) * 100);
      setPos(null);
      onComplete(score);
      return;
    }
    const x = 10 + Math.random() * 80;
    const y = 12 + Math.random() * 70;
    setPos({ x, y });
    setSpawned(spawnedCount + 1);
    timeoutRef.current = window.setTimeout(() => {
      setPos(null);
      spawnNext(spawnedCount + 1, hitCount);
    }, VISIBLE_MS);
  }

  function handleClick() {
    window.clearTimeout(timeoutRef.current);
    setPos(null);
    const newHits = hits + 1;
    setHits(newHits);
    spawnNext(spawned, newHits);
  }

  return (
    <div>
      <div className="text-xs text-slate-400 mb-2">
        Squash the bugs before they scurry away! ({Math.min(spawned, TOTAL)}/{TOTAL})
      </div>
      <div className="relative h-56 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden select-none">
        {pos && (
          <button
            onClick={handleClick}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-3xl active:scale-90 transition-transform"
          >
            🐛
          </button>
        )}
      </div>
      <div className="text-xs text-slate-500 mt-2">Hits: {hits}</div>
    </div>
  );
}
