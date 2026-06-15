import { Paper, BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const value = location.pathname.startsWith("/search")
    ? "search"
    : location.pathname.startsWith("/profile")
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
          if (v === "feed") navigate("/feed");
          else if (v === "search") navigate("/search");
          else if (v === "profile" && user) navigate(`/profile/${user.username}`);
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
