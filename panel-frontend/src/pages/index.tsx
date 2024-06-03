// pages/index.tsx
import React from 'react';
import DataTable from "@/components/Table";

const HomePage = () => {

  return (
    <div>
        <h1>Home Page</h1>
        <DataTable dataUrl="http://localhost:8000/panel/api/products/"/>
    </div>
  );
};

export default HomePage;
