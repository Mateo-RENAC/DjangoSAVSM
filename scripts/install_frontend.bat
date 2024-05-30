@echo off

:: Nom du projet
set PROJECT_NAME=panel-frontend

:: Vérifie si le projet existe déjà
if exist "%PROJECT_NAME%" (
    echo Le projet %PROJECT_NAME% existe deja. Installation des modules...
) else (
    echo Création du projet %PROJECT_NAME%...
    npx create-next-app@latest %PROJECT_NAME%
)

:: Déplacez-vous dans le répertoire du projet
cd %PROJECT_NAME%

:: Installe les modules nécessaires
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material react-mermaid2 mermaid react-chartjs-2 chart.js
npm install tailwindcss postcss autoprefixer react-router-dom

:: Vérifie si tailwind.config.js n'existe pas, initialisez Tailwind CSS
if not exist "tailwind.config.js" (
    npx tailwindcss init -p
)

echo Installation terminée!
pause