// app/theme.js
import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f0f0f0',
    },
    text: {
      primary: '#000000',
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--background-color)',
          color: 'var(--foreground-color)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--background-color)',
          color: 'var(--foreground-color)',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'var(--foreground-color)',
            },
            '&:hover fieldset': {
              borderColor: '#888',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'var(--foreground-color)',
            },
          },
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000000',
    },
    text: {
      primary: '#ffffff',
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--background-color)',
          color: 'var(--foreground-color)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--background-color)',
          color: 'var(--foreground-color)',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'var(--foreground-color)',
            },
            '&:hover fieldset': {
              borderColor: '#888',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'var(--foreground-color)',
            },
          },
        },
      },
    },
  },
});
