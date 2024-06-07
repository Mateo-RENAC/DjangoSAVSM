// pages/_app.js
import { useEffect, useState } from 'react';
import { getSession, signOut } from 'next-auth/react';
import customFetch from '../lib/fetch';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import GraphBoard from './GraphBoard';
import Layout from '../app/layout';
import Home from './index';
import '../app/styles/globals.css';
import ListBoard from './ListBoard';
import PageTest from './PageTest';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from '../app/theme';
import Login from './Login';
import Logout from './Logout';
import { getCsrfToken, checkSession, refreshToken } from '../lib/auth';
import axiosInstance from '../lib/axiosConfig';

const MyApp = ({ pageProps }) => {
    useEffect(() => {
    const initializeAuth = async () => {
      await getCsrfToken();
      await checkSession();

      setInterval(async () => {
        await refreshToken();
      }, 4 * 60 * 1000); // Refresh token every 4 minutes
    };

    initializeAuth();
  }, []);

  const [isClient, setIsClient] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const initialMode = savedTheme ? savedTheme === 'dark' : prefersDarkScheme.matches;
    setIsDarkMode(initialMode);

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
    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
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
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Router>
        <Layout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
          <div className="app">
            <Breadcrumb separator=">" />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/Logout" element={<Logout />} />
              <Route path="/" element={<Home />} />
              <Route path="/GraphBoard" element={<GraphBoard />} />
              <Route path="/ListBoard" element={<ListBoard />} />
              <Route path="/PageTest" element={<PageTest />} />
            </Routes>
          </div>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default MyApp;
