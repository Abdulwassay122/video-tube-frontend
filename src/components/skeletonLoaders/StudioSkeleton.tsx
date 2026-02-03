"use client";

import { Box, Skeleton } from "@mui/material";

export default function StudioSkeleton() {
  return (
    <div className="p-4 md:p-8">
      {/* Profile Card */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          bgcolor: "background.paper",
        }}
      >
        {/* Avatar */}
        <Skeleton
          variant="circular"
          width={180}
          height={180}
          sx={{ border: "4px solid #1976d2" }}
        />

        {/* User Info */}
        <Box
          sx={{
            flex: 1,
            mt: { xs: 3, md: 0 },
            ml: { md: 4 },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Skeleton width={260} height={36} />
          <Skeleton width={160} height={20} />
          <Skeleton width={320} height={18} />
        </Box>
      </Box>

      {/* Navigation Tabs */}
      <Box sx={{ display: "flex", gap: 6, mb: 3 }}>
        <Skeleton width={120} height={32} />
        <Skeleton width={140} height={32} />
      </Box>

      {/* List Skeleton */}
      <BoxSkeleton />
    </div>
  );
}

export function BoxSkeleton() {
  return (
    <Box sx={{ mt: 2 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Box
          key={i}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            py: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Skeleton variant="circular" width={48} height={48} />
          <Box sx={{ flex: 1 }}>
            <Skeleton width="40%" height={20} />
            <Skeleton width="25%" height={16} />
          </Box>
          <Skeleton width={90} height={32} sx={{ borderRadius: "999px" }} />
        </Box>
      ))}
    </Box>
  );
}
