import React, { useState } from 'react';
import { 
  FolderArchive, 
  MapPin, 
  Link2, 
  Lock, 
  X
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

export function EvidenceArchive({ 
  evidence, 
  discoveredEvidenceIds, 
  suspects 
}) {
  const [filterCategory, setFilterCategory] = useState('All');
  const [inspectingClue, setInspectingClue] = useState(null);

  const categories = ['All', 'Forensic', 'Physical'];

  const filteredEvidence = evidence.filter(e => {
    if (filterCategory === 'All') return true;
    return e.category === filterCategory;
  });

  const getSuspectName = (id) => {
    const s = suspects.find(sus => sus.id === id);
    return s ? s.name : 'Unknown';
  };

  return (
    <div className="space-y-6">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-noir-900 border border-noir-750">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-lg bg-amberGold-500/20 text-amberGold-400">
            <FolderArchive className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-serif font-bold text-zinc-100 flex items-center gap-2">
              <span>Shared Evidence Archive</span>
              <span className="text-xs font-mono font-normal text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800">
                {discoveredEvidenceIds.length} / {evidence.length} SECURED
              </span>
            </h2>
            <p className="text-xs text-zinc-400 font-sans">
              All detectives in this room have synchronized access to these physical and forensic exhibits.
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center bg-noir-950 p-1 rounded-md border border-noir-750 font-mono text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sound.playTypewriter();
                setFilterCategory(cat);
              }}
              className={`px-3 py-1.5 rounded transition ${
                filterCategory === cat
                  ? 'bg-amberGold-600 text-black font-bold shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvidence.map((clue) => {
          const isDiscovered = discoveredEvidenceIds.includes(clue.id);
          const linkedSuspect = suspects.find(s => s.id === clue.linkedSuspectId);

          return (
            <div
              key={clue.id}
              onClick={() => {
                if (isDiscovered) {
                  sound.playPageTurn();
                  setInspectingClue(clue);
                }
              }}
              className={`p-5 rounded-xl border transition-all duration-300 flex flex-col justify-between min-h-[220px] ${
                isDiscovered
                  ? 'bg-noir-900/95 border-noir-700 hover:border-amberGold-500/70 hover:shadow-noir-glow cursor-pointer group'
                  : 'bg-noir-950/60 border-noir-800 text-zinc-600 border-dashed'
              }`}
            >
              {isDiscovered ? (
                <>
                  <div>
                    {/* Header: Visual Placeholder + Badge */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-noir-950 border border-noir-750 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                        {clue.imagePlaceholder}
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/60 text-emerald-400">
                          {clue.category}
                        </span>
                        <span className="text-[9px] font-mono text-amberGold-400 bg-amberGold-950/60 px-1.5 py-0.2 rounded border border-amberGold-800/40">
                          {clue.badge}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-serif font-bold text-base text-zinc-100 group-hover:text-amberGold-300 transition">
                      {clue.name}
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans mt-1 line-clamp-2 leading-relaxed">
                      {clue.summary}
                    </p>
                  </div>

                  {/* Footer: Location & Linked Suspect */}
                  <div className="pt-3 border-t border-noir-800 mt-4 space-y-1.5 text-xs font-sans">
                    <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-amberGold-500 shrink-0" />
                      <span className="truncate">{clue.locationName}</span>
                    </div>

                    {linkedSuspect && (
                      <div className="flex items-center gap-1.5 text-crimson-400 text-[11px] font-semibold">
                        <Link2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Connected: {linkedSuspect.name}</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-full p-4 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-noir-900 flex items-center justify-center text-zinc-600">
                    <Lock className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">
                    Undiscovered Exhibit
                  </span>
                  <p className="text-[11px] text-zinc-600 font-sans max-w-xs">
                    Search the crime scenes with your magnifying glass to log this evidence into the archive.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Forensic Report Modal */}
      {inspectingClue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-[#f7f2e4] text-[#1c1813] rounded-2xl shadow-2xl border-4 border-[#3e3427] p-6 relative font-typewriter space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#cfc09f]">
              <div className="flex items-center gap-2">
                <span className="bg-crimson-800 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                  OFFICIAL EXHIBIT FILE
                </span>
                <span className="text-xs text-[#524434] font-mono font-bold">
                  {inspectingClue.id.toUpperCase()}
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

            <div className="flex items-center gap-4">
              <span className="text-4xl p-2 rounded-xl bg-[#ede3ce] border border-[#cfc09f]">
                {inspectingClue.imagePlaceholder}
              </span>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#78644a] block font-bold">
                  {inspectingClue.category} Exhibit • {inspectingClue.badge}
                </span>
                <h3 className="text-xl font-serif font-black text-[#140f0a]">
                  {inspectingClue.name}
                </h3>
              </div>
            </div>

            <div className="bg-[#ede2cb] p-4 rounded-lg border border-[#cfc09f] shadow-inner text-xs sm:text-sm text-[#2a2218] leading-relaxed">
              <strong>Coroner & Forensic Lab Breakdown:</strong>
              <p className="mt-1.5">{inspectingClue.detail}</p>
            </div>

            <div className="p-3 bg-[#e4d6ba] rounded-lg border border-[#c4b595] text-xs space-y-1">
              <div>
                <strong>Discovery Location:</strong> {inspectingClue.locationName}
              </div>
              {inspectingClue.linkedSuspectId && (
                <div className="text-crimson-900 font-bold">
                  Suspect Link: Connects directly to {getSuspectName(inspectingClue.linkedSuspectId)}. Present this during interrogation to shatter their alibi!
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t-2 border-[#cfc09f]">
              <button
                onClick={() => {
                  sound.playPageTurn();
                  setInspectingClue(null);
                }}
                className="px-5 py-2 rounded bg-[#3b2d1d] hover:bg-[#251b10] text-[#f5eedc] text-xs font-bold uppercase tracking-wider transition"
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
