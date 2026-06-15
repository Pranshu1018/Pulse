import { Card, Box, Stack, Typography, Button, Divider } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { UserAvatar } from "../UserAvatar/UserAvatar";
import { useAuth } from "../../context/AuthContext";
import { userStats } from "../../services/users";

export function LeftProfileCard() {
  const { user } = useAuth();
  if (!user) return null;
  const stats = userStats(user.id);

  return (
    <Card sx={{ overflow: "hidden", position: "sticky", top: 80 }}>
      <Box
        sx={{
          height: 80,
          backgroundImage: `url(${user.cover})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Box sx={{ p: 2, pt: 0, textAlign: "center" }}>
        <Box sx={{ mt: -4.5, display: "inline-block" }}>
          <UserAvatar src={user.avatar} name={user.name} size={72} ring />
        </Box>
        <Typography variant="h6" fontWeight={800} sx={{ mt: 1 }}>
          {user.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          @{user.username}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {user.bio}
        </Typography>
      </Box>
      <Divider />
      <Stack direction="row" sx={{ p: 2 }} justifyContent="space-around">
        <Stat label="Posts" value={stats.posts} />
        <Stat label="Likes" value={stats.likes} />
        <Stat label="Comments" value={stats.comments} />
      </Stack>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Link to={`/profile/${user.username}`} style={{ textDecoration: "none" }}>
          <Button fullWidth variant="outlined">
            View your profile
          </Button>
        </Link>
      </Box>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography fontWeight={800}>{value}</Typography>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}
