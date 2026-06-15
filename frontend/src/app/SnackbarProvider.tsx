import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { Alert, Snackbar, type AlertColor } from "@mui/material";

type Notify = (msg: string, severity?: AlertColor) => void;
const SnackbarCtx = createContext<Notify>(() => {});
export const useNotify = () => useContext(SnackbarCtx);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("success");

  const notify = useCallback<Notify>((m, s = "success") => {
    setMsg(m);
    setSeverity(s);
    setOpen(true);
  }, []);

  return (
    <SnackbarCtx.Provider value={notify}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={3200}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          variant="filled"
          severity={severity}
          onClose={() => setOpen(false)}
          sx={{ borderRadius: 3, boxShadow: 6 }}
        >
          {msg}
        </Alert>
      </Snackbar>
    </SnackbarCtx.Provider>
  );
}
