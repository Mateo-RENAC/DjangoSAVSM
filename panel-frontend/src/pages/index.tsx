// pages/index.tsx
import React from 'react';
import ShortcutPanel from "@/components/ShortcutManager";

const HomePage = () => {

  return (
      <div className="App">
          <header className="App-header">
              <h1>Mon Application</h1>
              <ShortcutPanel/>
          </header>
      </div>
  );
};

export default HomePage;
