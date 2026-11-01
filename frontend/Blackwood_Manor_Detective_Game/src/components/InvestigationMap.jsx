import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Users, 
  Search, 
  CheckCircle2, 
  ZoomIn, 
  Eye, 
  ArrowLeft,
  Sparkles,
  Clock,
  Skull,
  Wine,
  Flower2,
  Flame,
  UserX,
  Music
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

const ICON_MAP = {
  Skull,
  Wine,
  Flower2,
  Search,
  UserX,
  Clock,
  Sparkles,
  Music,
  Flame
};

export function InvestigationMap({ 
  locations, 
  evidence, 
  discoveredEvidenceIds, 
  players, 
  currentPlayerId: _currentPlayerId, 
  onInspectHotspot, 
  onMoveLocation 
}) {
  const [selectedLocationId, setSelectedLocationId] = useState(locations[0].id);
  const [inRoomView, setInRoomView] = useState(false);
  const [activeInspection, setActiveInspection] = useState(null);
  const [isExamining, setIsExamining] = useState(false);

  const currentLocation = locations.find(l => l.id === selectedLocationId) || locations[0];

  const getPlayersInLocation = (locId) => {
    return players.filter(p => p.currentLocationId === locId);
  };

  const handleSelectLocation = (locId) => {
    sound.playPageTurn();
    setSelectedLocationId(locId);
    onMoveLocation(locId);
  };

  const handleEnterLocation = (locId) => {
    sound.playPageTurn();
    setSelectedLocationId(locId);
    onMoveLocation(locId);
    setInRoomView(true);
  };

  const handleInspect = (hotspot) => {
    sound.playInspect();
    setIsExamining(true);
    setTimeout(() => {
      setIsExamining(false);
      setActiveInspection(hotspot);
      onInspectHotspot(currentLocation.id, hotspot.id, hotspot.clueId);
      if (hotspot.clueId) {
        sound.playClueFound();
      }
    }, 500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Map Ribbon */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-noir-900 border border-noir-750 shadow-lg">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-lg bg-amberGold-500/20 text-amberGold-400">
            <Compass className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-serif font-bold text-zinc-100 flex items-center gap-2">
              <span>Blackwood Manor Estate Blueprint</span>
              <span className="text-xs font-mono font-normal text-amberGold-400 px-2 py-0.5 rounded bg-noir-950 border border-noir-750">
                CASE CC-001
              </span>
            </h2>
            <p className="text-xs text-zinc-400 font-sans">
              Select a sector to preview forensics, or enter the scene to inspect physical evidence.
            </p>
          </div>
        </div>

        {inRoomView && (
          <button
            onClick={() => {
              sound.playPageTurn();
              setInRoomView(false);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-noir-800 hover:bg-noir-750 border border-noir-700 text-zinc-200 text-xs font-mono flex items-center gap-1.5 transition shadow"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Manor Map</span>
          </button>
        )}
      </div>

      {/* VIEW 1: Interactive Location Map & Sector Cards */}
      {!inRoomView ? (
        <div className="space-y-6">
          
          {/* Location Photographic Cards Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {locations.map((loc) => {
              const isSelected = loc.id === selectedLocationId;
              const playersHere = getPlayersInLocation(loc.id);
              const cluesHere = evidence.filter(e => e.locationId === loc.id);
              const discoveredHere = cluesHere.filter(e => discoveredEvidenceIds.includes(e.id)).length;
              const isAllFound = discoveredHere === cluesHere.length && cluesHere.length > 0;

              return (
                <div
                  key={loc.id}
                  onClick={() => handleSelectLocation(loc.id)}
                  className={`rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer group relative ${
                    isSelected
                      ? 'bg-noir-900 border-amberGold-500 shadow-noir-glow ring-2 ring-amberGold-500/30 scale-102'
                      : 'bg-noir-950 border-noir-750 hover:border-noir-600 hover:bg-noir-900'
                  }`}
                >
                  {/* Location Atmospheric Image */}
                  <div className="relative h-48 overflow-hidden bg-noir-950">
                    <img 
                      src={loc.image} 
                      alt={loc.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100" 
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-transparent to-black/40" />

                    {/* Top Status Tags */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-zinc-700 text-zinc-200 font-bold">
                        {loc.zone.split('•')[0]}
                      </span>

                      {isAllFound ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/90 border border-emerald-600 text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> SECURED
                        </span>
                      ) : discoveredHere > 0 ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amberGold-950/90 border border-amberGold-600 text-amberGold-400 font-bold">
                          {discoveredHere}/{cluesHere.length} Clues
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-noir-900/80 border border-zinc-700 text-zinc-400">
                          Unsearched
                        </span>
                      )}
                    </div>

                    {/* Teammates Floating Badge */}
                    {playersHere.length > 0 && (
                      <div className="absolute bottom-2 left-3 flex items-center gap-1">
                        {playersHere.map(p => (
                          <span 
                            key={p.id}
                            className="text-xs px-2 py-0.5 rounded-full bg-noir-900/90 border border-amberGold-500/50 text-amberGold-300 font-mono shadow"
                            title={`${p.name} is currently here`}
                          >
                            {p.avatar} {p.name.split(' ')[0]}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Content Details */}
                  <div className="p-5 space-y-2">
                    <h3 className="font-serif font-black text-lg text-zinc-100 group-hover:text-amberGold-300 transition">
                      {loc.name}
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans line-clamp-2 leading-relaxed">
                      {loc.description}
                    </p>

                    <div className="pt-3 border-t border-noir-800 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-zinc-500">
                        {loc.hotspots.length} Search Hotspots
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEnterLocation(loc.id);
                        }}
                        className="px-3 py-1.5 rounded bg-amberGold-600 hover:bg-amberGold-500 text-black font-mono font-bold text-xs uppercase tracking-wider transition shadow flex items-center gap-1"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>Enter Room</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      ) : (
        /* VIEW 2: Inside Location Room Search View with Atmospheric Image Backdrop */
        <div className="space-y-6">
          
          {/* Main Visual Scene Banner */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-noir-700 shadow-2xl bg-noir-950">
            <img 
              src={currentLocation.image} 
              alt={currentLocation.name} 
              className="w-full h-72 sm:h-96 object-cover object-center filter brightness-95 contrast-105"
            />
            
            {/* Dark Vignette Overlay with Hotspot Markers */}
            <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir-950/40 to-transparent flex flex-col justify-end p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amberGold-400 bg-amberGold-500/20 px-2 py-0.5 rounded border border-amberGold-500/30">
                      CURRENT INVESTIGATION SECTOR
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">{currentLocation.zone}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-white">
                    {currentLocation.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-300 font-sans max-w-2xl mt-1 leading-relaxed">
                    {currentLocation.description}
                  </p>
                </div>

                {/* Detectives with you in this room */}
                <div className="flex items-center gap-2 font-mono text-xs text-zinc-300 bg-noir-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-noir-750 self-start sm:self-auto">
                  <Users className="w-4 h-4 text-amberGold-400" />
                  <span>With You: </span>
                  <div className="flex gap-1">
                    {getPlayersInLocation(currentLocation.id).map(p => (
                      <span key={p.id} className="text-xs bg-noir-800 px-2 py-0.5 rounded border border-noir-700 text-zinc-200">
                        {p.avatar} {p.name.split(' ')[0]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hotspots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentLocation.hotspots.map((hs) => {
              const HSIcon = ICON_MAP[hs.icon] || Search;
              const rewardClue = evidence.find(e => e.id === hs.clueId);
              const isFound = hs.clueId && discoveredEvidenceIds.includes(hs.clueId);

              return (
                <div
                  key={hs.id}
                  className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                    isFound
                      ? 'bg-noir-950/90 border-emerald-900/60 shadow-inner'
                      : 'bg-noir-900/90 border-noir-750 hover:border-amberGold-500/50 hover:shadow-noir-glow'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`p-2 rounded-md ${isFound ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40' : 'bg-noir-800 text-amberGold-400 border border-noir-700'}`}>
                          <HSIcon className="w-4 h-4" />
                        </span>
                        <h4 className="font-serif font-bold text-sm text-zinc-200">
                          {hs.name}
                        </h4>
                      </div>

                      {isFound ? (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/50">
                          <CheckCircle2 className="w-3 h-3" /> SECURED
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-amberGold-400 bg-amberGold-950/40 px-2 py-0.5 rounded border border-amberGold-800/50">
                          UNSEARCHED
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-3">
                      {hs.description}
                    </p>

                    {isFound && rewardClue && (
                      <div className="p-2.5 rounded bg-noir-850 border border-noir-750 text-xs font-mono flex items-center justify-between text-zinc-300 mb-3">
                        <span className="text-amberGold-400 font-semibold truncate flex items-center gap-2">
                          <img src={rewardClue.image} alt={rewardClue.name} className="w-6 h-6 object-contain rounded" />
                          <span>{rewardClue.name}</span>
                        </span>
                        <span className="text-[10px] bg-noir-800 px-1.5 py-0.5 rounded text-zinc-400">
                          {rewardClue.category}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-noir-800">
                    <button
                      onClick={() => handleInspect(hs)}
                      disabled={isExamining}
                      className={`w-full py-2 px-3 rounded text-xs font-mono font-bold tracking-wider transition flex items-center justify-center gap-2 ${
                        isFound
                          ? 'bg-noir-800 hover:bg-noir-750 text-zinc-300 border border-noir-700'
                          : 'bg-amberGold-600 hover:bg-amberGold-500 text-black shadow-noir-glow'
                      }`}
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>{isFound ? 'Review Forensic Findings' : 'Inspect with Magnifier'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Forensic Zoom Inspection Modal with Clue Image */}
      {activeInspection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-noir-900 border-2 border-amberGold-500/70 rounded-xl shadow-2xl p-6 relative font-sans space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-noir-750">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded bg-amberGold-500/20 text-amberGold-400">
                  <Eye className="w-4 h-4" />
                </span>
                <span className="text-xs uppercase font-mono tracking-widest text-amberGold-400">
                  FORENSIC MAGNIFIER LOG
                </span>
              </div>
              <button
                onClick={() => {
                  sound.playPageTurn();
                  setActiveInspection(null);
                }}
                className="text-zinc-400 hover:text-white text-xs font-mono px-2 py-1 bg-noir-800 rounded"
              >
                CLOSE
              </button>
            </div>

            <h3 className="text-xl font-serif font-bold text-zinc-100">
              {activeInspection.name}
            </h3>

            <div className="p-4 rounded-lg bg-noir-950 border border-noir-800 text-xs sm:text-sm text-zinc-300 leading-relaxed font-typewriter">
              {activeInspection.description}
            </div>

            {activeInspection.clueId && (
              <div className="p-3.5 rounded-lg bg-gradient-to-r from-emerald-950/70 to-noir-900 border border-emerald-600/60 flex items-center gap-3">
                <img 
                  src={evidence.find(e => e.id === activeInspection.clueId)?.image} 
                  alt="Clue" 
                  className="w-14 h-14 object-cover rounded-lg border border-emerald-500/40 shadow shrink-0"
                />
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 block font-bold">
                    SHARED EVIDENCE UNLOCKED
                  </span>
                  <span className="text-sm font-serif font-bold text-zinc-100">
                    {evidence.find(e => e.id === activeInspection.clueId)?.name}
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-noir-750">
              <button
                onClick={() => {
                  sound.playPageTurn();
                  setActiveInspection(null);
                }}
                className="px-5 py-2 rounded bg-amberGold-600 hover:bg-amberGold-500 text-black text-xs font-mono font-bold tracking-wider transition shadow-noir-glow"
              >
                Acknowledge & Continue
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
