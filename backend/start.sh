#!/bin/bash
# NAZEM.AI - Backend Launcher (Git Bash compatible)
# Run this from the Nazeem/backend folder: bash start.sh

echo ""
echo "  ███╗   ██╗ █████╗ ███████╗███████╗███╗   ███╗"
echo "  ████╗  ██║██╔══██╗╚══███╔╝██╔════╝████╗ ████║"
echo "  ██╔██╗ ██║███████║  ███╔╝ █████╗  ██╔████╔██║"
echo "  ██║╚██╗██║██╔══██║ ███╔╝  ██╔══╝  ██║╚██╔╝██║"
echo "  ██║ ╚████║██║  ██║███████╗███████╗██║ ╚═╝ ██║"
echo "  ╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝     ╚═╝"
echo ""
echo "  NAZEM.AI Backend Launcher"
echo "-------------------------------------------"

# Activate venv (Git Bash on Windows)
if [ -f "venv/Scripts/activate" ]; then
  source venv/Scripts/activate
  echo "✅ Virtual environment activated."
else
  echo "❌ venv not found. Run: python -m venv venv && pip install -r requirements.txt"
  exit 1
fi

# Launch uvicorn
echo "🚀 Starting FastAPI server on http://localhost:8000"
echo ""
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
