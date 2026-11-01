@echo off
setlocal
cd /d "%~dp0"

title CASE CLOSED Launcher

echo.
echo ==========================================
echo          CASE CLOSED - STARTUP
echo ==========================================
echo.

where java >nul 2>&1
if errorlevel 1 (
    echo ERROR: Java 21 or newer is required.
    pause
    exit /b 1
)

where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is required.
    pause
    exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm was not found.
    pause
    exit /b 1
)

if not exist "backend\mvnw.cmd" (
    echo ERROR: Maven Wrapper not found.
    pause
    exit /b 1
)

if not exist "frontend\Blackwood_Manor_Detective_Game\package.json" (
    echo ERROR: Frontend project not found.
    pause
    exit /b 1
)

echo Checking Java...
java -version

echo Checking Node...
node --version

echo.
echo Checking ports...

powershell -NoProfile -Command "if (Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue) { exit 1 }"
if errorlevel 1 (
    echo ERROR: Port 8080 is already occupied.
    pause
    exit /b 1
)

powershell -NoProfile -Command "if (Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue) { exit 1 }"
if errorlevel 1 (
    echo ERROR: Port 5173 is already occupied.
    pause
    exit /b 1
)

if not exist "frontend\Blackwood_Manor_Detective_Game\.env" (
    copy "frontend\Blackwood_Manor_Detective_Game\.env.example" "frontend\Blackwood_Manor_Detective_Game\.env" >nul
    if errorlevel 1 (
        echo ERROR: Could not create frontend configuration.
        pause
        exit /b 1
    )
)
if not exist "frontend\Blackwood_Manor_Detective_Game\node_modules" (
    echo Installing frontend dependencies...
    pushd "frontend\Blackwood_Manor_Detective_Game"
    call npm ci
    if errorlevel 1 (
        echo ERROR: npm install failed.
        popd
        pause
        exit /b 1
    )
    popd
)

echo.
echo Starting backend...

start "CASE CLOSED Backend" /D "%~dp0backend" cmd.exe /k "mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local"

echo Waiting for backend...

powershell -NoProfile -Command "$ready=$false; for($i=0;$i -lt 90;$i++){try{$r=Invoke-WebRequest 'http://localhost:8080/api/test' -UseBasicParsing -TimeoutSec 2;if($r.StatusCode -eq 200){$ready=$true;break}}catch{};Start-Sleep 2};if(-not $ready){exit 1}"

if errorlevel 1 (
    echo ERROR: Backend did not start. Check its terminal window.
    pause
    exit /b 1
)

echo Backend is ready!

echo.
echo Starting frontend...

start "CASE CLOSED Frontend" /D "%~dp0frontend\Blackwood_Manor_Detective_Game" cmd.exe /k "npm run dev -- --host 127.0.0.1"

echo Waiting for frontend...

powershell -NoProfile -Command "$ready=$false; for($i=0;$i-lt 45;$i++){try{$r=Invoke-WebRequest 'http://localhost:5173' -UseBasicParsing -TimeoutSec 2;if($r.StatusCode -eq 200){$ready=$true;break}}catch{};Start-Sleep 2};if(-not $ready){exit 1}"

if errorlevel 1 (
    echo ERROR: Frontend did not start. Check its terminal window.
    pause
    exit /b 1
)

echo.
echo CASE CLOSED IS READY!
start "" "http://localhost:5173"

echo Keep both service windows open while playing.
pause
