import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const isChromium = () => {
  const userAgent = navigator.userAgent;
  return /Chrome|Chromium/.test(userAgent) && !/Edge|Edg|OPR/.test(userAgent);
};

const Navbar: React.FC<{ isDarkMode: boolean, toggleTheme: () => void }> = ({ isDarkMode, toggleTheme }) => {
  const [isChromeDarkMode, setIsChromeDarkMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (isChromium()) {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsChromeDarkMode(darkModeMediaQuery.matches);
      darkModeMediaQuery.addEventListener('change', (e) => setIsChromeDarkMode(e.matches));
    }
  }, []);

  const handleMenuItemClick = (path: string) => {
    navigate(path); // Utilisez la fonction navigate pour la navigation
    handleClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Product Dashboard
          </a>
        </Typography>
        <Button color="inherit" aria-controls="menu" aria-haspopup="true" onClick={handleClick}>
          More
        </Button>
        <Menu
          id="menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleMenuItemClick("/graphBoard")}>Graphs</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("/ListBoard")}>Lists</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("/about")}>About</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("/contact")}>Contact</MenuItem>
        </Menu>
        <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
        <Button color="inherit">Login</Button>
        <IconButton onClick={toggleTheme} color="inherit" sx={{ fontSize: '2rem' }}>
          {isDarkMode ? <DarkMode style={{ color: 'black', fontSize: '3rem' }} /> : <LightMode style={{ color: 'yellow', fontSize: '3rem' }} />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
