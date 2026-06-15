import {
  Card, CardContent, Stack, Box, Typography, IconButton, Chip, Menu, MenuItem, Button,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserAvatar } from "../UserAvatar/UserAvatar";
import { LikeButton } from "./LikeButton";
import { timeAgo } from "../../utils/formatDate";
import { useAuth } from "../../context/AuthContext";
import { useNotify } from "../../app/SnackbarProvider";
import { deletePost, toggleLike, type EnrichedPost } from "../../services/posts";

type Props = { post: EnrichedPost; onComment: (post: EnrichedPost) => void };

export function PostCard({ post, onComment }: Props) {
  const { user } = useAuth();
  const notify = useNotify();
  const qc = useQueryClient();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const isMine = user?.id === post.author.id;
  const liked = !!user && post.likes.includes(user.id);

  const likeMut = useMutation({
    mutationFn: () => toggleLike(post.id, user!.id),
    onMutate: () => {
      qc.setQueriesData<EnrichedPost[]>({ queryKey: ["feed"] }, (old) =>
        old?.map((p) =>
          p.id === post.id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((i) => i !== user!.id)
                  : [...p.likes, user!.id],
              }
            : p,
        ),
      );
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["feed"] });
      qc.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });

  const delMut = useMutation({
    mutationFn: () => deletePost(post.id),
    onSuccess: () => {
      notify("Post deleted", "success");
      qc.invalidateQueries({ queryKey: ["feed"] });
      qc.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Card
        sx={{
          transition: "box-shadow .2s, transform .2s",
          "&:hover": { boxShadow: "0 12px 30px -12px rgba(46,91,255,0.18)" },
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Link
              to="/profile/$username"
              params={{ username: post.author.username }}
              style={{ textDecoration: "none" }}
            >
              <UserAvatar src={post.author.avatar} name={post.author.name} size={44} />
            </Link>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
                <Link
                  to="/profile/$username"
                  params={{ username: post.author.username }}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1.2 }}>
                    {post.author.name}
                  </Typography>
                </Link>
                {post.author.badge && (
                  <Chip
                    size="small"
                    label={`👑 ${post.author.badge}`}
                    sx={{
                      bgcolor: "warning.light",
                      color: "warning.dark",
                      height: 22,
                      fontSize: 11,
                    }}
                  />
                )}
              </Stack>
              <Typography variant="caption" color="text.secondary">
                @{post.author.username} · {timeAgo(post.createdAt)}
              </Typography>
            </Box>
            <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)}>
              <MoreHorizIcon />
            </IconButton>
            <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
              <MenuItem
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.origin + "/feed#" + post.id);
                  notify("Link copied", "success");
                  setAnchor(null);
                }}
              >
                Copy link
              </MenuItem>
              <MenuItem onClick={() => { notify("Reported. Thanks!", "warning"); setAnchor(null); }}>
                Report
              </MenuItem>
              {isMine && (
                <MenuItem
                  sx={{ color: "error.main" }}
                  onClick={() => { delMut.mutate(); setAnchor(null); }}
                >
                  Delete
                </MenuItem>
              )}
            </Menu>
          </Stack>

          {post.text && (
            <Typography sx={{ mt: 2, whiteSpace: "pre-wrap", lineHeight: 1.55 }}>
              {post.text}
            </Typography>
          )}

          {post.image && (
            <Box
              sx={{
                mt: 2,
                borderRadius: 3,
                overflow: "hidden",
                bgcolor: "action.hover",
                aspectRatio: "16/10",
              }}
            >
              <img
                src={post.image}
                alt=""
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </Box>
          )}

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5 }}>
            <LikeButton
              liked={liked}
              count={post.likes.length}
              onToggle={() => user && likeMut.mutate()}
            />
            <Button
              size="small"
              startIcon={<ChatBubbleOutlineIcon fontSize="small" />}
              color="inherit"
              onClick={() => onComment(post)}
              sx={{ color: "text.secondary", fontWeight: 600 }}
            >
              {post.comments.length}
            </Button>
            <Box sx={{ flex: 1 }} />
            <IconButton
              size="small"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.origin + "/feed#" + post.id);
                notify("Link copied to clipboard", "success");
              }}
            >
              <ShareOutlinedIcon fontSize="small" />
            </IconButton>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
}
