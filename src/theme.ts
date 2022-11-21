import { createTheme } from "@mui/material/styles";

// A custom theme for this app
export const light = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#00ebc7",
    },
    secondary: {
      main: "#ff5470",
    },
    background: {
      default: "#f3f4fb",
      paper: "#fffffe",
    },
    text: {
      primary: "#1b2d45",
      secondary: "rgba(0,0,0,0.54)",
    },
    divider: "rgba(60,60,60,0.12)",
  },
});

export const dark = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#7f5af0",
    },
    secondary: {
      main: "#2cb67d",
    },
    divider: "rgba(84,84,84,0.48)",
    background: {
      default: "#181818",
      paper: "#16161a",
    },
    text: {
      primary: "#94a1b2",
      secondary: "#fffffe",
    },
  },
});
