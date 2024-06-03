// src/pages/_app.js
"use client"; // Add this directive

import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import GraphBoard from "./graphBoard";
import About from "./about";
import Contact from "./contact";
import Layout from '../app/layout';
import Home from "./index";

function MyApp({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <h1>Loading...</h1>; // Display loading indicator while client-side rendering is set up
  }

  return (
    <Router>
      <Layout>
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