import { useEffect, useMemo, useState, createContext, useContext, type ReactNode } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { getTheme } from "./theme";
import { SnackbarProvider } from "./SnackbarProvider";
import { AuthProvider } from "../context/AuthContext";

type Mode = "light" | "dark";
type Ctx = { mode: Mode; toggle: () => void };
const ThemeModeContext = createContext<Ctx>({ mode: "light", toggle: () => {} });
export const useThemeMode = () => useContext(ThemeModeContext);

export function AppProviders({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem("theme-mode") as Mode | null) ?? null;
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setMode(saved ?? (prefersDark ? "dark" : "light"));
    setMounted(true);
  }, []);

  const ctx = useMemo<Ctx>(
    () => ({
      mode,
      toggle: () =>
        setMode((m) => {
          const next = m === "light" ? "dark" : "light";
          localStorage.setItem("theme-mode", next);
          return next;
        }),
    }),
    [mode],
  );

  const theme = useMemo(() => getTheme(mode), [mode]);

  if (!mounted) {
    return <div style={{ minHeight: "100vh", background: "#F4F6FB" }} />;
  }

  return (
    <ThemeModeContext.Provider value={ctx}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>
          <AuthProvider>{children}</AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
