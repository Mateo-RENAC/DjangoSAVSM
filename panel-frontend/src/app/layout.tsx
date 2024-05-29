"use client";

import React from 'react';
import Head from 'next/head';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

export default function Layout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>My Next.js App</title>
      </Head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}