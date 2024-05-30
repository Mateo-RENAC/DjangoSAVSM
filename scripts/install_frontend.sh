#!/bin/bash

# Nom du projet
PROJECT_NAME="panel-frontend"

# Vérifie si le projet existe déjà
if [ -d "$PROJECT_NAME" ]; then
  echo "The project $PROJECT_NAME already exist. Downloading modules..."
else
  echo "Création du projet $PROJECT_NAME..."
  npx create-next-app@latest $PROJECT_NAME
fi

# Déplacez-vous dans le répertoire du projet
cd $PROJECT_NAME

# Installe les modules nécessaires
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material react-mermaid2 mermaid react-chartjs-2 chart.js
npm install tailwindcss postcss autoprefixer react-router-dom

# Si tailwind.config.js n'existe pas, initialisez Tailwind CSS
if [ ! -f "tailwind.config.js" ]; then
  npx tailwindcss init -p
fi

echo "Download complete !"
echo "For more information, don't forget to read the README.md !"