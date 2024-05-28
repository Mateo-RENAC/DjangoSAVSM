#!/bin/bash

# Start the Django server
cd stock
../.venv/bin/python manage.py runserver &
cd ..

# Start the frontend server (assuming it's a simple HTTP server)
cd panel-frontend
gnome-terminal -- sh -c "bash -c \"npm run dev; exec bash\"" &
cd ..