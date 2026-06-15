import { createFileRoute, useParams, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Card, Box, Stack, Typography, Button, Tabs, Tab, Divider,
} from "@mui/material";
import { AnimatePresence } from "framer-motion";
import { UserAvatar } from "../components/UserAvatar/UserAvatar";
import { PostCard } from "../components/PostCard/PostCard";
import { CommentModal } from "../components/CommentModal/CommentModal";
import { ProfileSkeleton, FeedSkeleton } from "../components/Loader/Skeletons";
import { EmptyState } from "../components/EmptyState/EmptyState";
import { PageTransition } from "../components/Motion/PageTransition";
import { getUserByUsername, toggleFollow } from "../services/users";
import { listPostsByUser, type EnrichedPost } from "../services/posts";
import { useAuth } from "../context/AuthContext";
import { useNotify } from "../app/SnackbarProvider";

export const Route = createFileRoute("/_app/profile/$username")({
  component: ProfilePage,
});

function ProfilePage() {
  const { username } = useParams({ from: "/_app/profile/$username" });
  const navigate = useNavigate();
  const { user: me } = useAuth();
  const notify = useNotify();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState(0);
  const [active, setActive] = useState<EnrichedPost | null>(null);

  const userQ = useQuery({
    queryKey: ["user", username],
    queryFn: () => getUserByUsername(username),
  });
  const postsQ = useQuery({
    queryKey: ["userPosts", userQ.data?.id],
    queryFn: () => listPostsByUser(userQ.data!.id),
    enabled: !!userQ.data?.id,
  });

  const followMutation = useMutation({
    mutationFn: (userId: string) => toggleFollow(userId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user", username] });
      queryClient.invalidateQueries({ queryKey: ["suggested"] });
      notify(data.isFollowing ? `Now following @${username}` : `Unfollowed @${username}`, "success");
    },
    onError: (err: any) => {
      notify(err.message || "Failed to update follow status", "error");
    },
  });

  if (userQ.isLoading) return <PageTransition><ProfileSkeleton /></PageTransition>;
  if (!userQ.data) {
    return (
      <PageTransition>
        <EmptyState
          icon="👤"
          title="User not found"
          description="The profile you're looking for doesn't exist."
          actionLabel="Back to feed"
          onAction={() => navigate({ to: "/feed" })}
        />
      </PageTransition>
    );
  }

  const u = userQ.data;
  const stats = {
    posts: u.postCount || 0,
    likes: u.totalLikes || 0,
    comments: u.totalComments || 0,
  };
  const isMe = me?.id === u.id;
  const activeLive = active && postsQ.data?.find((p) => p.id === active.id) ? postsQ.data.find((p) => p.id === active.id)! : active;

  return (
    <PageTransition>
      <Stack spacing={2.5}>
        <Card sx={{ overflow: "hidden" }}>
          <Box
            sx={{
              height: { xs: 140, sm: 200 },
              backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.35) 100%), url(${u.cover})`,
              backgroundSize: "cover", backgroundPosition: "center",
            }}
          />
          <Box sx={{ px: { xs: 2, sm: 3 }, pb: 3 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: { xs: -6, sm: -7 }, alignItems: { sm: "flex-end" } }}>
              <UserAvatar src={u.avatar} name={u.name} size={104} ring />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h5" fontWeight={900}>{u.name}</Typography>
                <Typography color="text.secondary">@{u.username}</Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                {isMe ? (
                  <Button variant="outlined" onClick={() => notify("Edit profile coming soon", "warning")}>Edit profile</Button>
                ) : (
                  <>
                    <Button variant="outlined" onClick={() => notify("Chat coming soon", "warning")}>Message</Button>
                    <Button 
                      variant={u.isFollowing ? "outlined" : "contained"}
                      onClick={() => followMutation.mutate(u.id)}
                      disabled={followMutation.isPending}
                    >
                      {u.isFollowing ? "Following" : "Follow"}
                    </Button>
                  </>
                )}
              </Stack>
            </Stack>

            <Typography sx={{ mt: 2 }}>{u.bio}</Typography>

            <Stack direction="row" spacing={3} sx={{ mt: 2 }} divider={<Divider orientation="vertical" flexItem />}>
              <Stat label="Posts" value={stats.posts} />
              <Stat label="Likes" value={stats.likes} />
              <Stat label="Comments" value={stats.comments} />
              <Stat label="Followers" value={u.followersCount || 0} />
              <Stat label="Following" value={u.followingCount || 0} />
            </Stack>
          </Box>
          <Divider />
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2 }}>
            <Tab label={`Posts (${stats.posts})`} />
            <Tab label="Liked" />
            <Tab label="Commented" />
          </Tabs>
        </Card>

        {postsQ.isLoading ? (
          <FeedSkeleton count={2} />
        ) : tab === 0 ? (
          postsQ.data && postsQ.data.length > 0 ? (
            <Stack spacing={2}>
              <AnimatePresence>
                {postsQ.data.map((p) => (
                  <PostCard key={p.id} post={p} onComment={setActive} />
                ))}
              </AnimatePresence>
            </Stack>
          ) : (
            <EmptyState icon="📭" title="No posts yet" description={isMe ? "Share your first post from the feed." : `@${u.username} hasn't posted yet.`} />
          )
        ) : (
          <EmptyState icon="🚧" title="Coming soon" description="This tab is part of the next release." />
        )}
      </Stack>

      <CommentModal post={activeLive} onClose={() => setActive(null)} />
    </PageTransition>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Box>
      <Typography fontWeight={800}>{value}</Typography>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
    </Box>
  );
}
