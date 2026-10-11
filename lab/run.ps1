# ========================================================
# WIDA Diagnostic Laboratory Module — PowerShell Launcher
# ========================================================

$RootPath = Resolve-Path "$PSScriptRoot\.."
Set-Location $RootPath

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  WIDA Diagnostic Laboratory Module Launcher" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# 1. Database Seeding
Write-Host "`n[1/3] Checking & Seeding Laboratory SQLite Database..." -ForegroundColor Yellow
node lab/database/seed.js

# 2. Start Backend Server
Write-Host "`n[2/3] Launching Lab REST API Server on http://127.0.0.1:8082..." -ForegroundColor Yellow
$BackendProcess = Start-Process -FilePath "node" -ArgumentList "lab/backend/server.js" -PassThru -NoNewWindow

# 3. Start Frontend Dev Server
Write-Host "`n[3/3] Starting Vite Frontend on http://127.0.0.1:5176..." -ForegroundColor Green
Write-Host "Opening Lab Workspace in default browser..." -ForegroundColor Green

Start-Process "http://127.0.0.1:5176"
npx vite --config lab/vite.config.js
