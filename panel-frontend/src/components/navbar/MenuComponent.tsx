// src/components/Navbar/MenuComponent.tsx
import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MenuComponent: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    handleClose();
  };

  return (
    <>
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
        <MenuItem onClick={() => handleMenuItemClick("/GraphBoard")}>Graphs</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("/ListBoard")}>Lists</MenuItem>
      </Menu>
    </>
  );
};

export default MenuComponent;
