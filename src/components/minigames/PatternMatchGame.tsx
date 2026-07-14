import { useEffect, useRef, useState } from 'react';

const MAX_ROUNDS = 6;
const COLORS = [
  { id: 0, className: 'bg-rose-500', lit: 'bg-rose-300' },
  { id: 1, className: 'bg-sky-500', lit: 'bg-sky-300' },
  { id: 2, className: 'bg-emerald-500', lit: 'bg-emerald-300' },
  { id: 3, className: 'bg-amber-500', lit: 'bg-amber-300' },
];

export function PatternMatchGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [phase, setPhase] = useState<'showing' | 'input' | 'done'>('showing');
  const [litIndex, setLitIndex] = useState<number | null>(null);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [round, setRound] = useState(0);
  const runIdRef = useRef(0);

  useEffect(() => {
    const id = ++runIdRef.current;
    nextRound([], id);
    return () => {
      runIdRef.current += 1;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function nextRound(prevSeq: number[], id: number) {
    if (id !== runIdRef.current) return;
    const seq = [...prevSeq, Math.floor(Math.random() * 4)];
    setSequence(seq);
    setRound(seq.length);
    setPlayerIndex(0);
    setPhase('showing');
    playSequence(seq, id);
  }

  function playSequence(seq: number[], id: number) {
    let i = 0;
    const step = () => {
      if (id !== runIdRef.current) return;
      if (i >= seq.length) {
        setLitIndex(null);
        setPhase('input');
        return;
      }
      setLitIndex(seq[i]);
      window.setTimeout(() => {
        if (id !== runIdRef.current) return;
        setLitIndex(null);
        window.setTimeout(() => {
          if (id !== runIdRef.current) return;
          i += 1;
          step();
        }, 200);
      }, 450);
    };
    window.setTimeout(() => {
      if (id !== runIdRef.current) return;
      step();
    }, 400);
  }

  function handleTileClick(colorId: number) {
    if (phase !== 'input') return;
    if (sequence[playerIndex] === colorId) {
      if (playerIndex + 1 === sequence.length) {
        if (sequence.length >= MAX_ROUNDS) {
          setPhase('done');
          onComplete(100);
        } else {
          nextRound(sequence, runIdRef.current);
        }
      } else {
        setPlayerIndex(playerIndex + 1);
      }
    } else {
      setPhase('done');
      const score = Math.round(((sequence.length - 1) / MAX_ROUNDS) * 100);
      onComplete(Math.max(0, score));
    }
  }

  return (
    <div>
      <div className="text-xs text-slate-400 mb-3">
        {phase === 'showing' ? 'Watch the pattern...' : phase === 'input' ? 'Repeat the pattern!' : 'Done!'}
        {' '}Round {Math.min(round, MAX_ROUNDS)}/{MAX_ROUNDS}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {COLORS.map((c) => (
          <button
            key={c.id}
            disabled={phase !== 'input'}
            onClick={() => handleTileClick(c.id)}
            className={`h-20 rounded-xl transition-colors ${litIndex === c.id ? c.lit : c.className} ${
              phase === 'input' ? 'active:scale-95' : 'opacity-90'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
