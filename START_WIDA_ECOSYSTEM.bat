@echo off
title WIDA Healthcare Ecosystem - Unified System Launcher
color 0b
echo ===============================================================================
echo        WIDA SMART HEALTHCARE & CLINICAL WORKSPACE - UNIFIED SYSTEM             
echo                 Integrated Multi-Module Enterprise Ecosystem                  
echo ===============================================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking WIDA Patient Java Backend (Port 8080)...
if exist "src\modules\patient\backend\bin" (
    start "WIDA Patient Java Backend (8080)" /min java -cp "bin;lib/*" com.wida.patient.backend.PatientBackendServer
    echo   - Started Java Backend on port 8080
) else (
    echo   - Java backend bin not found, skipping direct java start.
)

echo.
echo [2/3] Starting WIDA Diagnostic Laboratory Backend (Port 8082)...
start "WIDA Lab Backend (8082)" /min node lab/backend/server.js
echo   - Started Node Diagnostic REST API on port 8082

echo.
echo [3/3] Starting WIDA Frontend Application (Port 5173)...
start "WIDA Frontend Dev Server (5173)" /min cmd /c "npm run dev"
echo   - Started Vite Frontend on port 5173

echo.
echo Waiting 4 seconds for services to initialize...
timeout /t 4 /nobreak >nul

echo.
echo Launching WIDA Healthcare Gateway in your default browser...
start http://localhost:5173/?login=true

echo.
echo ===============================================================================
echo   SERVICES RUNNING:
echo   - Patient Portal:        http://localhost:5173/?portal=patient
echo   - Doctor Portal:         http://localhost:5173/?portal=doctor
echo   - Diagnostic Lab Portal: http://localhost:5173/?portal=lab
echo   - Central Pharmacy:      http://localhost:5173/?portal=pharmacy
echo   - Java REST API:         http://localhost:8080/api/system/health
echo   - Lab REST API:          http://localhost:8082/api/lab/health
echo ===============================================================================
echo.
echo Keep this window open. Press any key to stop background runner.
pause >nul
