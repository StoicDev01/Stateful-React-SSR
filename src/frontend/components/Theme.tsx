import { createTheme } from "@mui/material"

export default createTheme({
  fontFamily: {
    body: "'Roboto', var(--joy-fontFamily-fallback)"
  },
  typography: {
    // @ts-ignore
    display1: undefined,
    display2: undefined,
    h1: undefined,
    h2: undefined,
    h3: undefined,
    h4: undefined,
    h5: undefined,
    h6: undefined,
    body1: undefined,
    body2: undefined,
    body3: undefined,
    body4: undefined,
    body5: undefined,

    displayLarge: {
      fontSize: "57px",
      lineHeight: "64px",
      letterSpacing: "-0.25px"
    },
    displayMedium: {
      fontSize: "45px",
      lineHeight: "52px"
    },
    displaySmall: {
      fontSize: "36px",
      lineHeight: "44px"
    },
    headlineLarge: {
      fontSize: "32px",
      lineHeight: "40px"
    },
    headlineMedium: {
      fontSize: "28px",
      lineHeight: "36px"
    },
    headlineSmall: {
      fontSize: "24px",
      lineHeight: "32px"
    },
    titleLarge: {
      fontSize: "22px",
      lineHeight: "28px"
    },
    titleMedium: {
      fontSize: "16px",
      lineHeight: "24px",
      fontWeight: "500",
      letterSpacing: "0.1px"
    },
    titleSmall: {
      fontSize: "14px",
      lineHeight: "20px",
      fontWeight: "500",
      letterSpacing: "0.1px"
    },
    labelLarge: {
      fontSize: "14px",
      lineHeight: "20px",
      fontWeight: "500",
      letterSpacing: "0.1px"
    },
    labelMedium: {
      fontSize: "12px",
      lineHeight: "16px",
      fontWeight: "500",
      letterSpacing: "0.5px"
    },
    labelSmall: {
      fontSize: "11px",
      lineHeight: "16px",
      fontWeight: "500",
      letterSpacing: "0.5px"
    },
    bodyLarge: {
      fontSize: "16px",
      lineHeight: "24px",
      letterSpacing: "0.5px"
    },
    bodyMedium: {
      fontSize: "14px",
      lineHeight: "20px",
      letterSpacing: "0.25px"
    },
    bodySmall: {
      fontSize: "12px",
      lineHeight: "16px",
      letterSpacing: "0.4px"
    }
  },
  
  palette: {
    mode : "dark",

    text : {
      primary : "#f7f7f7",
      secondary : "#888888",
      disabled : "#888888"
    },
    
    primary: {
      light: '#fdc659',
      main: '#b18631',
      dark: '#8e6b27',
      contrastText: '#fff',
    },

    background : {
      default : "#151515",
      paper : "#101010"
    },

    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    }  
  }
});