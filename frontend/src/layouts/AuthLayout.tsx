import { Box, Card, Stack, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1.05fr 1fr" },
        bgcolor: "background.default",
      }}
    >
      {!isMobile && (
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(135deg, #2E5BFF 0%, #6E8BFF 60%, #A8C0FF 100%)",
            color: "white",
            p: 6,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "rgba(255,255,255,0.2)", display: "grid", placeItems: "center", fontWeight: 900 }}>P</Box>
              <Typography variant="h6" fontWeight={900}>Pulse</Typography>
            </Stack>
          </Box>

          <Box sx={{ maxWidth: 420 }}>
            <Typography variant="h2" sx={{ fontSize: { md: "2.6rem" }, lineHeight: 1.05 }}>
              Share moments.<br />Spark conversations.
            </Typography>
            <Typography sx={{ mt: 2, opacity: 0.85, fontSize: 16 }}>
              A modern social space inspired by your favorite feeds — clean, fast, and made for you.
            </Typography>
          </Box>

          {/* floating mock cards */}
          <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
            {[
              { top: "12%", right: "8%", delay: 0 },
              { top: "55%", right: "22%", delay: 0.4 },
              { top: "70%", right: "-4%", delay: 0.7 },
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: p.delay, duration: 0.8 }}
                style={{ position: "absolute", top: p.top, right: p.right }}
              >
                <Card sx={{ p: 1.5, width: 220, bgcolor: "rgba(255,255,255,0.12)", color: "white", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.3)" }} />
                    <Box>
                      <Typography variant="caption" fontWeight={700}>Aria · just now</Typography>
                      <Typography variant="caption" sx={{ display: "block", opacity: 0.8 }}>❤ 24  💬 5</Typography>
                    </Box>
                  </Stack>
                </Card>
              </motion.div>
            ))}
          </Box>

          <Typography variant="caption" sx={{ opacity: 0.75 }}>© {new Date().getFullYear()} Pulse · Mini Social Demo</Typography>
        </Box>
      )}

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 3, sm: 5 } }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: "100%", maxWidth: 440 }}
        >
          <Card
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 5,
              backdropFilter: "blur(20px)",
              bgcolor: (t) => (t.palette.mode === "light" ? "rgba(255,255,255,0.85)" : "rgba(20,26,46,0.85)"),
              boxShadow: "0 20px 60px -20px rgba(46,91,255,0.25)",
            }}
          >
            <Typography variant="h4" fontWeight={900}>{title}</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>{subtitle}</Typography>
            {children}
          </Card>
        </motion.div>
      </Box>
    </Box>
  );
}
