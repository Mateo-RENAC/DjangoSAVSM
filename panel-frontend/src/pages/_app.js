// src/pages/_app.js
"use client"; // Add this directive

import Layout from '../app/layout';

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}