import { Box, Container, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { ReactNode } from "react";
import { TopBar } from "../components/Navbar/TopBar";
import { MobileBottomNav } from "../components/Navbar/MobileBottomNav";
import { LeftProfileCard } from "../components/Sidebar/LeftProfileCard";
import { RightSidebar } from "../components/Sidebar/RightSidebar";

export function AppLayout({ children, sidebars = true }: { children: ReactNode; sidebars?: boolean }) {
  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.up("lg"));
  const isMd = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <TopBar />
      <Container maxWidth="lg" sx={{ pt: { xs: 2, md: 3 }, pb: { xs: 10, md: 5 } }}>
        <Box
          sx={{
            display: "grid",
            gap: { xs: 2, md: 3 },
            gridTemplateColumns: sidebars
              ? { xs: "1fr", md: "1fr 2fr", lg: "260px 1fr 300px" }
              : { xs: "1fr" },
          }}
        >
          {sidebars && isLg && <Box><LeftProfileCard /></Box>}
          <Box sx={{ minWidth: 0 }}>{children}</Box>
          {sidebars && isMd && <Box><RightSidebar /></Box>}
        </Box>
      </Container>
      <MobileBottomNav />
    </Box>
  );
}
