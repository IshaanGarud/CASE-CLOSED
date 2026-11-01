# CASE CLOSED — API Contract Documentation

**Base URL:** `http://localhost:8080/api`  
**Frontend Caller:** `frontend/Blackwood_Manor_Detective_Game/src/services/apiService.js`

---

## 1. Authentication & Headers

- **Optional Header:** `Authorization: Bearer <session_token>`
- **Behavior:**
  - When present, the server cryptographically validates that the session token belongs to the requesting player and room.
  - When omitted (as in the default frontend), the server authenticates the player against verified active room membership in the target room.
  - Prevents non-members from executing investigation actions.

---

## 2. Endpoints

### 2.1 Create Room
- **Method:** `POST /api/rooms`
- **Request Body:**
  ```json
  {
    "caseId": "CC-001",
    "hostPlayerName": "Detective Vance",
    "hostAvatar": "🕵️‍♂️"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "room": {
      "roomCode": "CC-4821",
      "caseId": "CC-001",
      "status": "WAITING",
      "createdAt": "2026-11-01T11:45:00Z",
      "hoursLeft": 6.0,
      "players": [
        {
          "id": "p_1730461500000",
          "name": "Detective Vance",
          "avatar": "🕵️‍♂️",
          "isHost": true,
          "isOnline": true,
          "currentLocationId": "study",
          "joinedAt": "05:15 PM"
        }
      ],
      "discoveredEvidenceIds": [],
      "completedTaskIds": [],
      "alibiBrokenSuspectIds": [],
      "examinedHotspotIds": [],
      "journalEvents": [
        {
          "id": "evt_1730461500000",
          "time": "05:15 PM",
          "category": "SYSTEM",
          "text": "Investigation Room CC-4821 opened for Case CC-001 by Detective Vance."
        }
      ],
      "sharedNotes": "• Storm is severe. Coroner will arrive at dawn (06:00 AM).\n• Examine Julian's private study first for physical traces.",
      "verdictResult": null
    },
    "currentPlayerId": "p_1730461500000"
  }
  ```

---

### 2.2 Join Room
- **Method:** `POST /api/rooms/{roomCode}/join`
- **Request Body:**
  ```json
  {
    "playerName": "Agent Miller",
    "playerAvatar": "🔍"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "room": { ... },
    "currentPlayerId": "p_1730461500123_456"
  }
  ```
- **Errors:**
  - `400 Bad Request` if room already has 4 players.

---

### 2.3 Get Room State
- **Method:** `GET /api/rooms/{roomCode}`
- **Response (200 OK):**
  ```json
  {
    "roomCode": "CC-4821",
    "caseId": "CC-001",
    "status": "INVESTIGATING",
    "hoursLeft": 5.5,
    "players": [ ... ],
    "discoveredEvidenceIds": [ "clue_scotch" ],
    "completedTaskIds": [ "task_corpse" ],
    "alibiBrokenSuspectIds": [],
    "examinedHotspotIds": [ "hs_desk" ],
    "journalEvents": [ ... ],
    "sharedNotes": "...",
    "verdictResult": null
  }
  ```

---

### 2.4 Start Investigation
- **Method:** `POST /api/rooms/{roomCode}/start`
- **Response (200 OK):** Returns updated room state with `status: "INVESTIGATING"`.

---

### 2.5 Update Player Location
- **Method:** `PUT /api/rooms/{roomCode}/players/{playerId}/location`
- **Request Body:**
  ```json
  {
    "locationId": "speakeasy"
  }
  ```
- **Response (200 OK):** Returns updated room state with player's new location.

---

### 2.6 Discover Evidence & Inspect Hotspots
- **Method:** `POST /api/rooms/{roomCode}/evidence`
- **Request Body:**
  ```json
  {
    "playerId": "p_1730461500000",
    "hotspotId": "hs_desk",
    "clueId": "clue_scotch"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "room": { ... },
    "clueDiscovered": true
  }
  ```

---

### 2.7 Confront Suspect with Evidence
- **Method:** `POST /api/rooms/{roomCode}/suspects/{suspectId}/confront`
- **Request Body:**
  ```json
  {
    "playerId": "p_1730461500000",
    "clueId": "clue_vial"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "room": { ... },
    "success": true,
    "dialogue": "You... you pulled that from the cellar hearth? Fine! I went up to Julian's study at 11:25 PM!...",
    "breakdown": "ALIBI BROKEN: Dr. Thorne lied about being in the lounge..."
  }
  ```

---

### 2.8 Submit Final Cooperative Verdict
- **Method:** `POST /api/rooms/{roomCode}/verdict`
- **Request Body:**
  ```json
  {
    "playerId": "p_1730461500000",
    "culpritId": "thorne",
    "murderMethodId": "poison_scotch",
    "motiveId": "narcotics_blackmail",
    "smokingGunId": "clue_vial"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "isWin": true,
    "grade": "S",
    "title": "Master Sleuths of Scotland Yard & NYPD",
    "epilogue": "Drawing the velvet drapes in the parlor, your team points directly at Dr. Reginald Thorne...",
    "correctCount": 4,
    "submittedAt": "05:30 PM",
    "submittedByPlayerId": "p_1730461500000"
  }
  ```
- **Errors:**
  - `400 Bad Request` if a verdict has already been submitted for the room.
  - `400 Bad Request` if submitted before starting investigation.
  - `400 Bad Request` if submitted by non-member player.

---

### 2.9 Add Simulated Teammate
- **Method:** `POST /api/rooms/{roomCode}/simulated-player`
- **Request Body:** None (empty)
- **Response (200 OK):** Returns updated `RoomResponse` object containing the newly added AI/demo detective in the room's detective roster.
- **Errors:**
  - `400 Bad Request` if room already has 4 players.
  - `404 Not Found` with `code: "ROOM_NOT_FOUND"` if room does not exist.

---

### 2.10 Reset Investigation Room (Reopen & Play Again)
- **Method:** `POST /api/rooms/{roomCode}/reset`
- **Request Body:** None (empty)
- **Response (200 OK):** Returns reset `RoomResponse` object:
  - `status`: `"WAITING"`
  - `hoursLeft`: `6.0`
  - `discoveredEvidenceIds`: `[]`
  - `completedTaskIds`: `[]`
  - `alibiBrokenSuspectIds`: `[]`
  - `examinedHotspotIds`: `[]`
  - `verdictResult`: `null`
  - All existing connected players preserved with locations reset to `"study"`.
  - Room journal cleared and appended with reset event.
- **Errors:**
  - `404 Not Found` with `code: "ROOM_NOT_FOUND"` if room does not exist.


