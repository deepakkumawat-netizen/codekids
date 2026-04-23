@echo off
REM CodeKids - Startup Script for Windows

echo.
echo ================================
echo   CodeKids - Local Development
echo ================================
echo.

REM Check Python
python --version >/dev/null 2>&1
if errorlevel 1 (
    echo ERROR: Python not found. Please install Python 3.10+
    pause
    exit /b 1
)

REM Check Node
node --version >/dev/null 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found. Please install Node.js 18+
    pause
    exit /b 1
)

echo [OK] Dependencies found
echo.

echo Starting Backend and Frontend in new windows...
echo.

cd /d C:\codekids\backend
start "CodeKids Backend - Port 7000" cmd /k python main.py

timeout /t 2

cd /d C:\codekids\frontend
start "CodeKids Frontend - Port 5175" cmd /k npm run dev

timeout /t 2

echo Opening browser to http://localhost:5175...
start http://localhost:5175

echo.
echo CodeKids is starting!
echo Keep both terminal windows open.
echo To stop: Press CTRL+C in each window.
echo.
pause
