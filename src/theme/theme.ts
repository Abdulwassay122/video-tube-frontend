import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light", // or "dark"
    primary: {
      main: "#1976d2", // blue
    },
    secondary: {
      main: "#1E1E1E", // purple
    },
    background: {
      default: "#f5f5f5",
      paper: "#fff",
    },
  },

  typography: {
    fontFamily: "Inter, sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          textTransform: "none",
        },
      },
    },
  },
});

export default theme;