import { Card, Stack, Typography, Box, Button, CircularProgress } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { UserAvatar } from "../UserAvatar/UserAvatar";
import { suggestedUsers, toggleFollow } from "../../services/users";
import { useAuth } from "../../context/AuthContext";
import { useNotify } from "../../app/SnackbarProvider";

export function SuggestedUsers() {
  const { user: me } = useAuth();
  const notify = useNotify();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: () => suggestedUsers(me?.id),
  });

  const followMutation = useMutation({
    mutationFn: toggleFollow,
    onSuccess: (data, userId) => {
      queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      notify(data.isFollowing ? "Now following!" : "Unfollowed", "success");
    },
    onError: (err: any) => {
      notify(err.message || "Failed to update follow status", "error");
    },
  });

  if (isLoading) {
    return (
      <Card sx={{ p: 2.5 }}>
        <Typography fontWeight={800} mb={2}>Suggested for you</Typography>
        <Box display="flex" justifyContent="center" py={3}>
          <CircularProgress size={24} />
        </Box>
      </Card>
    );
  }

  if (!users || users.length === 0) return null;

  return (
    <Card sx={{ p: 2.5 }}>
      <Typography fontWeight={800} mb={2}>Suggested for you</Typography>
      <Stack spacing={2}>
        {users.map((u) => (
          <Stack key={u.id} direction="row" spacing={1.5} alignItems="center">
            <Link to="/profile/$username" params={{ username: u.username }} style={{ flexShrink: 0 }}>
              <UserAvatar src={u.avatar} name={u.name} size={44} />
            </Link>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Link
                to="/profile/$username"
                params={{ username: u.username }}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Typography fontWeight={700} fontSize={14} noWrap>{u.name}</Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  @{u.username}
                </Typography>
              </Link>
              <Typography variant="caption" color="text.secondary" display="block">
                {u.followersCount || 0} followers
              </Typography>
            </Box>
            <Button
              variant={u.isFollowing ? "outlined" : "contained"}
              size="small"
              onClick={() => followMutation.mutate(u.id)}
              disabled={followMutation.isPending}
              sx={{ minWidth: 80, fontSize: 12, fontWeight: 700 }}
            >
              {u.isFollowing ? "Following" : "Follow"}
            </Button>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
