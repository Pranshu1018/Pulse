import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  Stack, TextField, Button, InputAdornment, IconButton, Typography, CircularProgress, Box, LinearProgress,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useMemo, useState } from "react";
import { AuthLayout } from "../layouts/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { useNotify } from "../app/SnackbarProvider";
import { passwordStrength } from "../utils/passwordStrength";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account · Social Spark" }, { name: "description", content: "Create your Social Spark account." }] }),
  component: SignupPage,
});

function SignupPage() {
  const { signup } = useAuth();
  const notify = useNotify();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => passwordStrength(pw), [pw]);
  const mismatch = confirm.length > 0 && confirm !== pw;
  const invalidUser = username.length > 0 && !/^[a-zA-Z0-9_.]{3,20}$/.test(username);
  const canSubmit =
    !!username && !!email && pw.length >= 8 && !mismatch && !invalidUser && !loading;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    try {
      await signup({ username, email, password: pw });
      notify("Account created — welcome!", "success");
      navigate({ to: "/feed" });
    } catch (e2: unknown) {
      const msg = e2 instanceof Error ? e2.message : "Something went wrong";
      notify(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create account" subtitle="Join Social Spark — it takes 30 seconds.">
      <Box component="form" onSubmit={submit}>
        <Stack spacing={2}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value.trim())}
            required
            error={invalidUser}
            helperText={invalidUser ? "3–20 chars, letters/numbers/_." : " "}
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Box>
            <TextField
              label="Password"
              type={show ? "text" : "password"}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
              fullWidth
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
            {pw && (
              <Box sx={{ mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={(strength.score / 4) * 100}
                  sx={{
                    height: 6, borderRadius: 999, bgcolor: "action.hover",
                    "& .MuiLinearProgress-bar": { bgcolor: strength.color },
                  }}
                />
                <Typography variant="caption" sx={{ color: strength.color, fontWeight: 700 }}>
                  {strength.label}
                </Typography>
              </Box>
            )}
          </Box>
          <TextField
            label="Confirm password"
            type={show ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            error={mismatch}
            helperText={mismatch ? "Passwords don't match" : " "}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!canSubmit}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
          >
            {loading ? "Creating…" : "Create account"}
          </Button>
          <Typography variant="body2" color="text.secondary" align="center">
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--mui-palette-primary-main)", fontWeight: 700, textDecoration: "none" }}>
              Sign in
            </Link>
          </Typography>
        </Stack>
      </Box>
    </AuthLayout>
  );
}
