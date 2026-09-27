@echo off
echo Starting Nazem-AI...

:: Start the backend in a new command prompt window
echo Starting Backend...
start "Nazem-AI Backend" cmd /k "cd backend && if not exist venv (echo Creating venv and installing requirements... && python -m venv venv && call venv\Scripts\activate.bat && pip install -r requirements.txt) else (call venv\Scripts\activate.bat) && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

:: Start the frontend in a new command prompt window
echo Starting Frontend...
start "Nazem-AI Frontend" cmd /k "cd frontend && npm run dev"

echo Both services are starting!
echo Backend should be available at http://localhost:8000
echo Frontend should be available at http://localhost:3000
pause
