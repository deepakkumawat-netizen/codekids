@echo off
title CodeKids Startup
echo Starting CodeKids...
echo.
echo Starting Backend on port 7000...
start "CodeKids Backend" cmd /k "cd /d %~dp0backend && python main.py"
timeout /t 3
echo.
echo Starting Frontend on port 5175...
start "CodeKids Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 5
echo.
echo Opening http://localhost:5175 in browser...
start http://localhost:5175
echo Done! Servers should be running now.
pause
