import type { DefaultTheme } from "styled-components";

export const theme: DefaultTheme = {
  typography: {
    fonts: {
      thin: "'FiraSans-Thin', sans-serif",
      extralight: "'FiraSans-ExtraLight', sans-serif",
      light: "'FiraSans-Light', sans-serif",
      regular: "'FiraSans-Regular', sans-serif",
      medium: "'FiraSans-Medium', sans-serif",
      semibold: "'FiraSans-SemiBold', sans-serif",
      bold: "'FiraSans-Bold', sans-serif",
      extrabold: "'FiraSans-ExtraBold', sans-serif",
      black: "'FiraSans-Black', sans-serif",
      thinItalic: "'FiraSans-Thin-Italic', sans-serif",
      extralightItalic: "'FiraSans-ExtraLight-Italic', sans-serif",
      lightItalic: "'FiraSans-Light-Italic', sans-serif",
      regularItalic: "'FiraSans-Regular-Italic', sans-serif",
      mediumItalic: "'FiraSans-Medium-Italic', sans-serif",
      semiboldItalic: "'FiraSans-SemiBold-Italic', sans-serif",
      boldItalic: "'FiraSans-Bold-Italic', sans-serif",
      extraboldItalic: "'FiraSans-ExtraBold-Italic', sans-serif",
      blackItalic: "'FiraSans-Black-Italic', sans-serif",
      numbers: "'RobotoFlex-VariableFont', sans-serif",
    },
    sizes: {
      header: "2em",
      body: "0.8em",
      label: "16px",
      title: "1.5em",
      helper: "0.7em",
      hint: "0.75em",
      tab: "0.6em",
      subject: "1em",
      xl: "2.5em",
    },
    weights: {
      header: 900,
      body: 500,
      title: 600,
      subject: 500,
      light: 350,
    },
    lineHeights: {
      body: "1.5",
      heading: "1.2",
    },
    letterSpacing: {
      body: "0.02em",
      heading: "0.01em",
    },
  },

  colors: {
    primary: "#ea7f05",
    error: "#ff471e",
    accent: "#002968",
    textPrimary: "#272525",
    textSecondary: "#514f4f",
    primaryBackground: "#f8eee2",
    secondaryBackground: "#f2e0cb",
    brand: {
      green: "#d6f500",
      red: "#ff471e",
      blue: "#002968",
      white: "#f7f7f7",
    },
    disabled: "#1e2021",
    semitransparent: "#f8eee283",
  },
  spacing: {
    tight: "0.2rem",
    small: "0.5rem",
    medium: "1rem",
    large: "2rem",
    xlarge: "4rem",
  },
  borders: {
    width: {
      thin: "1px",
      medium: "2px",
      thick: "4px",
    },
    radius: {
      small: "4px",
      medium: "8px",
      big: "12px",
      large: "16px",
      rounded: "50px",
    },
    color: {
      primary: "#d6f500",
      secondary: "#1e2021",
    },
  },
  shadows: {
    small: "0 1px 3px rgba(0, 0, 0, 0.12)",
    medium: "0 4px 6px rgba(0, 0, 0, 0.16)",
    large: "0 10px 20px rgba(0, 0, 0, 0.24)",
  },
  breakpoints: {
    mobile: "480px",
    tablet: "768px",
    laptop: "1024px",
    desktop: "1200px",
  },
  zIndex: {
    subroot: -500,
    root: 0,
    suboverlay: 900,
    overlay: 1000,
    overlayContent: 1500,
    modal: 2000,
    dropdown: 500,
    tooltip: 200,
    topmost: 10000,
  },
  animations: {
    duration: {
      short: "200ms",
      medium: "400ms",
      long: "600ms",
    },
    easing: {
      easeIn: "cubic-bezier(0.5, 0, 0.5, 1)",
      easeOut: "cubic-bezier(0, 0, 0.5, 1)",
      easeInOut: "cubic-bezier(0.5, 0, 0.5, 1)",
    },
  },
  iconSizes: {
    small: "16px",
    medium: "24px",
    large: "32px",
    xlarge: "48px",
  },
};

export default theme;
