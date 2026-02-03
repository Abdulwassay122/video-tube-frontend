import { Grid, Skeleton } from "@mui/material";
import VideoCardSkeleton from "./VideoCardSkeleton";

function VideoGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid size={{ md: 4, sm: 6, xs: 12 }} key={i}>
          <VideoCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}

export default VideoGridSkeleton;
