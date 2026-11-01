import React from 'react';
import { 
  Shield, 
  Clock, 
  Search, 
  Volume2, 
  VolumeX, 
  CloudRain, 
  BookOpen, 
  Users,
  Compass,
  CheckSquare,
  Gavel,
  FolderArchive
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

export function Header({ 
  currentRoom, 
  currentPlayerId: _currentPlayerId, 
  hoursLeft, 
  cluesCount, 
  totalClues = 5, 
  isMuted, 
  onToggleMute, 
  isRaining, 
  onToggleRain,
  onOpenDossier,
  onOpenLobby,
  activeTab,
  setActiveTab
}) {
  const timeStrings = {
    6: "12:05 AM",
    5.5: "12:35 AM",
    5: "01:05 AM",
    4.5: "01:35 AM",
    4: "02:05 AM",
    3.5: "02:35 AM",
    3: "03:05 AM",
    2.5: "03:35 AM",
    2: "04:05 AM",
    1.5: "04:35 AM",
    1: "05:05 AM",
    0.5: "05:35 AM",
    0: "06:00 AM (DAWN)"
  };

  const currentTime = timeStrings[hoursLeft] || `${hoursLeft}h until dawn`;
  const players = currentRoom?.players || [];

  return (
    <header className="sticky top-0 z-40 bg-noir-950/90 backdrop-blur-md border-b border-noir-700/80 px-4 lg:px-8 py-3 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Title and Room Badge */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-amberGold-600/30 to-amber-950 border border-amberGold-500/40 shadow-noir-glow">
            <Shield className="w-6 h-6 text-amberGold-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-[0.25em] uppercase font-mono px-2 py-0.5 rounded bg-noir-800 border border-noir-700 text-amberGold-400 font-bold">
                CASE CLOSED
              </span>
              <span className="text-xs font-mono text-zinc-400">CC-001</span>
              {currentRoom && (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amberGold-950/60 border border-amberGold-700/50 text-amberGold-300 font-bold">
                  ROOM {currentRoom.roomCode}
                </span>
              )}
            </div>
            <h1 className="text-base sm:text-lg font-cinzel font-bold tracking-wide text-zinc-100 flex items-center gap-2">
              The Blackwood Manor Mystery
            </h1>
          </div>
        </div>

        {/* Status Indicators & Room Teammates */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-mono">
          
          {/* Active Teammates Pill */}
          {players.length > 0 && (
            <div 
              onClick={onOpenLobby}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-noir-900 border border-noir-750 shadow-inner cursor-pointer hover:border-amberGold-500/40 transition"
              title="Click to view full room player roster"
            >
              <Users className="w-3.5 h-3.5 text-amberGold-400" />
              <span className="text-zinc-300 font-semibold">{players.length} Detectives</span>
              <div className="flex -space-x-1 ml-1">
                {players.map(p => (
                  <span 
                    key={p.id} 
                    className="text-xs w-5 h-5 rounded-full bg-noir-800 flex items-center justify-center border border-noir-700"
                    title={`${p.name} (${p.isHost ? 'Host' : 'Member'})`}
                  >
                    {p.avatar}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Time Remaining */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-noir-900 border border-noir-750 shadow-inner">
            <Clock className="w-3.5 h-3.5 text-amberGold-500 animate-pulse" />
            <div>
              <span className="text-zinc-400 block text-[9px] uppercase tracking-wider">Clock / Time</span>
              <span className={`font-semibold ${hoursLeft <= 1.5 ? 'text-crimson-500 font-bold' : 'text-zinc-200'}`}>
                {currentTime}
              </span>
            </div>
          </div>

          {/* Evidence Tracker */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-noir-900 border border-noir-750 shadow-inner">
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            <div>
              <span className="text-zinc-400 block text-[9px] uppercase tracking-wider">Room Evidence</span>
              <span className="text-emerald-400 font-semibold">{cluesCount} / {totalClues}</span>
            </div>
          </div>

          {/* Dossier Quick View */}
          <button
            onClick={() => {
              sound.playPageTurn();
              onOpenDossier();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-noir-800 hover:bg-noir-750 border border-amberGold-500/30 text-amberGold-300 hover:text-amberGold-200 transition shadow"
            title="Open Case Dossier & Autopsy"
          >
            <BookOpen className="w-3.5 h-3.5 text-amberGold-400" />
            <span>Case File</span>
          </button>

          {/* Audio Controls */}
          <div className="flex items-center gap-1 bg-noir-900 border border-noir-750 rounded-md p-1">
            <button
              onClick={() => {
                sound.playTypewriter();
                onToggleRain();
              }}
              className={`p-1.5 rounded transition ${isRaining ? 'bg-amberGold-500/20 text-amberGold-400 border border-amberGold-500/40' : 'text-zinc-400 hover:text-zinc-200'}`}
              title={isRaining ? "Stop Rain Sound" : "Play Rain Sound"}
            >
              <CloudRain className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                sound.playTypewriter();
                onToggleMute();
              }}
              className={`p-1.5 rounded transition ${isMuted ? 'text-crimson-400' : 'text-zinc-300 hover:text-zinc-100'}`}
              title={isMuted ? "Unmute Audio" : "Mute Audio"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Lobby / Roster Switcher */}
          <button
            onClick={onOpenLobby}
            className="p-1.5 rounded text-zinc-400 hover:text-zinc-200 hover:bg-noir-800 transition"
            title="Room Lobby & Player Roster"
          >
            <Users className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Ribbon */}
      <div className="max-w-7xl mx-auto mt-3 pt-2 border-t border-noir-800/80 flex items-center justify-center sm:justify-start gap-1 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'lobby', label: 'Room Lobby', icon: Users },
          { id: 'map', label: 'Investigation Map', icon: Compass },
          { id: 'suspects', label: 'Suspect Dossiers', icon: Users },
          { id: 'evidence', label: 'Shared Evidence', icon: FolderArchive },
          { id: 'tasks', label: 'Tasks', icon: CheckSquare },
          { id: 'journal', label: 'Case Journal', icon: BookOpen },
          { id: 'accusation', label: 'Cooperative Verdict', icon: Gavel, highlight: true }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playPageTurn();
                setActiveTab(tab.id);
              }}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium tracking-wide transition flex items-center gap-1.5 whitespace-nowrap ${
                isSelected
                  ? tab.highlight 
                    ? 'bg-crimson-700 text-white font-bold shadow-blood-glow border border-crimson-500' 
                    : 'bg-amberGold-500/20 text-amberGold-300 border border-amberGold-500/40 shadow-noir-glow'
                  : tab.highlight
                    ? 'bg-crimson-950/40 text-crimson-400 hover:bg-crimson-900/50 border border-crimson-800/40 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-noir-850'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
