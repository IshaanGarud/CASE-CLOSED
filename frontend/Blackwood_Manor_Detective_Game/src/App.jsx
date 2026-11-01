import React, { useState, useEffect, useCallback } from 'react';
import { CASE_CC001 } from './data/caseCC001';
import { apiService } from './services/apiService';
import { realtimeService } from './services/realtimeService';
import { sound } from './utils/soundEffects';

// Components
import { Header } from './components/Header';
import { MultiplayerLobby } from './components/MultiplayerLobby';
import { InvestigationMap } from './components/InvestigationMap';
import { SuspectDossiers } from './components/SuspectDossiers';
import { EvidenceArchive } from './components/EvidenceArchive';
import { TaskChecklist } from './components/TaskChecklist';
import { CaseJournal } from './components/CaseJournal';
import { CooperativeVerdict } from './components/CooperativeVerdict';
import { DossierModal } from './components/DossierModal';
import { DetectiveGuidance } from './components/DetectiveGuidance';

import { Bell, Sparkles, AlertOctagon } from 'lucide-react';

export default function App() {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [currentPlayerId, setCurrentPlayerId] = useState(null);
  const [activeTab, setActiveTab] = useState('lobby'); // 'lobby' | 'map' | 'suspects' | 'evidence' | 'tasks' | 'journal' | 'accusation'
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRaining, setIsRaining] = useState(false);
  
  const [notification, setNotification] = useState({
    msg: 'CASE CLOSED — Cooperative Detective Bureau active.',
    type: 'info'
  });

  const showNotification = useCallback((msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  }, []);

  // Dismiss initial toast
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotification(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  // Restore isolated session for this specific browser tab if already joined
  useEffect(() => {
    async function restoreTabSession() {
      try {
        const savedRoomCode = sessionStorage.getItem('case_closed_current_room');
        const savedPlayerId = sessionStorage.getItem('case_closed_player_id');
        if (savedRoomCode && savedPlayerId) {
          const room = await apiService.getRoomState(savedRoomCode);
          if (room && room.players.some(p => p.id === savedPlayerId)) {
            setCurrentRoom(room);
            setCurrentPlayerId(savedPlayerId);
            if (room.status === 'INVESTIGATING') {
              setActiveTab('map');
            }
          } else {
            sessionStorage.removeItem('case_closed_current_room');
            sessionStorage.removeItem('case_closed_player_id');
          }
        }
      } catch (err) {
        console.warn("Could not restore tab session:", err);
      }
    }
    restoreTabSession();
  }, []);

  // Realtime subscription to room changes (cross-tab or Supabase) + Periodic polling for multi-browser sync
  useEffect(() => {
    if (!currentRoom?.roomCode) return;

    // 1. Cross-tab BroadcastChannel listener
    const unsubscribe = realtimeService.subscribeToRoom(currentRoom.roomCode, (updatedRoom) => {
      setCurrentRoom(updatedRoom);
      
      const lastEvent = updatedRoom.journalEvents?.[0];
      if (lastEvent?.category === 'EVIDENCE') {
        showNotification(lastEvent.text, 'clue');
      } else if (lastEvent?.category === 'CONFRONTATION') {
        showNotification(lastEvent.text, 'alert');
      }
    });

    // 2. Multi-browser backend polling every 2.5 seconds
    const interval = setInterval(async () => {
      try {
        const fresh = await apiService.getRoomState(currentRoom.roomCode);
        if (fresh) {
          setCurrentRoom(prev => {
            // Update if players count, evidence count, tasks, or status changed
            const playersChanged = prev?.players?.length !== fresh.players?.length;
            const evidenceChanged = prev?.discoveredEvidenceIds?.length !== fresh.discoveredEvidenceIds?.length;
            const tasksChanged = prev?.completedTaskIds?.length !== fresh.completedTaskIds?.length;
            const statusChanged = prev?.status !== fresh.status;
            const alibiChanged = prev?.alibiBrokenSuspectIds?.length !== fresh.alibiBrokenSuspectIds?.length;
            const eventsChanged = prev?.journalEvents?.length !== fresh.journalEvents?.length;

            if (playersChanged || evidenceChanged || tasksChanged || statusChanged || alibiChanged || eventsChanged) {
              return fresh;
            }
            return prev;
          });
        }
      } catch (err) {
        // Silently catch polling network hiccups
      }
    }, 2500);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [currentRoom?.roomCode, showNotification]);

  // Handler: Create room
  const handleCreateRoom = async (hostName, avatar, caseId = 'CC-001') => {
    try {
      const { room, currentPlayerId: pid } = await apiService.createRoom({
        caseId,
        hostPlayerName: hostName,
        hostAvatar: avatar
      });
      setCurrentRoom(room);
      setCurrentPlayerId(pid);
      sessionStorage.setItem('case_closed_current_room', room.roomCode);
      sessionStorage.setItem('case_closed_player_id', pid);
      showNotification(`Room ${room.roomCode} initialized!`, 'info');
    } catch (err) {
      showNotification(`Room creation failed: ${err.message}`, 'alert');
    }
  };

  // Handler: Join room
  const handleJoinRoom = async (roomCode, playerName, avatar) => {
    try {
      const { room, currentPlayerId: pid } = await apiService.joinRoom({
        roomCode,
        playerName,
        playerAvatar: avatar
      });
      setCurrentRoom(room);
      setCurrentPlayerId(pid);
      sessionStorage.setItem('case_closed_current_room', room.roomCode);
      sessionStorage.setItem('case_closed_player_id', pid);
      showNotification(`Joined Room ${room.roomCode} as ${playerName}.`, 'info');
    } catch (err) {
      showNotification(`Join failed: ${err.message}`, 'alert');
    }
  };

  // Handler: Start investigation
  const handleStartInvestigation = async () => {
    if (!currentRoom) return;
    try {
      const updated = await apiService.startInvestigation(currentRoom.roomCode);
      setCurrentRoom(updated);
      setActiveTab('map');
      showNotification("The investigation has begun. 6.0 hours remain until dawn.", 'info');
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Move location
  const handleMoveLocation = async (locationId) => {
    if (!currentRoom || !currentPlayerId) return;
    try {
      const updated = await apiService.updatePlayerLocation(currentRoom.roomCode, currentPlayerId, locationId);
      if (updated) setCurrentRoom(updated);
    } catch (err) {
      console.error("Location update error:", err);
    }
  };

  // Handler: Inspect Hotspot / Discover Evidence
  const handleInspectHotspot = async (_locationId, hotspotId, clueId) => {
    if (!currentRoom || !currentPlayerId) return;
    try {
      const result = await apiService.discoverEvidence(currentRoom.roomCode, currentPlayerId, hotspotId, clueId);
      if (result?.room) {
        setCurrentRoom(result.room);
        if (result.clueDiscovered) {
          const clue = CASE_CC001.evidence.find(e => e.id === clueId);
          showNotification(`Evidence Secured for Room: ${clue?.name || 'New Clue'}`, 'clue');
        }
      }
    } catch (err) {
      console.error("Evidence inspection error:", err);
    }
  };

  // Handler: Interrogate Question
  const handleInterrogateQuestion = (_suspectId, questionObj) => {
    if (questionObj?.unlockedNote) {
      showNotification(`Note logged: ${questionObj.unlockedNote.slice(0, 48)}...`, 'info');
    }
  };

  // Handler: Confront Suspect with Evidence
  const handleConfrontSuspect = async (suspectId, clueId) => {
    if (!currentRoom || !currentPlayerId) return;
    try {
      const result = await apiService.confrontSuspect(currentRoom.roomCode, currentPlayerId, suspectId, clueId);
      if (result?.room) {
        setCurrentRoom(result.room);
        if (result.success) {
          showNotification("ALIBI SHATTERED: Suspect contradiction exposed!", 'alert');
        }
      }
    } catch (err) {
      console.error("Confrontation error:", err);
    }
  };

  // Handler: Submit cooperative verdict
  const handleSubmitVerdict = async (verdictPayload) => {
    if (!currentRoom || !currentPlayerId) return null;
    try {
      const verdictResult = await apiService.submitCooperativeVerdict(
        currentRoom.roomCode, 
        currentPlayerId, 
        verdictPayload
      );
      // Reload room
      const updated = await apiService.getRoomState(currentRoom.roomCode);
      setCurrentRoom(updated);
      showNotification("The room's final verdict has been logged with the bureau.", 'info');
      return verdictResult;
    } catch (err) {
      showNotification(`Verdict submission failed: ${err.message}`, 'alert');
      return null;
    }
  };

  // Handler: Add Simulated Teammate
  const handleAddSimulatedTeammate = async () => {
    if (!currentRoom) return;
    try {
      const updated = await apiService.addSimulatedTeammate(currentRoom.roomCode);
      if (updated) {
        setCurrentRoom(updated);
        showNotification("A demo detective partner has joined your room!", 'info');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Reset investigation (Reopen & Play Again)
  const handleResetInvestigation = async () => {
    if (!currentRoom) return;
    try {
      const resetRoomState = await apiService.resetRoom(currentRoom.roomCode);
      setCurrentRoom(resetRoomState);
      setActiveTab('lobby');
      showNotification(`Room ${currentRoom.roomCode} reset! All evidence, tasks and progress have been cleared.`, 'info');
    } catch (err) {
      showNotification(`Room reset failed: ${err.message}`, 'alert');
    }
  };

  // Sound toggles
  const handleToggleMute = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleToggleRain = () => {
    const raining = sound.toggleRain();
    setIsRaining(raining);
  };

  // Derived state from currentRoom
  const hoursLeft = currentRoom?.hoursLeft ?? 6.0;
  const discoveredEvidenceIds = currentRoom?.discoveredEvidenceIds || [];
  const completedTaskIds = currentRoom?.completedTaskIds || [];
  const alibiBrokenSuspectIds = currentRoom?.alibiBrokenSuspectIds || [];
  const journalEvents = currentRoom?.journalEvents || [];
  const sharedNotes = currentRoom?.sharedNotes || '';

  return (
    <div className="min-h-screen bg-[#08090d] text-[#ded8ce] relative selection:bg-amberGold-500 selection:text-black">
      
      {/* Rain Texture Overlay */}
      {isRaining && <div className="rain-layer" />}
      <div className="film-grain fixed inset-0 pointer-events-none opacity-25" />

      {/* Floating Status Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-subtle">
          <div className={`p-4 rounded-xl shadow-2xl border flex items-center gap-3 text-xs sm:text-sm font-typewriter max-w-md ${
            notification.type === 'alert'
              ? 'bg-crimson-950/95 border-crimson-500 text-white shadow-blood-glow'
              : notification.type === 'clue'
              ? 'bg-amberGold-950/95 border-amberGold-500 text-amberGold-200 shadow-noir-glow'
              : 'bg-noir-900/95 border-noir-700 text-zinc-200'
          }`}>
            {notification.type === 'alert' && <AlertOctagon className="w-5 h-5 text-crimson-400 shrink-0" />}
            {notification.type === 'clue' && <Sparkles className="w-5 h-5 text-amberGold-400 shrink-0" />}
            {notification.type === 'info' && <Bell className="w-5 h-5 text-zinc-400 shrink-0" />}
            <span>{notification.msg}</span>
          </div>
        </div>
      )}

      {/* Top Header Navigation */}
      <Header
        currentRoom={currentRoom}
        currentPlayerId={currentPlayerId}
        hoursLeft={hoursLeft}
        cluesCount={discoveredEvidenceIds.length}
        totalClues={CASE_CC001.evidence.length}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isRaining={isRaining}
        onToggleRain={handleToggleRain}
        onOpenDossier={() => setIsDossierOpen(true)}
        onOpenLobby={() => setActiveTab('lobby')}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Dynamic Contextual Gameplay Guidance */}
      {currentRoom && (
        <DetectiveGuidance
          currentRoom={currentRoom}
          currentPlayerId={currentPlayerId}
          locations={CASE_CC001.locations}
          suspects={CASE_CC001.suspects}
          evidence={CASE_CC001.evidence}
          tasks={CASE_CC001.tasks}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}

      {/* Main Workspace Stage */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 pb-20">
        
        {/* TAB: Lobby */}
        {activeTab === 'lobby' && (
          <MultiplayerLobby
            currentRoom={currentRoom}
            currentPlayerId={currentPlayerId}
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            onStartInvestigation={handleStartInvestigation}
            onAddSimulatedTeammate={handleAddSimulatedTeammate}
          />
        )}

        {/* TAB: Interactive Location Map */}
        {activeTab === 'map' && currentRoom && (
          <InvestigationMap
            locations={CASE_CC001.locations}
            evidence={CASE_CC001.evidence}
            discoveredEvidenceIds={discoveredEvidenceIds}
            players={currentRoom.players}
            currentPlayerId={currentPlayerId}
            onInspectHotspot={handleInspectHotspot}
            onMoveLocation={handleMoveLocation}
          />
        )}

        {/* TAB: Suspect Dossiers */}
        {activeTab === 'suspects' && currentRoom && (
          <SuspectDossiers
            suspects={CASE_CC001.suspects}
            evidence={CASE_CC001.evidence}
            discoveredEvidenceIds={discoveredEvidenceIds}
            alibiBrokenSuspectIds={alibiBrokenSuspectIds}
            onInterrogateQuestion={handleInterrogateQuestion}
            onConfrontSuspect={handleConfrontSuspect}
          />
        )}

        {/* TAB: Shared Evidence Archive */}
        {activeTab === 'evidence' && (
          <EvidenceArchive
            evidence={CASE_CC001.evidence}
            discoveredEvidenceIds={discoveredEvidenceIds}
            suspects={CASE_CC001.suspects}
          />
        )}

        {/* TAB: Investigation Tasks */}
        {activeTab === 'tasks' && (
          <TaskChecklist
            tasks={CASE_CC001.tasks}
            completedTaskIds={completedTaskIds}
            locations={CASE_CC001.locations}
            onNavigateToLocation={(locId) => {
              handleMoveLocation(locId);
              setActiveTab('map');
            }}
          />
        )}

        {/* TAB: Case Journal */}
        {activeTab === 'journal' && currentRoom && (
          <CaseJournal
            journalEvents={journalEvents}
            sharedNotes={sharedNotes}
            onSaveNotes={(newNotes) => {
              const updated = { ...currentRoom, sharedNotes: newNotes };
              setCurrentRoom(updated);
              localStorage.setItem(`case_closed_room_${currentRoom.roomCode}`, JSON.stringify(updated));
            }}
            evidence={CASE_CC001.evidence}
            discoveredEvidenceIds={discoveredEvidenceIds}
            suspects={CASE_CC001.suspects}
            alibiBrokenSuspectIds={alibiBrokenSuspectIds}
          />
        )}

        {/* TAB: Cooperative Verdict */}
        {activeTab === 'accusation' && currentRoom && (
          <CooperativeVerdict
            currentRoom={currentRoom}
            currentPlayerId={currentPlayerId}
            evidence={CASE_CC001.evidence}
            discoveredEvidenceIds={discoveredEvidenceIds}
            suspects={CASE_CC001.suspects}
            alibiBrokenSuspectIds={alibiBrokenSuspectIds}
            onSubmitVerdict={handleSubmitVerdict}
            onResetInvestigation={handleResetInvestigation}
          />
        )}
      </main>

      {/* Case Dossier Popup */}
      <DossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
      />

    </div>
  );
}
