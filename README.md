# CASE CLOSED — Cooperative Mystery Investigation Platform

> Academic Project: Java Miniproject 2026  
> Technology Stack: Spring Boot 4.1.2 (Java 21) + React 19 / Vite + PostgreSQL / Supabase

---

## 1. Quick Start (Local Run Mode)

You can launch both the frontend and backend locally with zero external cloud dependencies.

### One-Click Launch (Both Services):
```powershell
.\start-case-closed.ps1
```

### Or Launch Individually:

**1. Launch Spring Boot Backend (Port 8080):**
```powershell
.\start-backend.ps1
```
*(Runs with profile `local` using isolated in-memory storage; health check accessible at `http://localhost:8080/api/test`)*

**2. Launch Vite Frontend (Port 5173):**
```powershell
.\start-frontend.ps1
```
*(Open browser to `http://localhost:5173`)*

---

## 2. Platform Architecture & Local Demo Setup

- **Backend:** Spring Boot 4.1.2 with JPA, Spring Security (CORS enabled for Vite), and transactional room services.
- **Frontend:** React 19 + Tailwind CSS + Framer Motion. Uses `apiService.js` to communicate with `http://localhost:8080/api`. If the backend is stopped, it gracefully falls back to mock storage.
- **Database Profiles:**
  - `local`: Standalone in-memory execution for demos, testing, and UI evaluation.
  - `dev` / `prod`: Configured for Supabase PostgreSQL (`spring.datasource.url=${SUPABASE_DB_URL}`) with `spring.jpa.hibernate.ddl-auto=none`.

---

## 3. Stopping the Platform

To stop the services, simply press `Ctrl+C` in the respective PowerShell windows or close the terminal windows.
