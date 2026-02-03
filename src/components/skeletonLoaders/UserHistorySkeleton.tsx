"use client";

import { Box, Grid, Skeleton } from "@mui/material";
import VideoCardSkeleton from "./VideoCardSkeleton";

export default function UserHistorySkeleton() {
  return (
    <Box className="sm:px-4 mt-6">
      {/* User Info Skeleton */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          gap: 2,
          mb: 4,
        }}
      >
        <Skeleton variant="circular" width={120} height={120} />

        <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
          <Skeleton width={180} height={34} />
          <Skeleton width={120} height={20} />
        </Box>
      </Box>

      {/* Section Title */}
      <Skeleton width={160} height={32} sx={{ mb: 2 }} />

      {/* Video Grid Skeleton */}
      <Grid container spacing={2}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Grid size={{ md: 4, sm: 6, xs: 12 }} key={i}>
            <VideoCardSkeleton />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

