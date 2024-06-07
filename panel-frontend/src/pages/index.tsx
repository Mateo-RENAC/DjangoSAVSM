// pages/index.tsx
import React from 'react';
import DataTable from '@/components/data/DataTable';

const HomePage = () => {
  console.log('Test Variable:', process.env.TEST_VARIABLE);  // Should log 'HelloWorld'

  return (
    <div>
        <h1>Home Page</h1>
        <DataTable dataUrl="product"/>
    </div>
  );
};

export default HomePage;
