// components/DeleteModal.tsx
import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const DeleteModal: React.FC<{ product: any, open: boolean, onClose: () => void }> = ({ product, open, onClose }) => {
  const handleDelete = () => {
    fetch(`/api/products/${product.id}/`, {
      method: 'DELETE',
    }).then(() => onClose());
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography variant="h6" component="h2">Confirm Deletion</Typography>
        <Typography variant="body1">Are you sure you want to delete {product.name}?</Typography>
        <Button variant="contained" color="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleDelete}>Delete</Button>
      </Box>
    </Modal>
  );
};

export default DeleteModal;
