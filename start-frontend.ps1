
$ErrorActionPreference = "Stop"

$project = Join-Path $PSScriptRoot "frontend\Blackwood_Manor_Detective_Game"

if (-not (Test-Path (Join-Path $project "package.json"))) {
    Write-Host "Frontend project not found." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path (Join-Path $project "node_modules"))) {
    Write-Host "Installing frontend dependencies..."
    Push-Location $project
    npm install
    Pop-Location
}

Set-Location $project

Write-Host "Starting CASE CLOSED frontend..." -ForegroundColor Green
Write-Host "Open http://localhost:5173"

npm run dev
