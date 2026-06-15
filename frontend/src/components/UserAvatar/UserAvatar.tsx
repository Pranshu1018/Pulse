import { Avatar, Badge, Box } from "@mui/material";

type Props = {
  src?: string;
  name?: string;
  size?: number;
  ring?: boolean;
  online?: boolean;
};

export function UserAvatar({ src, name, size = 40, ring, online }: Props) {
  const av = (
    <Avatar
      src={src}
      alt={name}
      sx={{
        width: size,
        height: size,
        fontWeight: 700,
        bgcolor: "primary.light",
        color: "primary.contrastText",
        boxShadow: ring
          ? "0 0 0 2px var(--mui-palette-background-paper), 0 0 0 4px var(--mui-palette-primary-main)"
          : "none",
      }}
    >
      {name?.[0]?.toUpperCase()}
    </Avatar>
  );
  if (!online) return <Box sx={{ display: "inline-flex" }}>{av}</Box>;
  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      variant="dot"
      sx={{
        "& .MuiBadge-dot": {
          bgcolor: "success.main",
          boxShadow: "0 0 0 2px var(--mui-palette-background-paper)",
          width: 10,
          height: 10,
          borderRadius: "50%",
        },
      }}
    >
      {av}
    </Badge>
  );
}
