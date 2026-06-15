import { IconButton, Box } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type Props = { liked: boolean; count: number; onToggle: () => void };

export function LikeButton({ liked, count, onToggle }: Props) {
  const [burst, setBurst] = useState(0);

  const handle = () => {
    if (!liked) setBurst((b) => b + 1);
    onToggle();
  };

  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, position: "relative" }}>
      <IconButton onClick={handle} size="small" sx={{ color: liked ? "error.main" : "text.secondary" }}>
        <motion.span
          key={String(liked)}
          initial={{ scale: 0.8 }}
          animate={{ scale: liked ? [1, 1.4, 1] : 1 }}
          transition={{ duration: 0.35 }}
          style={{ display: "inline-flex" }}
        >
          {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </motion.span>

        <AnimatePresence>
          {burst > 0 && (
            <motion.span
              key={burst}
              initial={{ opacity: 1, scale: 0.4 }}
              animate={{ opacity: 0, scale: 2.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              onAnimationComplete={() => setBurst(0)}
              style={{
                position: "absolute",
                inset: 0,
                margin: "auto",
                width: 30,
                height: 30,
                borderRadius: "50%",
                border: "2px solid rgba(239,68,68,0.6)",
                pointerEvents: "none",
              }}
            />
          )}
        </AnimatePresence>
      </IconButton>
      <Box component="span" sx={{ fontSize: 14, fontWeight: 600, color: "text.secondary", minWidth: 16 }}>
        {count}
      </Box>
    </Box>
  );
}
