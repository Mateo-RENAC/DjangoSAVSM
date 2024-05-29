// components/InlineProductForm.tsx
import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

const InlineProductForm: React.FC<{ onSave: () => void }> = ({ onSave }) => {
  const [name, setName] = useState('');
  const [reference, setReference] = useState('');
  const [userName, setUserName] = useState('');
  const [count, setCount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/products/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, reference, user_name: userName, count }),
    }).then(() => onSave());
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2 }}>
      <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <TextField label="Reference" value={reference} onChange={(e) => setReference(e.target.value)} />
      <TextField label="User Name" value={userName} onChange={(e) => setUserName(e.target.value)} />
      <TextField label="Count" value={count} onChange={(e) => setCount(e.target.value)} type="number" required />
      <Button type="submit" variant="contained" color="primary">Save</Button>
    </Box>
  );
};

export default InlineProductForm;
