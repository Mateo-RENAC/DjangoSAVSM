// components/Navbar.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';


const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" style={{textDecoration: 'none', color: 'inherit'}}>
            Product Dashboard
          </a>
        </Typography>
        <Button color="inherit" href={"/"}>Home</Button>
        <Button color="inherit" href="/about">About</Button>
        <Button color="inherit" href="/contact">Contact</Button>
        <Button color="inherit" href="/graphBoard">Graph Board</Button>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;