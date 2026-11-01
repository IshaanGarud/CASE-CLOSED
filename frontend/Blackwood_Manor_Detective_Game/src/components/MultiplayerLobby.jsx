import React, { useState } from 'react';
import { 
  Users, 
  Shield, 
  Copy, 
  Check, 
  Play, 
  UserPlus, 
  Clock, 
  ArrowRight,
  Sparkles,
  Lock,
  Layers
} from 'lucide-react';
import { CASE_CC001 } from '../data/caseCC001';
import { sound } from '../utils/soundEffects';

const AVATAR_OPTIONS = ['🕵️‍♂️', '🕵️‍♀️', '🎩', '🔍', '💼', '🍷'];

export function MultiplayerLobby({ 
  currentRoom, 
  currentPlayerId, 
  onCreateRoom, 
  onJoinRoom, 
  onStartInvestigation,
  onAddSimulatedTeammate 
}) {
  const [playerName, setPlayerName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🕵️‍♂️');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState(currentRoom ? 'room' : 'create');

  React.useEffect(() => {
    setActiveTab(currentRoom ? 'room' : 'create');
  }, [currentRoom]);

  const handleCopyCode = () => {
    if (!currentRoom) return;
    navigator.clipboard?.writeText(currentRoom.roomCode);
    setCopiedCode(true);
    sound.playTypewriter();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    sound.playTypewriter();
    onCreateRoom(playerName.trim(), selectedAvatar);
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (!joinCodeInput.trim() || !playerName.trim()) return;
    sound.playTypewriter();
    onJoinRoom(joinCodeInput.trim().toUpperCase(), playerName.trim(), selectedAvatar);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in py-4">
      
      {/* Cinematic Full-Width Mystery Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-amberGold-500/40 shadow-2xl bg-noir-950 group">
        <img 
          src={CASE_CC001.heroImage} 
          alt="Blackwood Manor Midnight"
          className="w-full h-64 sm:h-80 md:h-96 object-cover object-center filter brightness-90 contrast-110 group-hover:scale-102 transition-transform duration-700" 
        />
        
        {/* Cinematic Vignette & Title Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir-950/60 to-transparent flex flex-col justify-end p-6 sm:p-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-noir-900/90 border border-amberGold-500/50 text-amberGold-400 font-mono text-xs uppercase tracking-widest shadow-noir-glow w-fit mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>CASE CLOSED • COOPERATIVE BUREAU</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-cinzel font-black tracking-wider text-white uppercase drop-shadow-lg">
            Case Closed
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-zinc-300 font-serif italic max-w-2xl mt-1 leading-relaxed">
            "A ruthless tycoon poisoned. A tampered clock. Three suspects with burning motives. Assemble your detectives and crack the case together before dawn."
          </p>
        </div>
      </div>

      {/* If Room is Active: Show Room Launchpad */}
      {currentRoom ? (
        <div className="p-6 sm:p-8 rounded-2xl bg-noir-900 border-2 border-amberGold-500/50 shadow-2xl space-y-6">
          
          {/* Room Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-noir-750">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amberGold-400 block mb-1">
                MULTIPLAYER ROOM
              </span>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-mono font-bold text-zinc-100 tracking-wider">
                  {currentRoom.roomCode}
                </h2>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 rounded bg-noir-800 hover:bg-noir-750 border border-noir-700 text-zinc-300 transition flex items-center gap-1.5 text-xs font-mono"
                  title="Copy room code to share with teammates"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'COPIED' : 'SHARE CODE'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider border ${
                currentRoom.status === 'INVESTIGATING'
                  ? 'bg-amberGold-950/80 border-amberGold-500 text-amberGold-300 shadow-noir-glow'
                  : currentRoom.status === 'COMPLETED'
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                  : 'bg-noir-800 border-noir-700 text-zinc-300 animate-pulse'
              }`}>
                STATUS: {currentRoom.status}
              </span>
            </div>
          </div>

          {/* Active Case Card (CC-001) with Cover Artwork */}
          <div className="p-4 sm:p-5 rounded-xl bg-noir-950 border border-noir-750 flex flex-col md:flex-row items-center gap-6">
            <img 
              src={CASE_CC001.coverImage} 
              alt="The Blackwood Manor Mystery Cover" 
              className="w-36 h-48 sm:w-44 sm:h-56 object-cover rounded-lg border border-amberGold-500/40 shadow-xl shrink-0"
            />

            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="bg-crimson-800 text-white font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                  {CASE_CC001.caseId}
                </span>
                <span className="text-xs text-zinc-400 font-mono">{CASE_CC001.location}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-black text-zinc-100">
                {CASE_CC001.title}
              </h3>
              <p className="text-xs text-amberGold-400 font-serif italic">
                {CASE_CC001.subtitle} • {CASE_CC001.date}
              </p>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed pt-1">
                {CASE_CC001.synopsis}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs text-zinc-400">
                <span className="flex items-center gap-1 text-amberGold-400">
                  <Clock className="w-3.5 h-3.5" /> 6.0 Hours Limit
                </span>
                <span>•</span>
                <span>3 Locations</span>
                <span>•</span>
                <span>3 Suspects</span>
                <span>•</span>
                <span>5 Exhibits</span>
              </div>
            </div>
          </div>

          {/* Detectives In Room */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-300 flex items-center gap-2">
                <Users className="w-4 h-4 text-amberGold-400" />
                <span>Active Detectives ({currentRoom.players.length}/4 Players)</span>
              </h4>

              {currentRoom.players.length < 4 && (
                <button
                  onClick={() => {
                    sound.playInspect();
                    onAddSimulatedTeammate();
                  }}
                  className="px-2.5 py-1 rounded bg-noir-800 hover:bg-noir-750 border border-amberGold-500/30 text-amberGold-300 hover:text-amberGold-200 text-[11px] font-mono transition flex items-center gap-1 shadow"
                  title="Simulate a second detective joining the room"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Add Demo Partner</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {currentRoom.players.map((player) => {
                const isYou = player.id === currentPlayerId;
                const loc = CASE_CC001.locations.find(l => l.id === player.currentLocationId);

                return (
                  <div
                    key={player.id}
                    className={`p-3.5 rounded-lg border flex items-center gap-3 ${
                      isYou 
                        ? 'bg-amberGold-950/30 border-amberGold-500/50 shadow-noir-glow' 
                        : 'bg-noir-950 border-noir-750'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-noir-900 border border-noir-700 flex items-center justify-center text-xl shrink-0">
                      {player.avatar || '🕵️‍♂️'}
                    </div>

                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif font-bold text-xs sm:text-sm text-zinc-100 truncate">
                          {player.name}
                        </span>
                        {isYou && (
                          <span className="text-[9px] font-mono bg-amberGold-500/20 text-amberGold-400 px-1 py-0.2 rounded font-bold">
                            YOU
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="truncate">{loc ? loc.name : 'En Route'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Launch Investigation Button */}
          <div className="pt-4 border-t border-noir-750 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-zinc-400 font-sans flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amberGold-400 shrink-0" />
              <span>
                {currentRoom.players.length < 2
                  ? "Requires at least 2 detectives to begin. Add a demo partner or invite a peer."
                  : "All detectives share room evidence, tasks, and final accusation."}
              </span>
            </div>

            <button
              onClick={() => {
                sound.playDramaticSting();
                onStartInvestigation();
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-amberGold-600 hover:bg-amberGold-500 text-black font-mono font-bold text-xs sm:text-sm uppercase tracking-wider transition shadow-noir-glow flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Enter Investigation Workspace</span>
            </button>
          </div>

        </div>
      ) : (
        /* Create or Join Room Form */
        <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-2xl bg-noir-900 border border-noir-750 shadow-2xl space-y-6">
          
          <div className="grid grid-cols-2 p-1 bg-noir-950 rounded-lg border border-noir-750 font-mono text-xs">
            <button
              onClick={() => {
                sound.playTypewriter();
                setActiveTab('create');
              }}
              className={`py-2 rounded transition font-bold ${
                activeTab === 'create'
                  ? 'bg-amberGold-600 text-black shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Create New Room
            </button>
            <button
              onClick={() => {
                sound.playTypewriter();
                setActiveTab('join');
              }}
              className={`py-2 rounded transition font-bold ${
                activeTab === 'join'
                  ? 'bg-amberGold-600 text-black shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Join Existing Room
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono uppercase text-zinc-300 block mb-1.5">
                Detective Name:
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="e.g. Detective Vance"
                className="w-full p-3 rounded-lg bg-noir-950 border border-noir-700 text-zinc-100 text-sm font-sans focus:outline-none focus:border-amberGold-500"
                maxLength={24}
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-zinc-300 block mb-1.5">
                Detective Badge / Avatar:
              </label>
              <div className="flex gap-2">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => {
                      sound.playTypewriter();
                      setSelectedAvatar(av);
                    }}
                    className={`w-11 h-11 rounded-lg text-xl flex items-center justify-center border transition ${
                      selectedAvatar === av
                        ? 'bg-amberGold-500/20 border-amberGold-500 text-white shadow-noir-glow'
                        : 'bg-noir-950 border-noir-750 hover:bg-noir-800'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {activeTab === 'create' && (
            <form onSubmit={handleCreate} className="space-y-4 pt-2 border-t border-noir-800">
              <div className="p-3.5 rounded-lg bg-noir-950 border border-noir-800 text-xs text-zinc-400 font-sans space-y-1">
                <span className="font-bold text-amberGold-400 block font-mono">
                  CASE ASSIGNMENT: CC-001
                </span>
                <p>
                  You will host a new investigation session for <strong>The Blackwood Manor Mystery</strong>. You will receive a unique join code to share with up to 3 fellow detectives.
                </p>
              </div>

              <button
                type="submit"
                disabled={!playerName.trim()}
                className="w-full py-3.5 rounded-lg bg-amberGold-600 hover:bg-amberGold-500 text-black font-mono font-bold text-xs uppercase tracking-wider transition shadow-noir-glow flex items-center justify-center gap-2"
              >
                <span>Initialize Room</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {activeTab === 'join' && (
            <form onSubmit={handleJoin} className="space-y-4 pt-2 border-t border-noir-800">
              <div>
                <label className="text-xs font-mono uppercase text-zinc-300 block mb-1.5">
                  Enter 4-Digit Room Code:
                </label>
                <input
                  type="text"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. CC-4821"
                  className="w-full p-3 rounded-lg bg-noir-950 border border-noir-700 text-amberGold-400 text-lg font-mono tracking-widest uppercase focus:outline-none focus:border-amberGold-500"
                  maxLength={10}
                />
              </div>

              <button
                type="submit"
                disabled={!joinCodeInput.trim() || !playerName.trim()}
                className="w-full py-3.5 rounded-lg bg-amberGold-600 hover:bg-amberGold-500 text-black font-mono font-bold text-xs uppercase tracking-wider transition shadow-noir-glow flex items-center justify-center gap-2"
              >
                <span>Join Investigation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>
      )}

      {/* Case Library Showcase (Large Illustrated Case Cards) */}
      <div className="space-y-4 pt-6">
        <div className="flex items-center justify-between border-b border-noir-750 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-amberGold-500/20 text-amberGold-400">
              <Layers className="w-4 h-4" />
            </span>
            <h3 className="font-serif font-black text-xl text-zinc-100 uppercase tracking-wide">
              Bureau Case Archive
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-400">SELECTABLE CASES</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CASE_CC001.caseLibrary.map((c) => {
            const isPlayable = c.status.includes('PLAYABLE');

            return (
              <div
                key={c.caseId}
                className={`rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col justify-between group ${
                  isPlayable
                    ? 'bg-noir-900 border-amberGold-500/50 shadow-2xl hover:border-amberGold-400 hover:shadow-noir-glow'
                    : 'bg-noir-950/80 border-noir-800 opacity-70 hover:opacity-90'
                }`}
              >
                {/* Case Artwork Cover */}
                <div className="relative h-64 overflow-hidden bg-noir-950">
                  <img 
                    src={c.coverImage} 
                    alt={c.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-zinc-700 text-zinc-200 font-mono text-[10px] font-bold">
                      {c.caseId}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                      isPlayable ? 'bg-emerald-950 border border-emerald-600 text-emerald-400' : 'bg-noir-900 border border-zinc-700 text-zinc-400'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                </div>

                {/* Case Details */}
                <div className="p-5 space-y-2">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                    {c.era} • {c.difficulty}
                  </span>
                  <h4 className="font-serif font-bold text-base text-zinc-100 group-hover:text-amberGold-300 transition">
                    {c.title}
                  </h4>
                  <p className="text-xs text-zinc-400 font-sans italic">
                    {c.subtitle}
                  </p>
                </div>

                <div className="p-4 pt-0">
                  {isPlayable ? (
                    <button
                      onClick={() => {
                        sound.playPageTurn();
                        if (currentRoom) {
                          onStartInvestigation();
                        } else {
                          setActiveTab('create');
                          window.scrollTo({ top: 400, behavior: 'smooth' });
                        }
                      }}
                      className="w-full py-2.5 rounded-lg bg-amberGold-600 hover:bg-amberGold-500 text-black font-mono font-bold text-xs uppercase tracking-wider transition shadow flex items-center justify-center gap-1.5"
                    >
                      <span>{currentRoom ? 'Enter Investigation' : 'Select Case & Create Room'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="w-full py-2 rounded-lg bg-noir-950 border border-noir-800 text-zinc-500 font-mono text-xs flex items-center justify-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Classified Archive</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
