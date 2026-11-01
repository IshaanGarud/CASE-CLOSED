import React, { useState } from 'react';
import { 
  Skull, 
  Wine, 
  BookOpen, 
  Flower2, 
  Search, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ZoomIn, 
  Eye,
  Key,
  Flame,
  UserX,
  ShieldAlert,
  Music,
  GlassWater,
  Shirt,
  Sword
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

const ICON_MAP = {
  Skull,
  Wine,
  BookOpen,
  Flower2,
  Search,
  ZoomIn,
  Key,
  Flame,
  UserX,
  ShieldAlert,
  Music,
  GlassWater,
  Shirt,
  Sword,
  Clock,
  Sparkles
};

export function LocationExplorer({ 
  locations, 
  clues, 
  collectedClueIds: _collectedClueIds, 
  onExamineHotspot 
}) {
  const [selectedLocationId, setSelectedLocationId] = useState(locations[0].id);
  const [activeInspection, setActiveInspection] = useState(null);
  const [isExamining, setIsExamining] = useState(false);

  const currentLocation = locations.find((l) => l.id === selectedLocationId) || locations[0];

  const handleInspectHotspot = (hotspot) => {
    sound.playInspect();
    setIsExamining(true);
    setTimeout(() => {
      setIsExamining(false);
      setActiveInspection(hotspot);
      onExamineHotspot(currentLocation.id, hotspot.id, hotspot.clueReward);
      sound.playClueFound();
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Location Selector Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {locations.map((loc) => {
          const LocIcon = ICON_MAP[loc.icon] || Search;
          const isSelected = loc.id === selectedLocationId;
          const examinedCount = loc.hotspots.filter(h => h.examined).length;
          const totalHotspots = loc.hotspots.length;
          const isComplete = examinedCount === totalHotspots;

          return (
            <button
              key={loc.id}
              onClick={() => {
                sound.playPageTurn();
                setSelectedLocationId(loc.id);
              }}
              className={`text-left p-3.5 rounded-lg border transition-all duration-300 relative overflow-hidden group ${
                isSelected
                  ? 'bg-noir-800 border-amberGold-500/60 shadow-noir-glow ring-1 ring-amberGold-500/30'
                  : 'bg-noir-900/80 border-noir-750 hover:bg-noir-850 hover:border-noir-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`p-1.5 rounded-md ${isSelected ? 'bg-amberGold-500/20 text-amberGold-400' : 'bg-noir-800 text-zinc-400'}`}>
                  <LocIcon className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-noir-950 text-zinc-400">
                  {examinedCount}/{totalHotspots} Explored
                </span>
              </div>
              <h3 className={`font-serif font-bold text-sm sm:text-base ${isSelected ? 'text-amberGold-300' : 'text-zinc-200'}`}>
                {loc.name}
              </h3>
              <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5 font-sans">
                {loc.tagline.split('•')[0]}
              </p>
              
              {isComplete && (
                <div className="absolute top-2 right-2 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Location Main Stage */}
      <div className={`p-6 rounded-xl border border-noir-700 bg-gradient-to-b ${currentLocation.bgPattern} shadow-2xl relative overflow-hidden`}>
        
        {/* Subtle Noir Vignette & Atmosphere */}
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-40" />

        {/* Header of Scene */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-noir-700/60 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-amberGold-400 bg-amberGold-500/10 px-2 py-0.5 rounded border border-amberGold-500/20">
                SCENE INSPECTION
              </span>
              <span className="text-xs text-zinc-400 font-mono">{currentLocation.tagline}</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-zinc-100 mt-1">
              {currentLocation.name}
            </h2>
            <p className="text-xs text-zinc-300 font-sans mt-1 max-w-2xl leading-relaxed">
              {currentLocation.description}
            </p>
          </div>

          <div className="text-right font-mono text-xs text-zinc-400 bg-noir-950/60 px-3 py-1.5 rounded border border-noir-750 self-start sm:self-auto">
            <span>Investigation Cost: </span>
            <span className="text-amberGold-400 font-bold">30 mins / search</span>
          </div>
        </div>

        {/* Interactive Hotspot Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
          {currentLocation.hotspots.map((hs) => {
            const HSIcon = ICON_MAP[hs.icon] || Search;
            const rewardClue = clues.find((c) => c.id === hs.clueReward);

            return (
              <div
                key={hs.id}
                className={`p-4 rounded-lg border transition-all duration-300 flex flex-col justify-between ${
                  hs.examined
                    ? 'bg-noir-950/80 border-emerald-900/40 shadow-inner'
                    : 'bg-noir-900/90 border-noir-700 hover:border-amberGold-500/50 hover:shadow-noir-glow'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`p-2 rounded-md ${hs.examined ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40' : 'bg-noir-800 text-amberGold-400 border border-noir-700'}`}>
                        <HSIcon className="w-4 h-4" />
                      </span>
                      <h4 className="font-serif font-bold text-sm text-zinc-200">
                        {hs.name}
                      </h4>
                    </div>
                    {hs.examined ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50">
                        <CheckCircle2 className="w-3 h-3" /> SECURED
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-amberGold-400 bg-amberGold-950/40 px-2 py-0.5 rounded border border-amberGold-800/50">
                        UNEXAMINED
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-3">
                    {hs.examined ? hs.inspectionText : "Area holds potential clues or traces left during the storm. Click below to inspect with your magnifying glass."}
                  </p>

                  {hs.examined && rewardClue && (
                    <div className="p-2 rounded bg-noir-850 border border-noir-750 text-xs font-mono flex items-center justify-between text-zinc-300 mb-3">
                      <span className="text-amberGold-400 font-semibold truncate">
                        🔑 {rewardClue.name}
                      </span>
                      <span className="text-[10px] bg-noir-800 px-1.5 py-0.5 rounded text-zinc-400">
                        {rewardClue.category}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-noir-800 flex items-center justify-between">
                  <button
                    onClick={() => handleInspectHotspot(hs)}
                    disabled={isExamining}
                    className={`w-full py-2 px-3 rounded text-xs font-mono font-bold tracking-wider transition flex items-center justify-center gap-2 shadow ${
                      hs.examined
                        ? 'bg-noir-800 hover:bg-noir-750 text-zinc-300 border border-noir-700'
                        : 'bg-amberGold-600 hover:bg-amberGold-500 text-black shadow-noir-glow'
                    }`}
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>{hs.examined ? 'Review Forensics' : 'Inspect Area (0.5 hrs)'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Forensic Inspection Modal Popup */}
      {activeInspection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-noir-900 border-2 border-amberGold-500/60 rounded-xl shadow-2xl p-6 relative overflow-hidden font-sans">
            
            <div className="flex items-center justify-between pb-3 border-b border-noir-750">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded bg-amberGold-500/20 text-amberGold-400">
                  <Eye className="w-4 h-4" />
                </span>
                <span className="text-xs uppercase font-mono tracking-widest text-amberGold-400">
                  DETECTIVE'S FORENSIC LOG
                </span>
              </div>
              <button
                onClick={() => {
                  sound.playPageTurn();
                  setActiveInspection(null);
                }}
                className="text-zinc-400 hover:text-white text-xs font-mono px-2 py-1 bg-noir-800 rounded"
              >
                ESC / CLOSE
              </button>
            </div>

            <div className="py-5 space-y-4">
              <h3 className="text-xl font-serif font-bold text-zinc-100">
                {activeInspection.name}
              </h3>
              
              <div className="p-4 rounded-lg bg-noir-950 border border-noir-800 text-xs sm:text-sm text-zinc-300 leading-relaxed font-typewriter">
                {activeInspection.inspectionText}
              </div>

              {activeInspection.clueReward && (
                <div className="p-3.5 rounded-lg bg-gradient-to-r from-emerald-950/60 to-noir-900 border border-emerald-600/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 text-lg">📌</span>
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 block">
                        NEW EVIDENCE LOGGED
                      </span>
                      <span className="text-sm font-serif font-bold text-zinc-100">
                        {activeInspection.evidenceTitle}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 px-2 py-1 rounded bg-emerald-950 border border-emerald-800">
                    Added to Corkboard
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-noir-750">
              <button
                onClick={() => {
                  sound.playPageTurn();
                  setActiveInspection(null);
                }}
                className="px-5 py-2 rounded bg-amberGold-600 hover:bg-amberGold-500 text-black text-xs font-mono font-bold tracking-wider transition shadow-noir-glow"
              >
                Continue Search
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
