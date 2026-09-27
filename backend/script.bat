@echo off
echo Starting Nazem-AI Backend...

if not exist venv (
    echo Creating virtual environment and installing dependencies...
    python -m venv venv
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate.bat
)

python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
pause
