"use client"; // Add this directive

import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import GraphBoard from "./graphBoard";
import About from "./about";
import Contact from "./contact";
import Layout from '../app/layout';
import Home from "./index";
import "../app/styles/globals.css"; // Import global styles

const isChromium = () => {
  const userAgent = navigator.userAgent;
  return /Chrome|Chromium/.test(userAgent) && !/Edge|Edg|OPR/.test(userAgent);
};

const loadCSS = (href) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
};

function MyApp({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isChromeDarkMode, setIsChromeDarkMode] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const initialMode = savedTheme ? savedTheme === 'dark' : prefersDarkScheme.matches;
    setIsDarkMode(initialMode);

    if (isChromium()) {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsChromeDarkMode(darkModeMediaQuery.matches);
      darkModeMediaQuery.addEventListener('change', (e) => setIsChromeDarkMode(e.matches));
    }

    applyTheme(initialMode);

    prefersDarkScheme.addEventListener("change", (e) => {
      setIsDarkMode(e.matches);
      applyTheme(e.matches);
    });

    return () => {
      prefersDarkScheme.removeEventListener("change", (e) => {
        setIsDarkMode(e.matches);
        applyTheme(e.matches);
      });
    };
  }, []);

  const applyTheme = (darkMode) => {
    document.querySelectorAll('link[rel="stylesheet"][href*="theme"]').forEach((link) => link.remove());

    if (darkMode) {
      loadCSS('@/app/styles/dark-theme.css');
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      if (isChromium() && isChromeDarkMode) {
        document.body.classList.remove('invert-colors');
      }
    } else {
      loadCSS('@/app/styles/light-theme.css');
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
      if (isChromium() && isChromeDarkMode) {
        document.body.classList.add('invert-colors');
      }
    }
  };

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    applyTheme(newMode);
  };

  if (!isClient) {
    return <h1>Loading...</h1>; // Display loading indicator while client-side rendering is set up
  }

  return (
    <Router>
      <Layout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
        <div className="app">
          <Breadcrumb separator=">" />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/graphboard" element={<GraphBoard />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </Layout>
    </Router>
  );
}

export default MyApp;