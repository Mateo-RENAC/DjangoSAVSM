import React from 'react';
import List from '@/components/List'; // Ajustez le chemin selon votre structure de projet
import DataTable from "@/components/Table";

const HomePage = () => {
  const columns = [
    { field: 'product', label: 'Product' },
    { field: 'count', label: 'Count' },
    { field: 'pending_count', label: 'Pending count' },
  ];

  return (
    <div>
        <h1>Home Page</h1>
        <List dataUrl="http://localhost:8000/panel/api/stock/" columns={columns} />
    </div>
  );
};

export default HomePage;
