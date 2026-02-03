"use client";
import { Box, Skeleton } from "@mui/material";

export default function VideoCardSkeleton() {
  return (
    <Box>
      {/* 16:9 Wrapper */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%", // 16:9
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{
            height: "100%",
            position: "absolute",
            inset: 0,
          }}
        />
      </Box>

      {/* Content */}
      <Box sx={{ display: "flex", mt: 1.5, gap: 1.5 }}>
        <Skeleton variant="circular" width={40} height={40} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="90%" height={24} />
          <Skeleton variant="text" width="60%" height={18} />
        </Box>
      </Box>
    </Box>
  );
}
