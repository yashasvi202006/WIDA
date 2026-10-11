@echo off
title WIDA Diagnostic Laboratory Module Launcher
echo ========================================================
echo   WIDA Diagnostic Laboratory Module (Port 5176 / 8082)
echo ========================================================
echo.

cd /d "%~dp0\.."

echo [1/3] Initializing and Seeding Isolated SQLite Database...
node lab\database\seed.js
if %errorlevel% neq 0 (
    echo [ERROR] Database seeding failed.
    pause
    exit /b %errorlevel%
)

echo [2/3] Launching Lab REST API Server on Port 8082 in background...
start "WIDA Lab Backend Server" cmd /k "node lab\backend\server.js"

echo [3/3] Launching Lab Frontend UI on Port 5176...
echo Point your browser to: http://127.0.0.1:5176
npx vite --config lab\vite.config.js
