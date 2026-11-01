import React, { useState } from 'react';
import { 
  MessageSquare, 
  AlertTriangle, 
  ShieldAlert, 
  Flame, 
  ChevronRight,
  Gavel
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

export function SuspectInterrogation({ 
  suspects, 
  clues, 
  collectedClueIds, 
  onInterrogateQuestion, 
  onConfrontSuspect 
}) {
  const [selectedSuspectId, setSelectedSuspectId] = useState(suspects[0].id);
  const [confrontClueId, setConfrontClueId] = useState('');
  const [lastConfrontResult, setLastConfrontResult] = useState(null);
  const [askedQuestions, setAskedQuestions] = useState({});

  const currentSuspect = suspects.find((s) => s.id === selectedSuspectId) || suspects[0];
  const collectedClues = clues.filter((c) => collectedClueIds.includes(c.id));

  const handleAsk = (idx, q) => {
    sound.playTypewriter();
    setAskedQuestions(prev => ({
      ...prev,
      [`${currentSuspect.id}_${idx}`]: true
    }));
    onInterrogateQuestion(currentSuspect.id, q);
  };

  const handleConfront = () => {
    if (!confrontClueId) return;

    sound.playInspect();
    const reaction = currentSuspect.confrontationReactions[confrontClueId] || currentSuspect.confrontationReactions.default;
    
    if (reaction.success) {
      sound.playDramaticSting();
      onConfrontSuspect(currentSuspect.id, confrontClueId);
    } else {
      sound.playTypewriter();
    }

    setLastConfrontResult({
      clueId: confrontClueId,
      success: reaction.success,
      dialogue: reaction.dialogue,
      breakdown: reaction.breakdown
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Suspect Roster Carousel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {suspects.map((suspect) => {
          const isSelected = suspect.id === selectedSuspectId;

          return (
            <button
              key={suspect.id}
              onClick={() => {
                sound.playPageTurn();
                setSelectedSuspectId(suspect.id);
                setLastConfrontResult(null);
                setConfrontClueId('');
              }}
              className={`p-3.5 rounded-lg border text-left transition-all duration-300 relative overflow-hidden ${
                isSelected
                  ? 'bg-noir-800 border-amberGold-500/60 shadow-noir-glow ring-1 ring-amberGold-500/30'
                  : 'bg-noir-900/80 border-noir-750 hover:bg-noir-850 hover:border-noir-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{suspect.avatar}</span>
                {suspect.alibiBroken ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-crimson-950/80 border border-crimson-600/60 text-crimson-300 font-bold animate-pulse">
                    ALIBI SHATTERED
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-noir-950 text-zinc-400">
                    Alibi Standing
                  </span>
                )}
              </div>

              <h3 className={`font-serif font-bold text-sm sm:text-base ${isSelected ? 'text-amberGold-300' : 'text-zinc-200'}`}>
                {suspect.name}
              </h3>
              <p className="text-[11px] text-zinc-400 line-clamp-1 font-sans">
                {suspect.title}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Interrogation Room */}
      <div className={`p-6 rounded-xl border border-noir-700 bg-gradient-to-b ${currentSuspect.bgGradient} shadow-2xl relative`}>
        
        {/* Suspect Dossier Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-noir-700/60 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-noir-950/80 border-2 border-noir-700 flex items-center justify-center text-3xl shadow-inner shrink-0">
              {currentSuspect.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amberGold-400 bg-amberGold-500/10 px-2 py-0.5 rounded border border-amberGold-500/20">
                  INTERROGATION ROOM B
                </span>
                <span className="text-xs text-zinc-400 font-mono">Age: {currentSuspect.age}</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-zinc-100 mt-1">
                {currentSuspect.name}
              </h2>
              <p className="text-xs text-amberGold-300 font-sans">
                {currentSuspect.relation}
              </p>
              <p className="text-xs text-zinc-300 mt-1 font-sans max-w-xl">
                {currentSuspect.overview}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 font-mono text-xs">
            <div className="p-2.5 rounded bg-noir-950/70 border border-noir-750">
              <span className="text-zinc-400 block text-[10px] uppercase">Claimed Alibi:</span>
              <p className="text-zinc-200 text-xs italic font-serif">"{currentSuspect.claimedAlibi}"</p>
            </div>
            <div className="p-2.5 rounded bg-noir-950/70 border border-noir-750">
              <span className="text-zinc-400 block text-[10px] uppercase">Underlying Motive:</span>
              <p className="text-amberGold-400/90 text-xs">{currentSuspect.motive}</p>
            </div>
          </div>
        </div>

        {/* Two-Column Layout: Questions & Confrontation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Column 1: Questions */}
          <div className="space-y-4">
            <h3 className="text-sm font-mono uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amberGold-400" />
              <span>Direct Questioning</span>
            </h3>

            <div className="space-y-3">
              {currentSuspect.interrogations.map((item, idx) => {
                const isAsked = askedQuestions[`${currentSuspect.id}_${idx}`];

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-noir-950/80 border border-noir-750 hover:border-noir-600 transition"
                  >
                    <button
                      onClick={() => handleAsk(idx, item)}
                      className="w-full text-left flex items-start justify-between gap-2 text-xs sm:text-sm font-sans font-medium text-amberGold-300 hover:text-amberGold-200 transition"
                    >
                      <span>Q: {item.question}</span>
                      <ChevronRight className="w-4 h-4 shrink-0 text-zinc-400 mt-0.5" />
                    </button>

                    {isAsked && (
                      <div className="mt-3 pt-3 border-t border-noir-800 text-xs font-typewriter text-zinc-300 leading-relaxed bg-noir-900/60 p-3 rounded">
                        <span className="text-zinc-400 block text-[10px] uppercase font-mono mb-1">
                          {currentSuspect.name}'s Response:
                        </span>
                        "{item.response}"
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Evidence Confrontation / Alibi Shatter */}
          <div className="space-y-4">
            <h3 className="text-sm font-mono uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Gavel className="w-4 h-4 text-crimson-400" />
              <span>Confront with Evidence</span>
            </h3>

            <div className="p-4 rounded-lg bg-noir-950/90 border border-noir-750 space-y-4">
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Caught them in a lie? Present a physical clue or forensic report from your Evidence Locker to break their alibi.
              </p>

              {collectedClues.length === 0 ? (
                <div className="p-4 text-center rounded bg-noir-900 border border-dashed border-noir-700 text-xs text-zinc-400">
                  No clues collected yet. Visit the crime scenes to find physical evidence.
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1.5">
                      Select Clue to Present:
                    </label>
                    <select
                      value={confrontClueId}
                      onChange={(e) => setConfrontClueId(e.target.value)}
                      className="w-full p-2.5 rounded bg-noir-900 border border-noir-700 text-zinc-200 text-xs font-mono focus:border-amberGold-500 focus:outline-none"
                    >
                      <option value="">-- Choose a Clue from Evidence Locker --</option>
                      {collectedClues.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleConfront}
                    disabled={!confrontClueId}
                    className={`w-full py-2.5 px-4 rounded text-xs font-mono font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 shadow ${
                      confrontClueId
                        ? 'bg-crimson-700 hover:bg-crimson-600 text-white shadow-blood-glow'
                        : 'bg-noir-800 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Confront Suspect (Objection!)</span>
                  </button>
                </div>
              )}

              {/* Confrontation Result Feedback */}
              {lastConfrontResult && (
                <div className={`p-4 rounded-lg border animate-fade-in ${
                  lastConfrontResult.success
                    ? 'bg-crimson-950/70 border-crimson-600/70 text-crimson-100'
                    : 'bg-noir-900 border-noir-700 text-zinc-300'
                }`}>
                  <div className="flex items-center gap-2 mb-2 font-mono text-xs font-bold">
                    {lastConfrontResult.success ? (
                      <span className="text-crimson-400 flex items-center gap-1">
                        <Flame className="w-4 h-4 text-crimson-400 animate-bounce" />
                        CRITICAL CONTRADICTION EXPOSED!
                      </span>
                    ) : (
                      <span className="text-zinc-400 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4 text-zinc-400" />
                        NO EFFECT
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm font-typewriter italic leading-relaxed">
                    "{lastConfrontResult.dialogue}"
                  </p>

                  {lastConfrontResult.breakdown && (
                    <div className="mt-3 pt-2 border-t border-crimson-800/60 text-xs font-sans text-amberGold-300 font-semibold">
                      💡 {lastConfrontResult.breakdown}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
