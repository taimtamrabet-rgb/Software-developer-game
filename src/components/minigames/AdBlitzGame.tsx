import { useEffect, useRef, useState } from 'react';

const ROUNDS = 5;
const TILES_PER_ROUND = 6;
const ROUND_MS = 1800;

interface Tile {
  id: number;
  onBrand: boolean;
  clicked: boolean;
}

function makeTiles(): Tile[] {
  const tiles: Tile[] = [];
  for (let i = 0; i < TILES_PER_ROUND; i++) {
    tiles.push({ id: i, onBrand: Math.random() < 0.5, clicked: false });
  }
  if (!tiles.some((t) => t.onBrand)) tiles[0].onBrand = true;
  return tiles;
}

export function AdBlitzGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [round, setRound] = useState(1);
  const [tiles, setTiles] = useState<Tile[]>(() => makeTiles());
  const correctRef = useRef(0);
  const wrongRef = useRef(0);
  const totalOnBrandRef = useRef(0);
  const timeoutRef = useRef<number | undefined>(undefined);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    totalOnBrandRef.current += tiles.filter((t) => t.onBrand).length;
    timeoutRef.current = window.setTimeout(endRound, ROUND_MS);
    return () => window.clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function endRound() {
    if (round >= ROUNDS) {
      const total = Math.max(1, totalOnBrandRef.current);
      const score = Math.round(((correctRef.current - wrongRef.current * 0.5) / total) * 100);
      onComplete(Math.max(0, Math.min(100, score)));
      return;
    }
    const nextTiles = makeTiles();
    totalOnBrandRef.current += nextTiles.filter((t) => t.onBrand).length;
    setTiles(nextTiles);
    setRound((r) => r + 1);
    timeoutRef.current = window.setTimeout(endRound, ROUND_MS);
  }

  function handleTileClick(id: number) {
    setTiles((prev) =>
      prev.map((t) => {
        if (t.id !== id || t.clicked) return t;
        if (t.onBrand) correctRef.current += 1;
        else wrongRef.current += 1;
        return { ...t, clicked: true };
      }),
    );
  }

  return (
    <div>
      <div className="text-xs text-slate-400 mb-3">
        Tap only the ✅ on-brand ads! Round {round}/{ROUNDS}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {tiles.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTileClick(t.id)}
            disabled={t.clicked}
            className={`h-16 rounded-lg border text-lg font-medium transition-colors ${
              t.clicked
                ? t.onBrand
                  ? 'bg-emerald-900/50 border-emerald-700 text-emerald-300'
                  : 'bg-rose-900/50 border-rose-700 text-rose-300'
                : 'bg-slate-800 border-slate-700 text-slate-200 active:scale-95'
            }`}
          >
            {t.clicked ? (t.onBrand ? '✅' : '❌') : t.onBrand ? '✅' : '❌'}
          </button>
        ))}
      </div>
    </div>
  );
}
