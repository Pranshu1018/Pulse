import {
  Dialog, DialogTitle, DialogContent, IconButton, Stack, Box, TextField, Button, Typography, Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { UserAvatar } from "../UserAvatar/UserAvatar";
import { useAuth } from "../../context/AuthContext";
import { addComment, type EnrichedPost } from "../../services/posts";
import { mockDb } from "../../services/mockDb";
import { timeAgo } from "../../utils/formatDate";
import { EmptyState } from "../EmptyState/EmptyState";

type Props = { post: EnrichedPost | null; onClose: () => void };

export function CommentModal({ post, onClose }: Props) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [text, setText] = useState("");

  const mut = useMutation({
    mutationFn: () => addComment(post!.id, user!.id, text.trim()),
    onSuccess: () => {
      setText("");
      qc.invalidateQueries({ queryKey: ["feed"] });
      qc.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });

  return (
    <Dialog
      open={!!post}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}
    >
      <DialogTitle sx={{ pr: 6, fontWeight: 800 }}>
        Comments
        <IconButton onClick={onClose} sx={{ position: "absolute", right: 12, top: 12 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column", minHeight: 360 }}>
        <Box sx={{ flex: 1, overflow: "auto", p: 2, maxHeight: "55vh" }}>
          {post && post.comments.length === 0 && (
            <EmptyState
              icon="💬"
              title="No comments yet"
              description="Be the first to start the conversation."
            />
          )}
          <Stack spacing={2}>
            <AnimatePresence initial={false}>
              {post?.comments
                .slice()
                .sort((a, b) => a.createdAt - b.createdAt)
                .map((c) => {
                  const a = mockDb.users.find((u) => u.id === c.authorId);
                  return (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Stack direction="row" spacing={1.5}>
                        <UserAvatar src={a?.avatar} name={a?.name} size={36} />
                        <Box
                          sx={{
                            flex: 1,
                            bgcolor: "action.hover",
                            borderRadius: 3,
                            px: 1.5,
                            py: 1,
                          }}
                        >
                          <Stack direction="row" alignItems="baseline" spacing={1}>
                            <Typography variant="subtitle2" fontWeight={700}>
                              {a?.name ?? "Unknown"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              @{a?.username} · {timeAgo(c.createdAt)}
                            </Typography>
                          </Stack>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {c.text}
                          </Typography>
                        </Box>
                      </Stack>
                    </motion.div>
                  );
                })}
            </AnimatePresence>
          </Stack>
        </Box>
        <Divider />
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ p: 1.5, bgcolor: "background.paper" }}
        >
          <UserAvatar src={user?.avatar} name={user?.name} size={36} />
          <TextField
            placeholder="Write a comment…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && text.trim()) {
                e.preventDefault();
                mut.mutate();
              }
            }}
            size="small"
            InputProps={{ sx: { borderRadius: 999, bgcolor: "action.hover" } }}
          />
          <IconButton
            color="primary"
            disabled={!text.trim() || mut.isPending}
            onClick={() => mut.mutate()}
          >
            <SendRoundedIcon />
          </IconButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
