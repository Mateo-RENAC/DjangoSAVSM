// components/Navbar.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Product Dashboard
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