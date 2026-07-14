import { useEffect, useRef, useState } from 'react';

const ROUNDS = 5;
const STEP = 2.2;

function randomTarget() {
  const center = 20 + Math.random() * 60;
  return { center, width: 14 };
}

export function PitchTimingGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [pos, setPos] = useState(0);
  const [round, setRound] = useState(1);
  const [target, setTarget] = useState(randomTarget());
  const [locked, setLocked] = useState(false);
  const [roundScore, setRoundScore] = useState<number | null>(null);
  const dirRef = useRef(1);
  const scoresRef = useRef<number[]>([]);
  const intervalRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setPos((p) => {
        let next = p + STEP * dirRef.current;
        if (next >= 100) {
          next = 100;
          dirRef.current = -1;
        } else if (next <= 0) {
          next = 0;
          dirRef.current = 1;
        }
        return next;
      });
    }, 16);
    return () => window.clearInterval(intervalRef.current);
  }, []);

  function handleStop() {
    if (locked) return;
    window.clearInterval(intervalRef.current);
    setLocked(true);
    const distance = Math.abs(pos - target.center);
    const score = Math.max(0, Math.round(100 - distance * 4));
    scoresRef.current.push(score);
    setRoundScore(score);

    window.setTimeout(() => {
      if (round >= ROUNDS) {
        const avg = Math.round(scoresRef.current.reduce((a, b) => a + b, 0) / scoresRef.current.length);
        onComplete(avg);
        return;
      }
      setRound((r) => r + 1);
      setTarget(randomTarget());
      setPos(0);
      dirRef.current = 1;
      setRoundScore(null);
      setLocked(false);
      intervalRef.current = window.setInterval(() => {
        setPos((p) => {
          let next = p + STEP * dirRef.current;
          if (next >= 100) {
            next = 100;
            dirRef.current = -1;
          } else if (next <= 0) {
            next = 0;
            dirRef.current = 1;
          }
          return next;
        });
      }, 16);
    }, 700);
  }

  return (
    <div>
      <div className="text-xs text-slate-400 mb-3">
        Stop the meter in the sweet spot! Round {round}/{ROUNDS}
      </div>
      <div className="relative h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden mb-4">
        <div
          className="absolute top-0 bottom-0 bg-emerald-500/30 border-x border-emerald-400"
          style={{ left: `${target.center - target.width / 2}%`, width: `${target.width}%` }}
        />
        <div
          className="absolute top-0 bottom-0 w-1.5 bg-white shadow"
          style={{ left: `${pos}%` }}
        />
      </div>
      {roundScore !== null && (
        <div className="text-center text-sm text-violet-300 mb-3">+{roundScore} accuracy</div>
      )}
      <button
        onClick={handleStop}
        disabled={locked}
        className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-3 transition-colors"
      >
        Stop
      </button>
    </div>
  );
}
