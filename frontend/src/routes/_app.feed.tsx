import { createFileRoute } from "@tanstack/react-router";
import { Box, Stack, Chip, Typography } from "@mui/material";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { CreatePostCard } from "../components/CreatePost/CreatePostCard";
import { PostCard } from "../components/PostCard/PostCard";
import { CommentModal } from "../components/CommentModal/CommentModal";
import { FeedSkeleton } from "../components/Loader/Skeletons";
import { EmptyState } from "../components/EmptyState/EmptyState";
import { PageTransition } from "../components/Motion/PageTransition";
import { listFeed, type EnrichedPost, type FeedFilter } from "../services/posts";

export const Route = createFileRoute("/_app/feed")({
  head: () => ({ meta: [{ title: "Feed · Social Spark" }, { name: "description", content: "Your social feed." }] }),
  component: FeedPage,
});

const FILTERS: { value: FeedFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "for-you", label: "For You" },
  { value: "most-liked", label: "Most Liked" },
  { value: "most-commented", label: "Most Commented" },
];

function FeedPage() {
  const [filter, setFilter] = useState<FeedFilter>("all");
  const [active, setActive] = useState<EnrichedPost | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["feed", filter],
    queryFn: () => listFeed(filter),
  });

  // Keep modal in sync with refetched data
  const activeLive = active && data?.find((p) => p.id === active.id) ? data.find((p) => p.id === active.id)! : active;

  return (
    <PageTransition>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h4" fontWeight={900}>Your Feed</Typography>
          <Typography variant="body2" color="text.secondary">
            Stay in the loop with people you follow and topics you love.
          </Typography>
        </Box>

        <CreatePostCard />

        <Stack direction="row" spacing={1} sx={{ overflowX: "auto", py: 0.5, "&::-webkit-scrollbar": { display: "none" } }}>
          {FILTERS.map((f) => (
            <Chip
              key={f.value}
              label={f.label}
              clickable
              color={filter === f.value ? "primary" : "default"}
              variant={filter === f.value ? "filled" : "outlined"}
              onClick={() => setFilter(f.value)}
              sx={{ borderRadius: 999, fontWeight: 700, flexShrink: 0 }}
            />
          ))}
        </Stack>

        {isLoading ? (
          <FeedSkeleton count={3} />
        ) : !data || data.length === 0 ? (
          <EmptyState
            icon="📰"
            title="No posts yet"
            description="When people you follow share something, it'll appear here."
          />
        ) : (
          <Stack spacing={2}>
            <AnimatePresence initial={false}>
              {data.map((p) => (
                <PostCard key={p.id} post={p} onComment={setActive} />
              ))}
            </AnimatePresence>
          </Stack>
        )}
      </Stack>

      <CommentModal post={activeLive} onClose={() => setActive(null)} />
    </PageTransition>
  );
}
