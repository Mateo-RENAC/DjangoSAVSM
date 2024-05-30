// src/pages/_app.js
"use client"; // Add this directive

import Layout from '../app/layout';
import {useEffect, useState} from "react";

export default function MyApp({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if(isClient)
  {
    return (
        <Layout>
          <Component {...pageProps} />
        </Layout>);
  }

  return <h1></h1>;
}