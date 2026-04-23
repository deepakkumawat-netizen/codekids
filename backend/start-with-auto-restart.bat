@echo off
echo.
echo ========================================
echo CodeKids Backend - Auto Restart Mode
echo ========================================
echo.
echo This will:
echo - Watch for code changes
echo - Automatically restart backend
echo - Show all server output
echo.
echo Press Ctrl+C to stop
echo ========================================
echo.

cd /d "%~dp0"
python auto-restart.py

pause
