// pages/ListBoard.tsx
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import List from '@/components/List';

const ListBoard = () => {
  const [selectedModel, setSelectedModel] = useState(null);

  const models = [
    { name: 'Products', endpoint: 'http://localhost:8000/panel/api/products/', columns: [{ field: 'name', label: 'Name' }, { field: 'description', label: 'Description' }] },
    { name: 'Stock', endpoint: 'http://localhost:8000/panel/api/stock/', columns: [{ field: 'product', label: 'Product' }, { field: 'count', label: 'Count' }, { field: 'pending_count', label: 'Pending count' }] },
    { name: 'Orders', endpoint: 'http://localhost:8000/panel/api/orders/', columns: [{ field: 'product', label: 'Product Name' }, { field: 'quantity', label: 'Quantity' }] },
    // Add more models as necessary
  ];

  const handleModelSelect = (model) => {
    setSelectedModel(model);
  };

  return (
    <div style={{ margin: '20px' }}>
      {models.map(model => (
        <Button
          key={model.name}
          variant="contained"
          style={{ margin: '10px' }}
          onClick={() => handleModelSelect(model)}
        >
          {model.name}
        </Button>
      ))}

      {selectedModel && (
        <div style={{ marginTop: '20px' }}>
          <h1>{selectedModel.name} List</h1>
          <List dataUrl={selectedModel.endpoint} columns={selectedModel.columns} />
        </div>
      )}
    </div>
  );
};

export default ListBoard;