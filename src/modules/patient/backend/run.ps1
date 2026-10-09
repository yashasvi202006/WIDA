# ====================================================================
#  WIDA Patient Module - Java Backend & SQLite Database PowerShell Runner
# ====================================================================

$backendDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $backendDir

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "   WIDA PATIENT MODULE - JAVA ENTERPRISE BACKEND RUNNER          " -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

$javaVersion = java -version 2>&1 | Out-String
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Java is not installed or not in PATH." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "bin")) {
    New-Item -ItemType Directory -Path "bin" | Out-Null
}

Write-Host "[WIDA] Compiling Java backend source code..." -ForegroundColor Yellow
$javaFiles = Get-ChildItem -Path "src" -Recurse -Filter *.java | ForEach-Object { $_.FullName }
& javac -cp "lib/*" -d "bin" $javaFiles

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Java compilation failed!" -ForegroundColor Red
    exit 1
}

Write-Host "[WIDA] Starting Java Backend Server on http://localhost:8080..." -ForegroundColor Green
& java -cp "bin;lib/*" com.wida.patient.backend.PatientBackendServer
