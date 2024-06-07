// pages/ListBoard.tsx
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import DataList from '@/components/data/DataList';

const ListBoard = () => {
  const [selectedModel, setSelectedModel] = useState(null);

  const models = [
    { name: 'Products', endpoint: 'product' },
    { name: 'Stock', endpoint: 'stock' },
    { name: 'Order', endpoint: 'order' }
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
          <DataList dataUrl={selectedModel.endpoint} columns={selectedModel.columns} />
        </div>
      )}
    </div>
  );
};

export default ListBoard;