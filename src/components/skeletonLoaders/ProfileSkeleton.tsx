"use client";

import { Box, Grid, Skeleton } from "@mui/material";
import VideoCardSkeleton from "./VideoCardSkeleton";

export default function ProfileSkeleton() {
  return (
    <Box className="w-full rounded-xl overflow-hidden">
      {/* Cover Image */}
      <Skeleton
        variant="rectangular"
        sx={{
          width: "100%",
          height: { xs: 192, md: 240 },
        }}
      />

      {/* Profile Info */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "center", md: "flex-end" },
          justifyContent: "space-between",
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 4 },
          mt: "-48px",
          gap: 3,
        }}
      >
        {/* Avatar */}
        <Skeleton
          variant="circular"
          width={100}
          height={100}
          sx={{ border: "4px solid white" }}
        />

        {/* User Info */}
        <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
          <Skeleton width={220} height={32} />
          <Skeleton width={140} height={20} />
          <Skeleton width={260} height={18} />
        </Box>

        {/* Subscribe Button */}
        <Skeleton
          variant="rounded"
          width={140}
          height={40}
          sx={{ borderRadius: "999px" }}
        />
      </Box>

      {/* Videos */}
      <Box sx={{ px: { xs: 2, md: 4 }, pb: 4 }}>
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid size={{ md: 4, sm: 6, xs: 12 }} key={i}>
              <VideoCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
