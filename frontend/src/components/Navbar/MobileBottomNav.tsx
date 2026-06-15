import { Paper, BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "../../context/AuthContext";

export function MobileBottomNav() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const value = pathname.startsWith("/search")
    ? "search"
    : pathname.startsWith("/profile")
    ? "profile"
    : "feed";

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        display: { xs: "block", md: "none" },
        borderTop: "1px solid",
        borderColor: "divider",
        zIndex: 1100,
        borderRadius: 0,
      }}
    >
      <BottomNavigation
        value={value}
        showLabels
        sx={{ bgcolor: "background.paper", height: 64 }}
        onChange={(_, v) => {
          if (v === "feed") navigate({ to: "/feed" });
          else if (v === "search") navigate({ to: "/search", search: { q: "" } as never });
          else if (v === "profile" && user)
            navigate({ to: "/profile/$username", params: { username: user.username } });
        }}
      >
        <BottomNavigationAction value="feed" label="Home" icon={<HomeRoundedIcon />} />
        <BottomNavigationAction value="tasks" label="Tasks" icon={<AssignmentTurnedInOutlinedIcon />} disabled />
        <BottomNavigationAction value="search" label="Social" icon={<PublicOutlinedIcon />} />
        <BottomNavigationAction value="lb" label="Leaders" icon={<EmojiEventsOutlinedIcon />} disabled />
        <BottomNavigationAction value="profile" label="Profile" icon={<ChatBubbleOutlineIcon />} />
      </BottomNavigation>
    </Paper>
  );
}
