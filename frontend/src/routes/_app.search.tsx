import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Box, Stack, Tabs, Tab, TextField, Typography, Card, ListItemButton, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { z } from "zod";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { searchUsers } from "../services/users";
import { searchPosts } from "../services/posts";
import { UserAvatar } from "../components/UserAvatar/UserAvatar";
import { EmptyState } from "../components/EmptyState/EmptyState";
import { FeedSkeleton } from "../components/Loader/Skeletons";
import { PageTransition } from "../components/Motion/PageTransition";

const searchSchema = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/_app/search")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Search · Pulse" }] }),
  component: SearchPage,
});

function SearchPage() {
  const { q: initial } = Route.useSearch();
  const [q, setQ] = useState(initial ?? "");
  const debounced = useDebouncedValue(q, 250);
  const [tab, setTab] = useState(0);

  const usersQ = useQuery({
    queryKey: ["search", "users", debounced],
    queryFn: () => searchUsers(debounced),
    enabled: !!debounced,
  });
  const postsQ = useQuery({
    queryKey: ["search", "posts", debounced],
    queryFn: () => searchPosts(debounced),
    enabled: !!debounced,
  });

  return (
    <PageTransition>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h4" fontWeight={900}>Search</Typography>
          <Typography variant="body2" color="text.secondary">Find people and posts on Pulse.</Typography>
        </Box>

        <TextField
          placeholder="Search people, posts…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
            sx: { borderRadius: 999, bgcolor: "background.paper" },
          }}
        />

        <Card>
          <Tabs value={tab} onChange={(_, v) => setTab(v)}>
            <Tab label={`People (${usersQ.data?.length ?? 0})`} />
            <Tab label={`Posts (${postsQ.data?.length ?? 0})`} />
          </Tabs>
        </Card>

        {!debounced ? (
          <EmptyState icon="🔍" title="Search Pulse" description="Try searching for someone like “Aria” or a topic like “design”." />
        ) : tab === 0 ? (
          usersQ.isLoading ? (
            <FeedSkeleton count={2} />
          ) : usersQ.data && usersQ.data.length > 0 ? (
            <Card>
              {usersQ.data.map((u, i) => (
                <Link key={u.id} to="/profile/$username" params={{ username: u.username }} style={{ textDecoration: "none", color: "inherit" }}>
                  <ListItemButton sx={{ borderTop: i > 0 ? "1px solid" : "none", borderColor: "divider", py: 1.5 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                      <UserAvatar src={u.avatar} name={u.name} size={44} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography fontWeight={700}>{u.name}</Typography>
                        <Typography variant="caption" color="text.secondary">@{u.username}</Typography>
                      </Box>
                      <Button variant="outlined" size="small">Follow</Button>
                    </Stack>
                  </ListItemButton>
                </Link>
              ))}
            </Card>
          ) : (
            <EmptyState icon="🙃" title="No people found" description={`We couldn't find anyone matching “${debounced}”.`} />
          )
        ) : postsQ.isLoading ? (
          <FeedSkeleton count={2} />
        ) : postsQ.data && postsQ.data.length > 0 ? (
          <Stack spacing={1.5}>
            {postsQ.data.map((p) => (
              <Card key={p.id} sx={{ p: 2 }}>
                <Stack direction="row" spacing={1.5}>
                  <UserAvatar src={p.author.avatar} name={p.author.name} size={36} />
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography fontWeight={700} variant="body2">{p.author.name} <Typography component="span" variant="caption" color="text.secondary">@{p.author.username}</Typography></Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>{p.text}</Typography>
                  </Box>
                </Stack>
              </Card>
            ))}
          </Stack>
        ) : (
          <EmptyState icon="📭" title="No posts found" description={`Nothing matches “${debounced}” yet.`} />
        )}
      </Stack>
    </PageTransition>
  );
}
