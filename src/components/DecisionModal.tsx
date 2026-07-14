import { useGameStore } from '../store/gameStore';

export function DecisionModal() {
  const pendingDecision = useGameStore((s) => s.character?.pendingDecision);
  const resolveDecision = useGameStore((s) => s.resolveDecision);

  if (!pendingDecision) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
      <div className="w-full max-w-sm bg-slate-900 border border-violet-700/60 rounded-2xl p-6 shadow-2xl shadow-violet-950/50">
        <div className="text-3xl mb-2">🤔</div>
        <h3 className="text-white font-bold text-lg mb-2">{pendingDecision.title}</h3>
        <p className="text-slate-400 text-sm mb-5">{pendingDecision.description}</p>
        <div className="flex flex-col gap-2">
          {pendingDecision.options.map((option) => (
            <button
              key={option.id}
              onClick={() => resolveDecision(option.id)}
              className="w-full text-left rounded-xl border border-slate-700 bg-slate-800/60 hover:border-violet-500 hover:bg-violet-500/10 px-4 py-3 text-sm font-medium text-slate-200 transition-colors"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
