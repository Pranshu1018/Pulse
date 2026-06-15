import { createTheme, type ThemeOptions } from "@mui/material/styles";

const shared: ThemeOptions = {
  shape: { borderRadius: 16 },
  typography: {
    fontFamily:
      '"Inter", "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, letterSpacing: "-0.02em" },
    h2: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, letterSpacing: "-0.02em" },
    h3: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, letterSpacing: "-0.01em" },
    h4: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700 },
    h5: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700 },
    h6: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 18, paddingBlock: 8 },
        sizeLarge: { paddingInline: 24, paddingBlock: 11, fontSize: "0.95rem" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 20, border: "1px solid", borderColor: "var(--mui-card-border)" },
      },
    },
    MuiPaper: { defaultProps: { elevation: 0 } },
    MuiTextField: { defaultProps: { variant: "outlined", fullWidth: true } },
    MuiOutlinedInput: {
      styleOverrides: { root: { borderRadius: 14 } },
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
    MuiAppBar: { defaultProps: { elevation: 0, color: "inherit" } },
  },
};

export const getTheme = (mode: "light" | "dark") =>
  createTheme({
    ...shared,
    palette:
      mode === "light"
        ? {
            mode,
            primary: { main: "#2E5BFF", light: "#5C82FF", dark: "#1E3FCC" },
            secondary: { main: "#FF5C8A" },
            success: { main: "#16A34A" },
            warning: { main: "#F59E0B" },
            error: { main: "#EF4444" },
            background: { default: "#F4F6FB", paper: "#FFFFFF" },
            text: { primary: "#0B1020", secondary: "#5B6477" },
            divider: "rgba(15,23,42,0.08)",
          }
        : {
            mode,
            primary: { main: "#6E8BFF", light: "#9DB1FF", dark: "#4063E6" },
            secondary: { main: "#FF7BA6" },
            success: { main: "#34D399" },
            warning: { main: "#FBBF24" },
            error: { main: "#F87171" },
            background: { default: "#0B1020", paper: "#141A2E" },
            text: { primary: "#F1F5FB", secondary: "#9AA4B8" },
            divider: "rgba(255,255,255,0.08)",
          },
  });
