@echo off

REM Start the frontend server (assuming it's a simple HTTP server)
cd panel-frontend
start cmd /k "npm run dev"
cd ..

REM Start the Django server
cd stock
"../.venv\Scripts\python" manage.py runserver
cd ..