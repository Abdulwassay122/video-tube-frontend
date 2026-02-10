"use client";

import { Box, Grid, Skeleton, Stack } from "@mui/material";

export default function VideoPageSkeleton() {
  return (
    <Grid container spacing={2}>
      {/* Left Column: Video + Description + Comments */}
      <Grid size={{ xs: 12, md: 8 }}>
        {/* Video Player Skeleton */}
        <Box sx={{ width: "100%", mb: 2 }}>
          <Skeleton
            variant="rectangular"
            sx={{
              width: "100%",
              height: 0,
              paddingTop: "56.25%", // 16:9 aspect ratio
              borderRadius: 2,
              position: "relative",
            }}
          />
        </Box>

        {/* Title */}
        <Skeleton variant="text" width="70%" height={30} sx={{ mb: 1 }} />

        {/* Creator Info + Subscribe Button */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="40%" height={16} />
          </Box>
          <Skeleton
            variant="rectangular"
            width={100}
            height={30}
            sx={{ borderRadius: "50px" }}
          />
        </Box>

        {/* Likes / Dislikes */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Skeleton
            variant="rectangular"
            width={150}
            height={40}
            sx={{ borderRadius: "50px" }}
          />
        </Box>

        {/* Description */}
        <Box sx={{ backgroundColor: "#f5f5f5", borderRadius: 2, p: 2, mb: 2 }}>
          <Stack spacing={1}>
            <Skeleton variant="text" width="30%" height={20} />
            <Skeleton variant="text" width="90%" height={16} />
            <Skeleton variant="text" width="85%" height={16} />
            <Skeleton variant="text" width="95%" height={16} />
            <Skeleton variant="text" width="80%" height={16} />
          </Stack>
        </Box>

        {/* Comments Section */}
        <Box sx={{ mb: 2 }}>
          <Skeleton variant="text" width="20%" height={25} sx={{ mb: 1 }} />
          {Array.from({ length: 3 }).map((_, i) => (
            <Box key={i} sx={{ display: "flex", gap: 2, mb: 1 }}>
              <Skeleton variant="circular" width={30} height={30} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="40%" height={16} />
                <Skeleton variant="text" width="90%" height={14} />
              </Box>
            </Box>
          ))}
        </Box>
      </Grid>

      {/* Right Column: Related Videos */}
      <Grid size={{ xs: 12, md: 4 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Box key={i} sx={{ display: "flex", gap: 1, mb: 2 }}>
            <Skeleton
              variant="rectangular"
              width={120}
              height={70}
              sx={{ borderRadius: 1 }}
            />
            <Box sx={{ flex: 1 }}>
              <Skeleton
                variant="text"
                width="80%"
                height={18}
                sx={{ mb: 0.5 }}
              />
              <Skeleton variant="text" width="60%" height={14} />
              <Skeleton variant="text" width="50%" height={14} />
            </Box>
          </Box>
        ))}
      </Grid>
    </Grid>
  );
}
