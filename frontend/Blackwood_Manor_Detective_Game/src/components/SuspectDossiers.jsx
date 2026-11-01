import React, { useState } from 'react';
import { 
  MessageSquare, 
  AlertTriangle, 
  ShieldAlert, 
  Flame, 
  ChevronRight, 
  Gavel, 
  Link2,
  FileText
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

export function SuspectDossiers({ 
  suspects, 
  evidence, 
  discoveredEvidenceIds, 
  alibiBrokenSuspectIds, 
  onInterrogateQuestion, 
  onConfrontSuspect 
}) {
  const [selectedSuspectId, setSelectedSuspectId] = useState(suspects[0].id);
  const [confrontClueId, setConfrontClueId] = useState('');
  const [confrontFeedback, setConfrontFeedback] = useState(null);
  const [askedQuestions, setAskedQuestions] = useState({});

  const currentSuspect = suspects.find(s => s.id === selectedSuspectId) || suspects[0];
  const isCurrentAlibiBroken = alibiBrokenSuspectIds.includes(currentSuspect.id);

  // Filter evidence that the room has discovered
  const discoveredClues = evidence.filter(e => discoveredEvidenceIds.includes(e.id));
  const linkedCluesFound = discoveredClues.filter(e => e.linkedSuspectId === currentSuspect.id);

  const handleAskQuestion = (idx, item) => {
    sound.playTypewriter();
    setAskedQuestions(prev => ({
      ...prev,
      [`${currentSuspect.id}_${idx}`]: true
    }));
    onInterrogateQuestion(currentSuspect.id, item);
  };

  const handleConfront = () => {
    if (!confrontClueId) return;

    sound.playInspect();
    const reaction = currentSuspect.confrontation[confrontClueId] || currentSuspect.confrontation.default;

    if (reaction.success) {
      sound.playDramaticSting();
      onConfrontSuspect(currentSuspect.id, confrontClueId);
    } else {
      sound.playTypewriter();
    }

    setConfrontFeedback({
      clueId: confrontClueId,
      success: reaction.success,
      reaction: reaction.reaction,
      breakdown: reaction.breakdown
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Suspect Selector Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {suspects.map((suspect) => {
          const isSelected = suspect.id === selectedSuspectId;
          const broken = alibiBrokenSuspectIds.includes(suspect.id);

          return (
            <button
              key={suspect.id}
              onClick={() => {
                sound.playPageTurn();
                setSelectedSuspectId(suspect.id);
                setConfrontFeedback(null);
                setConfrontClueId('');
              }}
              className={`p-3.5 rounded-xl border text-left transition-all duration-300 relative overflow-hidden flex items-center gap-3.5 ${
                isSelected
                  ? 'bg-noir-800 border-amberGold-500 shadow-noir-glow ring-2 ring-amberGold-500/30'
                  : 'bg-noir-900 border-noir-750 hover:bg-noir-850 hover:border-noir-600'
              }`}
            >
              <div className="w-14 h-14 rounded-lg bg-noir-950 border border-noir-700 overflow-hidden shadow-inner shrink-0 relative">
                {suspect.portrait ? (
                  <img
                    src={suspect.portrait}
                    alt={suspect.name}
                    className="w-full h-full object-cover filter contrast-125"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">
                    {suspect.avatar}
                  </div>
                )}
                {broken && (
                  <div className="absolute inset-0 bg-crimson-950/60 flex items-center justify-center">
                    <span className="text-[9px] font-mono font-black text-crimson-300 bg-black/80 px-1 py-0.5 rounded">
                      BROKEN
                    </span>
                  </div>
                )}
              </div>

              <div className="overflow-hidden flex-1">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    broken 
                      ? 'bg-crimson-950/80 border border-crimson-600/70 text-crimson-300 animate-pulse' 
                      : 'bg-noir-950 text-zinc-400'
                  }`}>
                    {broken ? 'ALIBI SHATTERED' : 'ALIBI STANDING'}
                  </span>
                </div>

                <h3 className={`font-serif font-bold text-sm sm:text-base truncate ${isSelected ? 'text-amberGold-300' : 'text-zinc-100'}`}>
                  {suspect.name}
                </h3>
                <p className="text-[11px] text-zinc-400 font-sans truncate">
                  {suspect.title}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Suspect Dossier File */}
      <div className="p-6 sm:p-8 rounded-2xl bg-noir-900 border border-noir-750 shadow-2xl space-y-6">
        
        {/* Dossier Header Info */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-noir-750">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            
            {/* Photographic Suspect Portrait Frame */}
            <div className="relative shrink-0 mx-auto sm:mx-0">
              <div className="w-36 h-48 sm:w-44 sm:h-56 rounded-xl bg-noir-950 border-2 border-amberGold-600/50 p-1.5 shadow-2xl overflow-hidden relative group">
                {currentSuspect.portrait ? (
                  <img
                    src={currentSuspect.portrait}
                    alt={currentSuspect.name}
                    className="w-full h-full object-cover rounded-lg filter contrast-110 sepia-[0.15]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">
                    {currentSuspect.avatar}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-transparent to-transparent pointer-events-none" />
                
                <span className="absolute bottom-2 left-2 text-[9px] font-mono tracking-widest text-amberGold-400 bg-noir-950/90 px-2 py-0.5 rounded border border-noir-750">
                  FILE #{currentSuspect.id.toUpperCase()}
                </span>

                {isCurrentAlibiBroken && (
                  <div className="absolute inset-0 flex items-center justify-center rotate-[-12deg] pointer-events-none">
                    <span className="px-3 py-1 bg-crimson-900/90 border-2 border-crimson-500 text-crimson-100 font-mono font-black text-xs uppercase tracking-widest shadow-2xl animate-pulse">
                      ALIBI SHATTERED
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amberGold-400 bg-amberGold-500/10 px-2 py-0.5 rounded border border-amberGold-500/20 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  SCOTLAND YARD DOSSIER
                </span>
                <span className="text-xs text-zinc-400 font-mono">Age: {currentSuspect.age}</span>
                <span className="text-xs text-zinc-400 font-mono">• Sector: Blackwood Grounds</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-zinc-100">
                {currentSuspect.name}
              </h2>
              <p className="text-xs sm:text-sm text-amberGold-400 font-sans font-semibold">
                {currentSuspect.role}
              </p>
              <p className="text-xs sm:text-sm text-zinc-300 font-sans max-w-xl leading-relaxed pt-1">
                {currentSuspect.bio}
              </p>
            </div>
          </div>

          {/* Side Info Cards */}
          <div className="flex flex-col gap-2.5 font-mono text-xs md:w-80 shrink-0">
            <div className="p-3.5 rounded-lg bg-noir-950 border border-noir-800">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">Claimed Alibi:</span>
              <p className="text-xs text-zinc-200 italic font-serif leading-snug">
                "{currentSuspect.claimedAlibi}"
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-noir-950 border border-noir-800">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">Underlying Motive:</span>
              <p className="text-xs text-amberGold-300 font-sans leading-snug">
                {currentSuspect.motive}
              </p>
            </div>
          </div>
        </div>

        {/* Evidence Linked to this Suspect */}
        <div className="p-4 rounded-xl bg-noir-950 border border-noir-800 space-y-2.5">
          <span className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-amberGold-400" />
            <span>Discovered Evidence Linked to {currentSuspect.name} ({linkedCluesFound.length}):</span>
          </span>

          {linkedCluesFound.length === 0 ? (
            <p className="text-xs text-zinc-500 italic font-sans">
              No evidence directly connecting to {currentSuspect.name} has been secured yet. Search the manor sectors with your team.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2.5 pt-1">
              {linkedCluesFound.map(c => (
                <div
                  key={c.id}
                  className="px-3 py-1.5 rounded-lg bg-noir-900 border border-amberGold-500/40 text-amberGold-300 text-xs font-mono flex items-center gap-2 shadow-sm"
                >
                  {c.image ? (
                    <img src={c.image} alt={c.name} className="w-6 h-6 object-cover rounded border border-noir-750" />
                  ) : (
                    <span>{c.imagePlaceholder}</span>
                  )}
                  <span>{c.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Interrogation & Evidence Confrontation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          
          {/* Questioning */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-300 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amberGold-400" />
              <span>Interrogation Questioning</span>
            </h3>

            <div className="space-y-2.5">
              {currentSuspect.dialogue.map((item, idx) => {
                const isAsked = askedQuestions[`${currentSuspect.id}_${idx}`];

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-noir-950 border border-noir-800 hover:border-noir-700 transition"
                  >
                    <button
                      onClick={() => handleAskQuestion(idx, item)}
                      className="w-full text-left flex items-start justify-between gap-2 text-xs sm:text-sm font-sans font-medium text-amberGold-300 hover:text-amberGold-200 transition"
                    >
                      <span>Q: {item.question}</span>
                      <ChevronRight className="w-4 h-4 shrink-0 text-zinc-500 mt-0.5" />
                    </button>

                    {isAsked && (
                      <div className="mt-3 pt-3 border-t border-noir-800 text-xs font-typewriter text-zinc-200 leading-relaxed bg-noir-900 p-3 rounded">
                        <span className="text-zinc-400 block text-[10px] uppercase font-mono mb-1">
                          {currentSuspect.name}'s Response:
                        </span>
                        "{item.answer}"
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Confront with Evidence */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-300 flex items-center gap-2">
              <Gavel className="w-4 h-4 text-crimson-400" />
              <span>Confront with Shared Evidence</span>
            </h3>

            <div className="p-4 rounded-xl bg-noir-950 border border-noir-800 space-y-4">
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Found a contradiction in their testimony? Present an item from the shared room evidence archive to shatter their alibi.
              </p>

              {discoveredClues.length === 0 ? (
                <div className="p-4 text-center rounded bg-noir-900 border border-dashed border-noir-800 text-xs text-zinc-500">
                  No evidence discovered yet. Search the Manor sectors to find proof.
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
                      <option value="">-- Choose Evidence from Room Archive --</option>
                      {discoveredClues.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.imagePlaceholder} {c.name} ({c.category})
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
                        : 'bg-noir-800 text-zinc-600 cursor-not-allowed'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Confront Suspect (Objection!)</span>
                  </button>
                </div>
              )}

              {/* Feedback box */}
              {confrontFeedback && (
                <div className={`p-4 rounded-lg border animate-fade-in ${
                  confrontFeedback.success
                    ? 'bg-crimson-950/80 border-crimson-600/70 text-crimson-100'
                    : 'bg-noir-900 border-noir-700 text-zinc-300'
                }`}>
                  <div className="flex items-center gap-2 mb-2 font-mono text-xs font-bold">
                    {confrontFeedback.success ? (
                      <span className="text-crimson-400 flex items-center gap-1.5">
                        <Flame className="w-4 h-4 animate-bounce" />
                        CRITICAL CONTRADICTION EXPOSED!
                      </span>
                    ) : (
                      <span className="text-zinc-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        NO CONTRADICTION FOUND
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm font-typewriter italic leading-relaxed">
                    "{confrontFeedback.reaction}"
                  </p>

                  {confrontFeedback.breakdown && (
                    <div className="mt-3 pt-2 border-t border-crimson-800/60 text-xs font-sans text-amberGold-300 font-semibold">
                      💡 {confrontFeedback.breakdown}
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
