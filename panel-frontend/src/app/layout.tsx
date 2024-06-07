import React from 'react';
import './styles/globals.css';
import Navbar from "@/components/Navbar/Navbar";

export default function RootLayout({ children, isDarkMode, toggleTheme }) {
  return (
    <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <main>{children}</main>
    </div>
  );
}
