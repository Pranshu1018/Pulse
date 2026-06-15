import { Card, Skeleton, Stack, Box } from "@mui/material";

export function FeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <Stack spacing={2}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} sx={{ p: 2.5 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Skeleton variant="circular" width={44} height={44} />
            <Box sx={{ flex: 1 }}>
              <Skeleton width="40%" />
              <Skeleton width="25%" />
            </Box>
          </Stack>
          <Skeleton sx={{ mt: 2 }} />
          <Skeleton width="80%" />
          <Skeleton variant="rounded" height={180} sx={{ mt: 2, borderRadius: 3 }} />
        </Card>
      ))}
    </Stack>
  );
}

export function ProfileSkeleton() {
  return (
    <Card sx={{ overflow: "hidden" }}>
      <Skeleton variant="rectangular" height={180} />
      <Box sx={{ p: 3 }}>
        <Skeleton variant="circular" width={96} height={96} sx={{ mt: -8, border: "4px solid white" }} />
        <Skeleton width="40%" sx={{ mt: 2 }} />
        <Skeleton width="30%" />
        <Skeleton width="70%" sx={{ mt: 2 }} />
      </Box>
    </Card>
  );
}

export function CommentsSkeleton() {
  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Stack direction="row" spacing={1.5} key={i}>
          <Skeleton variant="circular" width={36} height={36} />
          <Box sx={{ flex: 1 }}>
            <Skeleton width="30%" />
            <Skeleton width="80%" />
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}
