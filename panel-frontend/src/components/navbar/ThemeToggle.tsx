// src/components/Navbar/ThemeToggle.tsx
import React from 'react';
import { IconButton } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';

const ThemeToggle: React.FC<{ isDarkMode: boolean, toggleTheme: () => void }> = ({ isDarkMode, toggleTheme }) => {
  return (
    <IconButton onClick={toggleTheme} color="inherit" sx={{ fontSize: '2rem' }}>
      {isDarkMode ? <DarkMode style={{ color: 'black', fontSize: '3rem' }} /> : <LightMode style={{ color: 'yellow', fontSize: '3rem' }} />}
    </IconButton>
  );
};

export default ThemeToggle;
