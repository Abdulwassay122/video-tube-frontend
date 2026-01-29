"use client";

import { useUser } from "@/app/context/UserContext";
import NotAuthenticated from "@/components/NotAuthenticated";
import { Box } from "@mui/material";
import { useState } from "react";
import { apiRequest } from "@/utils/apiRequest";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import VideoUpload from "@/components/Studio/VideoUpload";
import StVideoCard from "@/components/Studio/StVideoCard";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Page() {
  const { user } = useUser();

  if (user === null) return <NotAuthenticated />;
  return (
    <Box>
      <VideoUpload />
      <StVideoCard />
    </Box>
  );
}
