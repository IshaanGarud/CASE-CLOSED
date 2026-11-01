import React, { useState } from 'react';
import { 
  Lock,
  X,
  Link2
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

export function EvidenceBoard({ 
  clues, 
  collectedClueIds, 
  suspects 
}) {
  const [filterCategory, setFilterCategory] = useState('All');
  const [inspectingClue, setInspectingClue] = useState(null);
  const [showRedStrings, setShowRedStrings] = useState(true);

  const categories = ['All', 'Forensic', 'Physical', 'Document'];

  const filteredClues = clues.filter((c) => {
    if (filterCategory === 'All') return true;
    return c.category === filterCategory;
  });

  const getSuspectName = (id) => {
    const s = suspects.find(sus => sus.id === id);
    return s ? s.name : 'Unknown';
  };

  return (
    <div className="space-y-6">
      
      {/* Board Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-noir-900 border border-noir-750">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-amberGold-500/20 text-amberGold-400">
            📌
          </span>
          <div>
            <h2 className="text-lg font-serif font-bold text-zinc-100">
              The Crime Board
            </h2>
            <p className="text-xs text-zinc-400 font-sans">
              Pinned forensic findings, crime scene artifacts & connected threads
            </p>
          </div>
        </div>

        {/* Filters & String Toggle */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="flex items-center bg-noir-950 p-1 rounded-md border border-noir-750">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sound.playTypewriter();
                  setFilterCategory(cat);
                }}
                className={`px-3 py-1 rounded text-xs transition ${
                  filterCategory === cat
                    ? 'bg-amberGold-600 text-black font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              sound.playTypewriter();
              setShowRedStrings(!showRedStrings);
            }}
            className={`px-3 py-1.5 rounded-md border transition flex items-center gap-1.5 ${
              showRedStrings
                ? 'bg-crimson-950/80 border-crimson-600/60 text-crimson-300 font-bold'
                : 'bg-noir-950 border-noir-750 text-zinc-400'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Red Yarn: {showRedStrings ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* The Corkboard Workspace */}
      <div className="corkboard rounded-2xl p-6 sm:p-8 border-8 border-[#3b291a] shadow-2xl min-h-[500px] relative overflow-hidden">
        
        {/* Subtle Vignette & Pinned Note Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="bg-[#f5eedc] text-[#221c15] px-4 py-2 rounded shadow-md border border-[#c4b595] font-typewriter text-xs transform -rotate-1">
            📌 <strong>CASE EVIDENCE LOG:</strong> Click any pinned card for high-resolution forensic analysis.
          </div>
          <div className="bg-noir-950/90 text-amberGold-400 font-mono text-xs px-3 py-1 rounded border border-noir-750">
            {collectedClueIds.length} / {clues.length} Collected
          </div>
        </div>

        {/* Pinned Clue Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredClues.map((clue, idx) => {
            const isFound = collectedClueIds.includes(clue.id);
            const linkedSuspect = suspects.find(s => s.id === clue.linkedSuspect);

            // Subtle rotation tilt for authentic paper feel
            const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2'];
            const rotClass = rotations[idx % rotations.length];

            return (
              <div
                key={clue.id}
                className={`relative transform transition-all duration-300 ${rotClass} hover:rotate-0 hover:scale-105 hover:z-20`}
              >
                {/* Brass Thumbtack Pin */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 w-4 h-4 rounded-full bg-gradient-to-br from-yellow-300 via-amberGold-500 to-amber-900 border border-yellow-200 shadow-md flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-950 opacity-60" />
                </div>

                {/* Evidence Card */}
                <div
                  onClick={() => {
                    if (isFound) {
                      sound.playPageTurn();
                      setInspectingClue(clue);
                    }
                  }}
                  className={`p-4 rounded-lg shadow-xl border cursor-pointer flex flex-col justify-between min-h-[190px] ${
                    isFound
                      ? 'paper-texture border-[#cfbe99] text-[#1c1813]'
                      : 'bg-noir-900/90 border-noir-750 text-zinc-500 border-dashed'
                  }`}
                >
                  {isFound ? (
                    <>
                      <div>
                        {/* Header Badges */}
                        <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                          <span className="px-2 py-0.5 rounded bg-[#3b2d1d] text-[#f7ecd5] font-bold">
                            {clue.category}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded font-bold ${clue.critical ? 'bg-crimson-800 text-white' : 'bg-[#ded0b1] text-[#4a3a25]'}`}>
                            {clue.badge}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="font-serif font-black text-sm text-[#140f0a] leading-snug mb-1">
                          {clue.name}
                        </h4>

                        {/* Summary */}
                        <p className="text-xs font-typewriter text-[#423626] line-clamp-3 leading-tight mt-1">
                          {clue.summary}
                        </p>
                      </div>

                      {/* Footer & Linked Suspect */}
                      <div className="pt-2 border-t border-[#d8cbb0] mt-3">
                        {showRedStrings && linkedSuspect && (
                          <div className="flex items-center gap-1.5 text-[11px] font-sans font-semibold text-crimson-800">
                            <span className="w-2 h-2 rounded-full bg-crimson-600 animate-pulse" />
                            <span>Linked: {linkedSuspect.name}</span>
                          </div>
                        )}
                        <span className="text-[10px] font-mono text-[#78644a] block mt-1">
                          [Click for Forensic Report]
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center h-full p-4 space-y-2">
                      <Lock className="w-6 h-6 text-zinc-600" />
                      <span className="text-xs font-mono uppercase text-zinc-500">
                        Undiscovered Clue
                      </span>
                      <p className="text-[11px] text-zinc-600 font-sans">
                        Search the crime scenes to unlock this evidence.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Clue Zoom & Detailed Forensic Inspection Modal */}
      {inspectingClue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-[#f7f2e4] text-[#1e1913] rounded-xl shadow-2xl border-4 border-[#3e3427] p-6 relative overflow-hidden font-typewriter">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#cfc09f]">
              <div className="flex items-center gap-2">
                <span className="bg-crimson-800 text-white text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded">
                  EVIDENCE FILE
                </span>
                <span className="text-xs text-[#524434] font-mono font-bold">
                  TAG #{inspectingClue.id.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => {
                  sound.playPageTurn();
                  setInspectingClue(null);
                }}
                className="text-[#524434] hover:text-black transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="py-4 space-y-4">
              <div>
                <span className="text-[11px] font-mono uppercase text-amberGold-700 block font-bold">
                  {inspectingClue.category} Artifact • {inspectingClue.badge}
                </span>
                <h3 className="text-xl font-serif font-black text-[#140f0a] mt-0.5">
                  {inspectingClue.name}
                </h3>
              </div>

              <div className="bg-[#ede2cb] p-4 rounded border border-[#cfc09f] shadow-inner text-xs sm:text-sm text-[#2d2419] leading-relaxed">
                <strong>Forensic & Detective Analysis:</strong>
                <p className="mt-1">{inspectingClue.detail}</p>
              </div>

              {inspectingClue.linkedSuspect && (
                <div className="p-3 bg-[#e4d6ba] rounded border border-[#c4b595] text-xs">
                  <span className="font-bold text-crimson-900 block mb-0.5">
                    Suspect Connection:
                  </span>
                  <span className="text-[#3b2d1d]">
                    Points directly toward <strong>{getSuspectName(inspectingClue.linkedSuspect)}</strong>. Use this during interrogation to dismantle their alibi!
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-3 border-t-2 border-[#cfc09f]">
              <button
                onClick={() => {
                  sound.playPageTurn();
                  setInspectingClue(null);
                }}
                className="px-4 py-2 rounded bg-[#3b2d1d] hover:bg-[#251b10] text-[#f5eedc] text-xs font-bold uppercase tracking-wider transition"
              >
                Close Evidence Dossier
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
