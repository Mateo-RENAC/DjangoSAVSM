// components/ProductInfoModal.tsx
import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const ProductInfoModal: React.FC<{ product: any, open: boolean, onClose: () => void }> = ({ product, open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography variant="h6" component="h2">Product Information</Typography>
        <Typography variant="body1"><strong>Name:</strong> {product.name}</Typography>
        <Typography variant="body1"><strong>Reference:</strong> {product.reference}</Typography>
        <Typography variant="body1"><strong>User Name:</strong> {product.user_name}</Typography>
        <Typography variant="body1"><strong>Count:</strong> {product.count}</Typography>
        <Button variant="contained" color="secondary" onClick={onClose}>Close</Button>
      </Box>
    </Modal>
  );
};

export default ProductInfoModal;