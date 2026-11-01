# 🕵️ CASE CLOSED
### Interactive Mystery Investigation & Cooperative Multiplayer Platform

CASE CLOSED is a detective mystery investigation game developed as a Java Mini Project.

Players become detectives, investigate fictional criminal cases, explore locations, examine evidence, interrogate suspects, uncover contradictions, complete investigation tasks, and collaboratively submit a final verdict.

The platform combines an immersive investigation experience with cooperative multiplayer gameplay.

---

## 🎮 Features

- **Interactive Investigation:** Explore crime scenes and locations to discover clues.
- **Suspect Dossiers:** Examine suspect profiles, motives, statements, and alibis.
- **Evidence Archive:** Collect and review evidence discovered during investigations.
- **Evidence Board:** Connect clues and investigate contradictions.
- **Investigation Tasks:** Complete objectives to progress through a case.
- **Detective Journal:** Keep track of discoveries and investigation events.
- **Cooperative Multiplayer:** Create investigation rooms and invite other detectives.
- **Shared Investigation:** Evidence discoveries, completed tasks, and verdicts are shared between players.
- **Cooperative Verdict:** Work together to identify the culprit, murder method, motive, and decisive evidence.

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Frontend | React 19 |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| Backend | Java 21, Spring Boot |
| Build System | Maven |
| Database | H2 (local demo), Supabase PostgreSQL (configured production integration) |
| API | REST |
| Multiplayer | Shared Spring Boot backend |

## 📋 Prerequisites

Install the following before running the project:

1. **Java JDK 21 or newer**
2. **Node.js 20 or newer**
3. npm (included with Node.js)

Git is optional if downloading the repository as a ZIP.

Verify your installations:

```bash
java -version
node --version
npm --version
```

## 🚀 Getting Started

### 1. Download the project

Clone the repository:

```bash
git clone https://github.com/IshaanGarud/CASE-CLOSED.git
```

Alternatively:

1. Open the GitHub repository.
2. Select **Code → Download ZIP**.
3. Extract the downloaded ZIP.

### 2. Start CASE CLOSED

Open the extracted project folder.

Double-click:

```text
START-CASE-CLOSED.bat
```

The launcher automatically:

- Checks the required software.
- Creates the frontend environment configuration if missing.
- Installs frontend dependencies if required.
- Starts the Spring Boot backend.
- Starts the React frontend.
- Waits for both services to become available.
- Opens CASE CLOSED in your browser.
- Displays the network address that other devices can use to connect.

**No manual Supabase configuration is required for the local H2 demo mode.**

### 3. Open the application

On the hosting laptop, open:

```text
http://localhost:5173
```

Keep both backend and frontend terminal windows open while playing.

## 🌐 Hosting a Multiplayer Game Over Wi-Fi or Hotspot

CASE CLOSED supports local-network multiplayer.

One laptop acts as the host, running both the backend and frontend. Other devices connect through the same Wi-Fi network or phone hotspot.

You do not need a specific Wi-Fi network, router, hotspot name, or hardcoded IP address.

### Step 1: Connect the devices

Connect the hosting laptop and all participating phones or laptops to the same network.

Examples:

- A phone's mobile hotspot.
- Another person's phone hotspot.
- College laboratory Wi-Fi.
- Home Wi-Fi.

The network must allow devices to communicate with one another.

### Step 2: Start the game on the host laptop

Double-click:

```text
START-CASE-CLOSED.bat
```

Wait for the backend and frontend to start.

The launcher displays a phone connection address similar to:

```text
http://192.168.x.x:5173
```

The actual address is detected automatically from the laptop's current network connection.

### Step 3: Connect other devices

On every participating phone or laptop:

1. Open a web browser.
2. Enter the connection address displayed by the host laptop.
3. Wait for CASE CLOSED to load.

All players must use the same displayed host address.

### Step 4: Create and join an investigation

**Host player:**
1. Open the Multiplayer Lobby.
2. Create an investigation room.
3. Share the generated room code.

**Joining players:**
1. Open the Multiplayer Lobby.
2. Enter the room code.
3. Join the investigation.

All players can now participate in the same investigation through the host laptop's backend.

### Important Network Requirements

- The host laptop and joining devices must be connected to the same Wi-Fi or hotspot.
- The network must permit communication between connected devices (client isolation must be disabled).
- Windows Firewall must allow incoming connections on TCP ports **5173** and **8080**.
- For the current firewall configuration, the active trusted Windows network profile must be set to **Private**.
- If Windows blocks the application, check its firewall settings.

**Note:** Local-network multiplayer does not require cloud hosting, but it does require a working connection between the devices. Networks that isolate connected clients may prevent multiplayer connections.

## ⚙️ Manual Startup (Alternative)

If you do not want to use the launcher, you can start the services manually.

### Start the backend

Open a terminal:

```powershell
cd backend
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
```

Backend API:

```text
http://localhost:8080/api
```

### Start the frontend

Open another terminal:

```powershell
cd frontend/Blackwood_Manor_Detective_Game
npm install
npm run dev -- --host 0.0.0.0
```

Frontend:

```text
http://localhost:5173
```

For another device to connect, use the hosting laptop's current network IPv4 address:

```text
http://HOST_LAPTOP_IP:5173
```

The frontend automatically derives the backend API address from the hostname used to access the application.

## 🗄️ Database Configuration

### Local Demo Mode

The default launcher starts the Spring Boot backend using the `local` profile.

This profile uses:

- H2 in-memory database.
- Automatic Hibernate schema creation.
- No external PostgreSQL connection.
- No Supabase credentials required.

**Important:** H2 is an in-memory database. Its database contents are lost when the backend process stops.

### Supabase PostgreSQL

The backend also includes configuration for Supabase PostgreSQL integration.

Production database configuration requires the appropriate environment variables and database setup. The local H2 demo mode does not require these.

## 🧪 Testing and Building

### Backend tests

```powershell
cd backend
.\mvnw.cmd test
```

### Frontend production build

```bash
cd frontend/Blackwood_Manor_Detective_Game
npm run build
```

## 🔧 Troubleshooting

| Problem | Possible solution |
|---|---|
| Java not found | Install Java JDK 21 or newer and configure PATH. |
| Node.js not found | Install Node.js 20 or newer. |
| Port 8080 already occupied | Close the existing backend process. |
| Port 5173 already occupied | Close the existing Vite process. |
| Phone cannot open the application | Check the shared network, host IP, firewall and client isolation settings. |
| Frontend opens but API requests fail | Ensure the backend is running and both devices use the host laptop's address. |
| Room cannot be joined | Verify the room code and confirm the host backend is running. |
| Backend fails to start | Check the backend terminal for Maven or Java errors. |

## 👥 Project Team

**CASE CLOSED — Java Mini Project 2026**

| Team Member | Responsibility |
|---|---|
| Ishaan Garud | Backend development, APIs, security and integration |
| Masood Halim | Database design, Supabase schema and migrations |
| Stella Ghodke | Frontend development and user interface |

## 📁 Project Structure

```text
Java-Miniproject/
│
├── backend/
│   ├── src/
│   └── pom.xml
│
├── frontend/
│   └── Blackwood_Manor_Detective_Game/
│       ├── src/
│       ├── public/
│       └── package.json
│
├── supabase/
│
├── docs/
│
├── START-CASE-CLOSED.bat
├── start-backend.ps1
├── start-frontend.ps1
├── start-case-closed.ps1
│
├── README.md
├── PROJECT_STATE.md
├── WORKFLOW.md
└── CHANGELOG.md
```

## 📌 Important Notes

- The local demo is designed for trusted development and demonstration networks.
- The local demo backend currently permits API access without user authentication. Do not expose it to untrusted networks or the public internet.
- The H2 database is temporary and resets when the backend stops.
- Local-network multiplayer depends on the host laptop remaining powered on and running both services.

---

**Investigate. Collaborate. Connect the clues. Deliver the verdict.**

# CASE CLOSED 🔍