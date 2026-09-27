@echo off
echo Starting Nazem-AI Frontend...

:: Increase memory limit for Node.js to fix "Fatal process out of memory" error
set NODE_OPTIONS=--max_old_space_size=8192

npm run dev
pause
