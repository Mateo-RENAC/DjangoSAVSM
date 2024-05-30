import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
// @ts-ignore
export default function Layout({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <html lang="en">
        <head>
          <title>My Next.js App</title>
        </head>
        <body>
          {children}
        </body>
      </html>
    </ThemeProvider>
  );
}