import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Stack, TextField, Button, InputAdornment, IconButton, Typography, CircularProgress, Box,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { AuthLayout } from "../layouts/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { useNotify } from "../app/SnackbarProvider";

export function LoginPage() {
  const { login } = useAuth();
  const notify = useNotify();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(email, pw);
      notify("Welcome back!", "success");
      navigate("/feed");
    } catch (e2: unknown) {
      const msg = e2 instanceof Error ? e2.message : "Something went wrong";
      setErr(msg);
      notify(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue to your feed.">
      <Box component="form" onSubmit={submit}>
        <Stack spacing={2}>
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          <TextField
            label="Password"
            type={show ? "text" : "password"}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            required
            autoComplete="current-password"
            error={!!err}
            helperText={err || " "}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShow((s) => !s)} edge="end" size="small">
                    {show ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" size="large" disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
          <Typography variant="body2" color="text.secondary" align="center">
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "inherit", fontWeight: 700 }}>Create one</Link>
          </Typography>
        </Stack>
      </Box>
    </AuthLayout>
  );
}
