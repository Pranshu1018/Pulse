import { Card, Box, Stack, Typography, Button, Divider, Chip, CircularProgress } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { UserAvatar } from "../UserAvatar/UserAvatar";
import { useAuth } from "../../context/AuthContext";
import { suggestedUsers, toggleFollow } from "../../services/users";
import { useNotify } from "../../app/SnackbarProvider";

const TRENDS = [
  { tag: "#TaskPlanet", posts: "2.4k posts" },
  { tag: "#ReactJS", posts: "1.1k posts" },
  { tag: "#DesignDaily", posts: "987 posts" },
  { tag: "#Startup", posts: "654 posts" },
];

export function RightSidebar() {
  const { user } = useAuth();
  const notify = useNotify();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["suggested", user?.id],
    queryFn: () => suggestedUsers(user?.id),
  });

  const followMutation = useMutation({
    mutationFn: toggleFollow,
    onSuccess: (result, userId) => {
      queryClient.invalidateQueries({ queryKey: ["suggested"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      notify(result.isFollowing ? "Now following!" : "Unfollowed", "success");
    },
    onError: (err: any) => {
      notify(err.message || "Failed to update follow status", "error");
    },
  });

  return (
    <Stack spacing={2} sx={{ position: "sticky", top: 80 }}>
      <Card sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <TrendingUpIcon color="primary" fontSize="small" />
          <Typography fontWeight={800}>Trending</Typography>
        </Stack>
        <Stack spacing={1}>
          {TRENDS.map((t) => (
            <Box key={t.tag} sx={{ p: 1, borderRadius: 2, "&:hover": { bgcolor: "action.hover" }, cursor: "pointer" }}>
              <Typography fontWeight={700} color="primary">{t.tag}</Typography>
              <Typography variant="caption" color="text.secondary">{t.posts}</Typography>
            </Box>
          ))}
        </Stack>
      </Card>

      <Card sx={{ p: 2 }}>
        <Typography fontWeight={800} sx={{ mb: 1.5 }}>
          Suggested for you
        </Typography>
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={2}>
            <CircularProgress size={24} />
          </Box>
        ) : data && data.length > 0 ? (
          <Stack spacing={1.5}>
            {data.slice(0, 4).map((u) => (
              <Stack key={u.id} direction="row" alignItems="center" spacing={1.5}>
                <Link to={`/profile/${u.username}`} style={{ textDecoration: "none" }}>
                  <UserAvatar src={u.avatar} name={u.name} size={40} />
                </Link>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Link to={`/profile/${u.username}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <Typography fontWeight={700} noWrap>{u.name}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>@{u.username}</Typography>
                  </Link>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {u.followersCount || 0} followers
                  </Typography>
                </Box>
                <Button 
                  size="small" 
                  variant={u.isFollowing ? "outlined" : "contained"}
                  onClick={() => followMutation.mutate(u.id)}
                  disabled={followMutation.isPending}
                  sx={{ minWidth: 80, fontSize: 12 }}
                >
                  {u.isFollowing ? "Following" : "Follow"}
                </Button>
              </Stack>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" align="center" py={2}>
            No suggestions available
          </Typography>
        )}
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {["All", "Refer & Earn", "Crypto"].map((c, i) => (
            <Chip key={c} label={c} size="small" color={i === 0 ? "primary" : "default"} variant={i === 0 ? "filled" : "outlined"} />
          ))}
        </Stack>
      </Card>
    </Stack>
  );
}
