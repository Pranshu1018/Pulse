import {
  AppBar, Toolbar, Box, Stack, IconButton, Chip, useMediaQuery, Badge,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { useTheme } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { SearchBar } from "../SearchBar/SearchBar";
import { ProfileMenu } from "./ProfileMenu";
import { useThemeMode } from "../../app/AppProviders";

export function TopBar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { mode, toggle } = useThemeMode();

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        backdropFilter: "saturate(180%) blur(8px)",
      }}
    >
      <Toolbar sx={{ gap: 2, px: { xs: 2, md: 3 } }}>
        <Link to="/feed" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <Box
            sx={{
              width: 34, height: 34, borderRadius: 2,
              background: "linear-gradient(135deg,#2E5BFF,#7AA0FF)",
              display: "grid", placeItems: "center", color: "white", fontWeight: 900,
            }}
          >
            P
          </Box>
          {!isMobile && (
            <Box sx={{ fontWeight: 900, color: "text.primary", fontSize: 18, letterSpacing: "-0.02em" }}>
              Pulse
            </Box>
          )}
        </Link>

        {!isMobile && (
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <SearchBar />
          </Box>
        )}
        {isMobile && <Box sx={{ flex: 1 }} />}

        <Stack direction="row" alignItems="center" spacing={1}>
          <Chip
            icon={<StarRoundedIcon sx={{ color: "#F59E0B !important" }} />}
            label="60"
            size="small"
            sx={{ fontWeight: 800, bgcolor: "action.hover" }}
          />
          {!isMobile && (
            <Chip label="₹0.00" size="small" sx={{ fontWeight: 800, bgcolor: "success.light", color: "success.dark" }} />
          )}
          <IconButton sx={{ display: { xs: "none", sm: "inline-flex" } }}>
            <Badge color="error" variant="dot">
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>
          <IconButton onClick={toggle} sx={{ display: { xs: "none", sm: "inline-flex" } }}>
            {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
          <ProfileMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
