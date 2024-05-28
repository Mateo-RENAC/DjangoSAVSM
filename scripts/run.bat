@echo off

cd stock
REM Start the frontend server (assuming it's a simple HTTP server)
start cmd /k "cd ../panel-frontend/ && npm run dex"

REM Start the Django server
".venv\Scripts\python" manage.py runserver
cd ..