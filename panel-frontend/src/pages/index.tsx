// pages/index.tsx
import React from 'react';
import ShortcutPanel from "@/components/ShortcutManager";

const HomePage = () => {

  return (
    <div>
        <h1>Home Page</h1>
        <DataTable dataUrl="http://localhost:8000/panel/api/stock-and-products/"/>
    </div>
  );
};

export default HomePage;
