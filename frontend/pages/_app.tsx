import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider, } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import NavigationBar from "../frontend/components/NavigationBar"
import theme from "../frontend/components/Theme"
import { useEffect } from 'react';

export function getPages(){
  const pages = [
    {
      name : "about",
      href : "/about"
    }
  ];

  return pages;
}


export default function App({ Component, pageProps }: AppProps) {
  const pages = getPages();
  
  return (
    <div>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Box
          sx={{
            bgcolor : "background.default"
          }}
          minWidth="100vw"
          minHeight="100vh"
        >
        <NavigationBar
          sitePages={pages}
        />

        <Component {...pageProps} />


        </Box>


      </ThemeProvider>
    </div>
  );
}
