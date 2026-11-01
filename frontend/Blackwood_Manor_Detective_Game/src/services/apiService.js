// CASE CLOSED — Frontend API Service Layer
// Communicates with Ishaan's Spring Boot backend APIs.
// When backend is unavailable or VITE_USE_MOCK_DATA=true, operates in high-fidelity mock mode.

import { CASE_CC001 } from '../data/caseCC001';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

// Helper to generate a random 4-digit room code
function generateRoomCode() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `CC-${num}`;
}

// In-memory / localStorage storage for Mock Rooms
function getStoredRoom(roomCode) {
  try {
    const raw = localStorage.getItem(`case_closed_room_${roomCode}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveStoredRoom(room) {
  try {
    localStorage.setItem(`case_closed_room_${room.roomCode}`, JSON.stringify(room));
    // Broadcast via BroadcastChannel for multi-tab synchronization
    if (typeof window !== 'undefined' && window.BroadcastChannel) {
      const bc = new window.BroadcastChannel('case_closed_channel');
      bc.postMessage({ type: 'ROOM_UPDATED', roomCode: room.roomCode, room });
      bc.close();
    }
  } catch (err) {
    console.warn("Storage sync failed:", err);
  }
}

// Mock room factory for CC-001
function createMockRoom(roomCode, hostPlayerName, hostAvatar = '🕵️‍♂️') {
  const hostPlayer = {
    id: `p_${Date.now()}`,
    name: hostPlayerName || 'Lead Detective',
    avatar: hostAvatar,
    isHost: true,
    isOnline: true,
    currentLocationId: 'study',
    joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const initialRoom = {
    roomCode,
    caseId: CASE_CC001.caseId,
    status: 'WAITING', // WAITING | INVESTIGATING | COMPLETED
    createdAt: new Date().toISOString(),
    hoursLeft: 6.0,
    players: [hostPlayer],
    discoveredEvidenceIds: [],
    completedTaskIds: [],
    alibiBrokenSuspectIds: [],
    examinedHotspotIds: [],
    journalEvents: [
      {
        id: `evt_${Date.now()}`,
        time: "12:05 AM",
        category: "SYSTEM",
        text: `Investigation Room ${roomCode} opened for Case ${CASE_CC001.caseId} by ${hostPlayer.name}.`
      }
    ],
    sharedNotes: `• Storm is severe. Coroner will arrive at dawn (06:00 AM).\n• Examine Julian's private study first for physical traces.`,
    verdictResult: null
  };

  saveStoredRoom(initialRoom);
  return initialRoom;
}

export const apiService = {
  // 1. Create a new multiplayer room
  async createRoom({ caseId = 'CC-001', hostPlayerName = 'Detective', hostAvatar = '🕵️‍♂️' }) {
    if (!USE_MOCK) {
      try {
        const res = await fetch(`${API_BASE_URL}/rooms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ caseId, hostPlayerName, hostAvatar })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        console.warn("Backend unavailable, falling back to mock room:", err.message);
      }
    }

    const roomCode = generateRoomCode();
    const room = createMockRoom(roomCode, hostPlayerName, hostAvatar);
    return {
      room,
      currentPlayerId: room.players[0].id
    };
  },

  // 2. Join an existing room
  async joinRoom({ roomCode, playerName = 'Agent', playerAvatar = '🔍' }) {
    const formattedCode = roomCode.trim().toUpperCase();

    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/rooms/${formattedCode}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName, playerAvatar })
      });
      if (!res.ok) {
        let errMsg = `Failed to join room ${formattedCode} (HTTP ${res.status})`;
        try {
          const errData = await res.json();
          if (errData?.code === 'ROOM_NOT_FOUND' || res.status === 404) {
            errMsg = `ROOM_NOT_FOUND: Room ${formattedCode} does not exist. Please check the room code or create a new room.`;
          } else if (errData?.message) {
            errMsg = errData.message;
          }
        } catch {
          // ignore json parse failure
        }
        throw new Error(errMsg);
      }
      return await res.json();
    }

    let room = getStoredRoom(formattedCode);
    if (!room) {
      throw new Error(`ROOM_NOT_FOUND: Room ${formattedCode} does not exist.`);
    }

    // Check if player already exists
    let player = room.players.find(p => p.name.toLowerCase() === playerName.toLowerCase());
    if (!player) {
      player = {
        id: `p_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        name: playerName,
        avatar: playerAvatar,
        isHost: false,
        isOnline: true,
        currentLocationId: 'study',
        joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      room.players.push(player);
      room.journalEvents.unshift({
        id: `evt_${Date.now()}`,
        time: "12:10 AM",
        category: "PLAYER",
        text: `${playerName} arrived at Blackwood Manor and joined the investigation team.`
      });
      saveStoredRoom(room);
    }

    return {
      room,
      currentPlayerId: player.id
    };
  },

  // 3. Get current room state
  async getRoomState(roomCode) {
    if (!USE_MOCK) {
      try {
        const res = await fetch(`${API_BASE_URL}/rooms/${roomCode}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        console.warn("Backend unavailable, using stored mock state:", err.message);
      }
    }

    const room = getStoredRoom(roomCode);
    if (!room) {
      throw new Error(`Room ${roomCode} not found.`);
    }
    return room;
  },

  // 4. Start investigation
  async startInvestigation(roomCode) {
    if (!USE_MOCK) {
      try {
        const res = await fetch(`${API_BASE_URL}/rooms/${roomCode}/start`, { method: 'POST' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        console.warn("Backend unavailable, starting mock investigation:", err.message);
      }
    }

    const room = getStoredRoom(roomCode);
    if (!room) throw new Error(`Room ${roomCode} not found.`);

    room.status = 'INVESTIGATING';
    room.journalEvents.unshift({
      id: `evt_${Date.now()}`,
      time: "12:15 AM",
      category: "SYSTEM",
      text: "The iron gates have been locked. The official homicide investigation has begun."
    });
    saveStoredRoom(room);
    return room;
  },

  // 5. Update player location
  async updatePlayerLocation(roomCode, playerId, locationId) {
    if (!USE_MOCK) {
      try {
        const res = await fetch(`${API_BASE_URL}/rooms/${roomCode}/players/${playerId}/location`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ locationId })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        console.warn("Backend location update failed, using mock:", err.message);
      }
    }

    const room = getStoredRoom(roomCode);
    if (!room) return null;

    const player = room.players.find(p => p.id === playerId);
    if (player && player.currentLocationId !== locationId) {
      player.currentLocationId = locationId;
      const loc = CASE_CC001.locations.find(l => l.id === locationId);
      room.journalEvents.unshift({
        id: `evt_${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: "LOCATION",
        text: `${player.name} moved to ${loc ? loc.name : locationId}.`
      });
      saveStoredRoom(room);
    }
    return room;
  },

  // 6. Discover evidence & complete hotspot inspection
  async discoverEvidence(roomCode, playerId, hotspotId, clueId) {
    if (!USE_MOCK) {
      try {
        const res = await fetch(`${API_BASE_URL}/rooms/${roomCode}/evidence`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerId, hotspotId, clueId })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        console.warn("Backend evidence submission failed, using authoritative mock:", err.message);
      }
    }

    const room = getStoredRoom(roomCode);
    if (!room) return null;

    const player = room.players.find(p => p.id === playerId) || { name: 'A detective' };

    // Record hotspot examination
    if (!room.examinedHotspotIds.includes(hotspotId)) {
      room.examinedHotspotIds.push(hotspotId);
      room.hoursLeft = Math.max(0, room.hoursLeft - 0.5);
    }

    let clueDiscovered = false;
    // Check if new evidence was found
    if (clueId && !room.discoveredEvidenceIds.includes(clueId)) {
      room.discoveredEvidenceIds.push(clueId);
      clueDiscovered = true;
      const clue = CASE_CC001.evidence.find(e => e.id === clueId);

      room.journalEvents.unshift({
        id: `evt_${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: "EVIDENCE",
        text: `🔍 ${player.name} uncovered critical evidence: "${clue ? clue.name : clueId}". Shared with all detectives.`
      });

      // Check if this fulfills a task
      CASE_CC001.tasks.forEach(task => {
        if (task.id === 'task_corpse' && clueId === 'clue_scotch') {
          if (!room.completedTaskIds.includes(task.id)) {
            room.completedTaskIds.push(task.id);
          }
        }
        if (task.id === 'task_clock' && clueId === 'clue_clock') {
          if (!room.completedTaskIds.includes(task.id)) {
            room.completedTaskIds.push(task.id);
          }
        }
        if (task.id === 'task_conservatory' && clueId === 'clue_footprint') {
          if (!room.completedTaskIds.includes(task.id)) {
            room.completedTaskIds.push(task.id);
          }
        }
        if (task.id === 'task_vial' && clueId === 'clue_vial') {
          if (!room.completedTaskIds.includes(task.id)) {
            room.completedTaskIds.push(task.id);
          }
        }
      });
    }

    saveStoredRoom(room);
    return { room, clueDiscovered };
  },

  // 7. Confront suspect with evidence (Alibi shattering)
  async confrontSuspect(roomCode, playerId, suspectId, clueId) {
    if (!USE_MOCK) {
      try {
        const res = await fetch(`${API_BASE_URL}/rooms/${roomCode}/suspects/${suspectId}/confront`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerId, clueId })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        console.warn("Backend confrontation failed, using authoritative mock:", err.message);
      }
    }

    const room = getStoredRoom(roomCode);
    if (!room) return null;

    const suspect = CASE_CC001.suspects.find(s => s.id === suspectId);
    const player = room.players.find(p => p.id === playerId) || { name: 'A detective' };
    const reaction = suspect?.confrontation[clueId] || suspect?.confrontation.default;

    if (reaction?.success) {
      if (!room.alibiBrokenSuspectIds.includes(suspectId)) {
        room.alibiBrokenSuspectIds.push(suspectId);
        
        // Complete the alibi task
        if (!room.completedTaskIds.includes('task_alibi')) {
          room.completedTaskIds.push('task_alibi');
        }

        room.journalEvents.unshift({
          id: `evt_${Date.now()}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          category: "CONFRONTATION",
          text: `⚡ ${player.name} shattered ${suspect.name}'s alibi using evidence! ${reaction.breakdown}`
        });
      }
    }

    saveStoredRoom(room);
    return {
      room,
      success: reaction?.success || false,
      dialogue: reaction?.reaction || "Irrelevant.",
      breakdown: reaction?.breakdown || null
    };
  },

  // 8. Submit cooperative final verdict
  async submitCooperativeVerdict(roomCode, playerId, { culpritId, murderMethodId, motiveId, smokingGunId }) {
    if (!USE_MOCK) {
      try {
        const res = await fetch(`${API_BASE_URL}/rooms/${roomCode}/verdict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerId, culpritId, murderMethodId, motiveId, smokingGunId })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        console.warn("Backend verdict failed, using authoritative mock validation:", err.message);
      }
    }

    const room = getStoredRoom(roomCode);
    if (!room) throw new Error(`Room ${roomCode} not found.`);

    const solution = CASE_CC001.authoritativeSolution;
    const isCulpritRight = culpritId === solution.culpritId;
    const isMethodRight = murderMethodId === solution.murderMethodId;
    const isMotiveRight = motiveId === solution.motiveId;
    const isSmokingGunRight = smokingGunId === solution.smokingGunId;

    const correctCount = [isCulpritRight, isMethodRight, isMotiveRight, isSmokingGunRight].filter(Boolean).length;
    const isFullWin = correctCount === 4;

    let grade = 'F';
    let title = 'Case Unsolved - Killer Escaped';
    let epilogue = '';

    if (isFullWin) {
      grade = 'S';
      title = 'Master Sleuths of Scotland Yard & NYPD';
      epilogue = `Drawing the velvet drapes in the parlor, your team points directly at Dr. Reginald Thorne.\n\n"The stopped grandfather clock was your undoing, Doctor. You turned the hands back to 11:42 PM to forge an alibi while seated with Lady Abernathy. But Julian was already dead by 11:30 PM—poisoned by the Potassium Cyanide you brought in the vintage Glenfarclas bottle."\n\nYou place the crushed amber apothecary vial on the table. "Embossed with your hospital stamp, code TR-8. Julian was blackmailing you with federal charges for narcotics diversion."\n\nThorne's composure shatters as the constable snaps iron handcuffs onto his wrists. Justice has been delivered. Case closed!`;
    } else if (isCulpritRight) {
      grade = 'B';
      title = 'Partial Conviction - Circumstantial Gaps';
      epilogue = `You correctly named Dr. Reginald Thorne as the mastermind! However, loopholes in your weapon or motive reconstruction allow his Manhattan defense attorneys to fight for manslaughter instead of first-degree murder.`;
    } else {
      grade = 'D';
      title = 'Miscarriage of Justice - The Wrong Accusation';
      epilogue = `Your accusation crumbled under the district attorney's examination. The true killer escaped into the night as dawn broke over Hudson Valley.`;
    }

    const verdictResult = {
      isWin: isFullWin,
      grade,
      title,
      epilogue,
      correctCount,
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      submittedByPlayerId: playerId
    };

    room.status = 'COMPLETED';
    room.verdictResult = verdictResult;
    room.journalEvents.unshift({
      id: `evt_${Date.now()}`,
      time: "06:00 AM",
      category: "VERDICT",
      text: `⚖️ Final cooperative verdict delivered by the room. Result: Grade ${grade} (${title}).`
    });

    saveStoredRoom(room);
    return verdictResult;
  },

  // 9. Add simulated player (for demo testing multiplayer interactions)
  async addSimulatedTeammate(roomCode) {
    if (!USE_MOCK) {
      try {
        const res = await fetch(`${API_BASE_URL}/rooms/${roomCode}/simulated-player`, {
          method: 'POST'
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        console.warn("Backend simulated teammate failed, falling back to mock:", err.message);
      }
    }

    const room = getStoredRoom(roomCode);
    if (!room) return null;

    const simulatedNames = [
      { name: 'Agent Miller', avatar: '🕵️‍♀️' },
      { name: 'Inspector Graves', avatar: '🎩' },
      { name: 'Detective O\'Connor', avatar: '🔍' }
    ];

    const available = simulatedNames.find(s => !room.players.some(p => p.name === s.name));
    if (!available) return room;

    const newPlayer = {
      id: `sim_${Date.now()}`,
      name: available.name,
      avatar: available.avatar,
      isHost: false,
      isOnline: true,
      currentLocationId: 'conservatory',
      joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    room.players.push(newPlayer);
    room.journalEvents.unshift({
      id: `evt_${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: "PLAYER",
      text: `${newPlayer.name} has entered the investigation room.`
    });

    saveStoredRoom(room);
    return room;
  },

  // 10. Reset investigation room (Reopen and play again)
  async resetRoom(roomCode) {
    const formattedCode = roomCode.trim().toUpperCase();

    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/rooms/${formattedCode}/reset`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    }

    const room = getStoredRoom(formattedCode);
    if (!room) throw new Error(`Room ${formattedCode} not found.`);

    room.status = 'WAITING';
    room.hoursLeft = 6.0;
    room.discoveredEvidenceIds = [];
    room.completedTaskIds = [];
    room.alibiBrokenSuspectIds = [];
    room.examinedHotspotIds = [];
    room.verdictResult = null;
    room.players.forEach(p => { p.currentLocationId = 'study'; });
    room.journalEvents = [{
      id: `evt_${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: "SYSTEM",
      text: `Investigation Room ${formattedCode} has been reopened and reset.`
    }];

    saveStoredRoom(room);
    return room;
  }
};

