import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';

const Navbar: React.FC<{ isDarkMode: boolean, toggleTheme: () => void }> = ({ isDarkMode, toggleTheme }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Product Dashboard
          </a>
        </Typography>
        <Button color="inherit" href="/">Home</Button>
        <Button color="inherit" href="/about">About</Button>
        <Button color="inherit" href="/contact">Contact</Button>
        <Button color="inherit" href="/graphBoard">Graph Board</Button>
        <Button color="inherit">Login</Button>
        <IconButton onClick={toggleTheme} color="inherit" sx={{ fontSize: '2rem' }}>
          {isDarkMode ? <DarkMode style={{ color: 'yellow', fontSize: '2rem' }} /> : <LightMode style={{ color: 'black', fontSize: '2rem' }} />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;