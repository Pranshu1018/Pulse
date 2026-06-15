import { Box, Stack, Typography, Button } from "@mui/material";
import type { ReactNode } from "react";

type Props = {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon, title, description, actionLabel, onAction }: Props) {
  return (
    <Stack alignItems="center" spacing={2} sx={{ py: 6, px: 3, textAlign: "center" }}>
      <Box
        sx={{
          width: 96,
          height: 96,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          bgcolor: "action.hover",
          color: "primary.main",
          fontSize: 44,
        }}
      >
        {icon ?? "✨"}
      </Box>
      <Typography variant="h6" fontWeight={800}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
          {description}
        </Typography>
      )}
      {actionLabel && (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Stack>
  );
}
