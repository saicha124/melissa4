@echo off
echo ========================================
echo Installing dependencies...
echo ========================================
call npm install

echo.
echo ========================================
echo Starting the application...
echo ========================================
call npm run dev

pause
