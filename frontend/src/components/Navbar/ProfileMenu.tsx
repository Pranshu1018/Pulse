import { Menu, MenuItem, ListItemIcon, Divider, IconButton } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { UserAvatar } from "../UserAvatar/UserAvatar";
import { useAuth } from "../../context/AuthContext";
import { useThemeMode } from "../../app/AppProviders";
import { useNotify } from "../../app/SnackbarProvider";

export function ProfileMenu() {
  const { user, logout } = useAuth();
  const { mode, toggle } = useThemeMode();
  const navigate = useNavigate();
  const notify = useNotify();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  if (!user) return null;

  return (
    <>
      <IconButton onClick={(e) => setAnchor(e.currentTarget)} sx={{ p: 0.25 }}>
        <UserAvatar src={user.avatar} name={user.name} size={36} ring />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={!!anchor}
        onClose={() => setAnchor(null)}
        PaperProps={{ sx: { mt: 1, minWidth: 220, borderRadius: 3, boxShadow: 8 } }}
      >
        <MenuItem
          onClick={() => {
            navigate({ to: "/profile/$username", params: { username: user.username } });
            setAnchor(null);
          }}
        >
          <ListItemIcon><PersonOutlineIcon fontSize="small" /></ListItemIcon>
          View profile
        </MenuItem>
        <MenuItem onClick={() => { toggle(); setAnchor(null); }}>
          <ListItemIcon>{mode === "light" ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}</ListItemIcon>
          {mode === "light" ? "Dark mode" : "Light mode"}
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            logout();
            notify("Signed out", "success");
            navigate({ to: "/login" });
          }}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
          Log out
        </MenuItem>
      </Menu>
    </>
  );
}
