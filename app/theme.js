'use client';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // เขียวหลัก
    },
    secondary: {
      main: '#FFFFFF', // ขาว
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0, // Remove body margin
          padding: 0,
          backgroundColor: '#ffffff',
          color: '#171717',
          fontFamily: 'Arial, Helvetica, sans-serif',
        },
      },
    },
  },
});

export default function ThemeWrapper({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
