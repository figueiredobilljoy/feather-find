@echo off
title Feather Find — React + Node Server
echo.
echo  ================================
echo   Feather Find v3 — Starting...
echo  ================================
echo.
echo  Open: http://localhost:5173
echo  Press Ctrl+C to stop.
echo.
cd /d "%~dp0"

:: Start backend in a separate background window
start "Feather Find Backend" cmd /k "cd backend && npm start"

:: Start frontend in this window
cd frontend
npm run dev
