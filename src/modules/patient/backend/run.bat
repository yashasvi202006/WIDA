@echo off
REM ====================================================================
REM  WIDA Patient Module - Java Backend & SQLite Database Runner
REM ====================================================================

echo [WIDA] Checking Java Environment...
java -version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Java is not installed or not in PATH! Please install JDK 21.
    pause
    exit /b 1
)

cd /d "%~dp0"

echo [WIDA] Compiling Java backend classes...
if not exist "bin" mkdir "bin"

set CP="lib/*"
javac -cp %CP% -d bin src\com\wida\patient\backend\config\*.java src\com\wida\patient\backend\util\*.java src\com\wida\patient\backend\model\*.java src\com\wida\patient\backend\db\*.java src\com\wida\patient\backend\controller\*.java src\com\wida\patient\backend\PatientBackendServer.java

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Compilation failed!
    pause
    exit /b 1
)

echo [WIDA] Compilation successful! Starting Java Backend Server on port 8080...
echo [WIDA] Press Ctrl+C anytime to stop the server.
echo.

java -cp "bin;lib/*" com.wida.patient.backend.PatientBackendServer
pause
