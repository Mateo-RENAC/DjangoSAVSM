@echo off

:: Nom du projet
set PROJECT_NAME=panel-frontend

:: Vérifie si le projet existe déjà
if exist "%PROJECT_NAME%" (
    echo The project %PROJECT_NAME% already exist. Downloading modules...
) else (
    echo CREATE %PROJECT_NAME% APP...
    npx create-next-app@latest %PROJECT_NAME%
)

:: Déplacez-vous dans le répertoire du projet
cd %PROJECT_NAME%

:: Installe les modules nécessaires
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material styled-components react-mermaid2 mermaid react-chartjs-2 chart.js
npm install tailwindcss postcss autoprefixer react-router-dom react-resizable react-icons

:: Vérifie si tailwind.config.js n'existe pas, initialisez Tailwind CSS
if not exist "tailwind.config.js" (
    npx tailwindcss init -p
)

echo Download complete !
echo For more information, take a look to the README.md !