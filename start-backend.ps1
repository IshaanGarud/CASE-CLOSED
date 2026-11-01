
$ErrorActionPreference = "Stop"

$backend = Join-Path $PSScriptRoot "backend"

if (-not (Test-Path (Join-Path $backend "mvnw.cmd"))) {
    Write-Host "Backend Maven Wrapper not found." -ForegroundColor Red
    exit 1
}

Set-Location $backend

Write-Host "Starting CASE CLOSED backend..." -ForegroundColor Green
Write-Host "Open http://localhost:8080/api/test"

.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=local"
