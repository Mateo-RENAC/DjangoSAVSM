import React from 'react';
import DataTable from '@/components/List'; // Ajustez le chemin selon votre structure de projet

const HomePage = () => {
  const columns = [
    { field : 'name', title: 'Name' },
    { field: 'count', label: 'Count' },
    { field: 'pending_count', label: 'Pending count' },
    { field: 'product.name', label: 'Product' }
  ];

  const search_columns = [
      'name',
      'user_name'
  ]

  return (
    <div>
      <h1>Home Page</h1>
      <DataTable dataUrl="http://localhost:8000/panel/api/stock/" columns={columns} search_column={search_columns}/>
    </div>
  );
};

export default HomePage;
