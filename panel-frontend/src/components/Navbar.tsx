// components/NavBar.tsx
"use client"; // Add this directive

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';

const isChromium = () => {
  const userAgent = navigator.userAgent;
  return /Chrome|Chromium/.test(userAgent) && !/Edge|Edg|OPR/.test(userAgent);
};

const Navbar: React.FC<{ isDarkMode: boolean, toggleTheme: () => void }> = ({ isDarkMode, toggleTheme }) => {
  const [isChromeDarkMode, setIsChromeDarkMode] = useState(false);

  useEffect(() => {
    if (isChromium()) {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsChromeDarkMode(darkModeMediaQuery.matches);
      darkModeMediaQuery.addEventListener('change', (e) => setIsChromeDarkMode(e.matches));
    }
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Product Dashboard
          </a>
        </Typography>
        <Button color="inherit" href="/">Home</Button>
        <Button color="inherit" href="/graphBoard">Graphs</Button>
        <Button color="inherit" href="/ListBoard">Lists</Button>
        <Button color="inherit">Login</Button>
        <IconButton onClick={toggleTheme} color="inherit" sx={{ fontSize: '2rem' }}>
          {isDarkMode ? <DarkMode style={{ color: 'black', fontSize: '3rem' }} /> : <LightMode style={{ color: 'yellow', fontSize: '3rem' }} />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;