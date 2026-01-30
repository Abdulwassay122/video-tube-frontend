"use client";

import { useUser } from "@/app/context/UserContext";
import NotAuthenticated from "@/components/NotAuthenticated";
import { Box } from "@mui/material";
import VideoUpload from "@/components/Studio/VideoUpload";
import StVideoCard from "@/components/Studio/StVideoCard";

export default function Page() {
  const { user } = useUser();

  if (user === null) return <NotAuthenticated />;
  if (user === undefined) return null;
  return (
    <Box>
      <VideoUpload />
      <StVideoCard />
    </Box>
  );
}
