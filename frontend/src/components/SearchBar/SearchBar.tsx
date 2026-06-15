import {
  Box, InputBase, Paper, Popper, ClickAwayListener, Stack, Typography, ListItemButton, Tabs, Tab,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { searchUsers } from "../../services/users";
import { searchPosts } from "../../services/posts";
import { UserAvatar } from "../UserAvatar/UserAvatar";

export function SearchBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"users" | "posts">("users");
  const navigate = useNavigate();
  const debounced = useDebouncedValue(q, 250);

  const usersQ = useQuery({
    queryKey: ["search", "users", debounced],
    queryFn: () => searchUsers(debounced),
    enabled: open && debounced.length > 0,
  });
  const postsQ = useQuery({
    queryKey: ["search", "posts", debounced],
    queryFn: () => searchPosts(debounced),
    enabled: open && debounced.length > 0,
  });

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ position: "relative", width: "100%", maxWidth: 480 }}>
        <Paper
          ref={ref}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            py: 0.5,
            borderRadius: 999,
            bgcolor: "action.hover",
            border: "1px solid transparent",
            "&:focus-within": { borderColor: "primary.main", bgcolor: "background.paper" },
          }}
        >
          <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
          <InputBase
            placeholder="Search people, posts…"
            value={q}
            onChange={(e) => { setQ(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { navigate(`/search?q=${q}`); setOpen(false); }
            }}
            sx={{ flex: 1, fontSize: 14 }}
          />
        </Paper>

        <Popper open={open && !!debounced} anchorEl={ref.current} placement="bottom-start" sx={{ zIndex: 1300, width: ref.current?.clientWidth }}>
          <Paper sx={{ mt: 1, borderRadius: 3, overflow: "hidden", boxShadow: 8, border: "1px solid", borderColor: "divider" }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth">
              <Tab value="users" label={`People (${usersQ.data?.length ?? 0})`} />
              <Tab value="posts" label={`Posts (${postsQ.data?.length ?? 0})`} />
            </Tabs>
            <Box sx={{ maxHeight: 320, overflow: "auto" }}>
              {tab === "users" && (usersQ.data?.length ? usersQ.data.map((u) => (
                <ListItemButton key={u.id} onClick={() => { navigate(`/profile/${u.username}`); setOpen(false); }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <UserAvatar src={u.avatar} name={u.name} size={36} />
                    <Box>
                      <Typography fontWeight={700}>{u.name}</Typography>
                      <Typography variant="caption" color="text.secondary">@{u.username}</Typography>
                    </Box>
                  </Stack>
                </ListItemButton>
              )) : <Typography sx={{ p: 2 }} color="text.secondary" variant="body2">No people found.</Typography>)}

              {tab === "posts" && (postsQ.data?.length ? postsQ.data.map((p) => (
                <ListItemButton key={p.id} onClick={() => { navigate("/feed"); setOpen(false); }}>
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <UserAvatar src={p.author.avatar} name={p.author.name} size={32} />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="caption" color="text.secondary">@{p.author.username}</Typography>
                      <Typography variant="body2" sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {p.text}
                      </Typography>
                    </Box>
                  </Stack>
                </ListItemButton>
              )) : <Typography sx={{ p: 2 }} color="text.secondary" variant="body2">No posts found.</Typography>)}
            </Box>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}
