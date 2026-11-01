import React from 'react';
import { 
  CheckSquare, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  MapPin, 
  ArrowRight
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

export function TaskChecklist({ 
  tasks, 
  completedTaskIds, 
  locations,
  onNavigateToLocation 
}) {
  const completedCount = completedTaskIds.length;
  const totalCount = tasks.length;
  const percentComplete = Math.round((completedCount / totalCount) * 100);

  const getLocationName = (locId) => {
    const loc = locations.find(l => l.id === locId);
    return loc ? loc.name : null;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header and Progress Card */}
      <div className="p-6 rounded-2xl bg-noir-900 border border-noir-750 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-amberGold-500/20 text-amberGold-400">
              <CheckSquare className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amberGold-400 bg-amberGold-500/10 px-2 py-0.5 rounded border border-amberGold-500/20">
                  SHARED PROTOCOL
                </span>
                <span className="text-xs text-zinc-400 font-mono">ROOM-LEVEL OBJECTIVES</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-zinc-100 mt-0.5">
                Investigation Task Checklist
              </h2>
            </div>
          </div>

          <div className="text-right sm:text-right font-mono">
            <span className="text-2xl font-black text-amberGold-400">
              {completedCount} / {totalCount}
            </span>
            <span className="text-xs text-zinc-400 block">Objectives Completed</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Overall Room Progress</span>
            <span className="text-amberGold-400 font-bold">{percentComplete}%</span>
          </div>
          <div className="h-2.5 w-full bg-noir-950 rounded-full overflow-hidden border border-noir-800">
            <div 
              className="h-full bg-gradient-to-r from-amberGold-600 to-amberGold-400 rounded-full transition-all duration-700 ease-out shadow-noir-glow"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>
      </div>

      {/* Task Cards List */}
      <div className="space-y-3">
        {tasks.map((task, idx) => {
          const isDone = completedTaskIds.includes(task.id);
          const locName = getLocationName(task.locationId);

          return (
            <div
              key={task.id}
              className={`p-4 sm:p-5 rounded-xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDone
                  ? 'bg-noir-950/90 border-emerald-900/60 shadow-inner'
                  : 'bg-noir-900/90 border-noir-750 hover:border-noir-600'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <span className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                  isDone 
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                    : 'bg-noir-800 text-zinc-500 border border-noir-700'
                }`}>
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </span>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-500 font-bold">
                      #{idx + 1}
                    </span>
                    <h3 className={`font-serif font-bold text-sm sm:text-base ${
                      isDone ? 'text-zinc-300 line-through' : 'text-zinc-100'
                    }`}>
                      {task.title}
                    </h3>
                  </div>

                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    {task.description}
                  </p>

                  {locName && (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-amberGold-400/90 pt-1">
                      <MapPin className="w-3 h-3" />
                      <span>Location: {locName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status or Action */}
              <div className="shrink-0 flex items-center justify-end">
                {isDone ? (
                  <span className="px-3 py-1 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> COMPLETED
                  </span>
                ) : task.locationId ? (
                  <button
                    onClick={() => {
                      sound.playPageTurn();
                      onNavigateToLocation(task.locationId);
                    }}
                    className="px-3 py-1.5 rounded bg-noir-800 hover:bg-noir-750 border border-amberGold-500/30 text-amberGold-300 hover:text-amberGold-200 text-xs font-mono transition flex items-center gap-1"
                  >
                    <span>Investigate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-xs font-mono text-zinc-500 bg-noir-950 px-2 py-1 rounded border border-noir-800">
                    Interrogation Room
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
