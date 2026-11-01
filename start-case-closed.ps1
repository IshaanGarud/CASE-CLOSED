
$ErrorActionPreference = "Stop"

$root = $PSScriptRoot

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "       CASE CLOSED - LAUNCHER" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$backendScript = Join-Path $root "start-backend.ps1"
$frontendScript = Join-Path $root "start-frontend.ps1"

if (-not (Test-Path $backendScript)) {
    Write-Host "Backend startup script not found." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $frontendScript)) {
    Write-Host "Frontend startup script not found." -ForegroundColor Red
    exit 1
}

Write-Host "Starting backend..." -ForegroundColor Green
Start-Process powershell.exe -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy", "Bypass",
    "-File", "`"$backendScript`""
)

Start-Sleep -Seconds 3

Write-Host "Starting frontend..." -ForegroundColor Green
Start-Process powershell.exe -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy", "Bypass",
    "-File", "`"$frontendScript`""
)

Write-Host ""
Write-Host "CASE CLOSED launch commands submitted." -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173"
Write-Host "Backend:  http://localhost:8080/api"
Write-Host ""
Write-Host "Close the two service windows to stop the application." -ForegroundColor Yellow
