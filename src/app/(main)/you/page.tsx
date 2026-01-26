"use client";

import React, { useEffect, useState } from "react";
import { Box, Avatar, Typography, Grid, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";

import { useUser } from "@/app/context/UserContext";
import NotAuthenticated from "@/components/NotAuthenticated";
import VideoCard from "@/components/VideoCard";
import { apiRequest } from "@/utils/apiRequest";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface VideoOwner {
  _id: string;
  username: string;
  fullName: string;
  avatar: string;
}

interface Video {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  views: number;
  createdAt: string;
  owner: VideoOwner;
}

interface UserDetail {
  _id: string;
  username: string;
  fullName: string;
  avatar: string;
  coverImage: string;
  watchHistory: Video[];
}

export default function UserHistory() {
  const { user } = useUser();
  const router = useRouter();

  const [userData, setUserData] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUserDetail = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("GET", `${apiUrl}/api/v1/users/user-detail`);
      if (res?.success) setUserData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchUserDetail();
  }, [user]);

  if (!user)
    return <NotAuthenticated message="Login to see your watch history." />;

  if (loading) return <CircularProgress className="mx-auto mt-10" />;

  return (
    <Box className="px-4 md:px-8 mt-6">
      {/* User Info */}
      <Box
        className="flex items-center gap-4 mb-6 cursor-pointer"
        onClick={() => router.push(`/profile?username=${userData?.username}`)}
      >
        <Avatar src={userData?.avatar} sx={{ width: 120, height: 120 }} />
        <Box>
          <Typography variant="h6" sx={{fontWeight:700, fontSize:"30px"}}>
            {userData?.fullName}
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            @{userData?.username}
          </Typography>
        </Box>
      </Box>

      {/* Watch History */}
      <Typography variant="h6" sx={{fontWeight:600, fontSize:"20px"}}>
        Watch History
      </Typography>

      {userData?.watchHistory.length === 0 ? (
        <Typography className="text-gray-500">
          You haven't watched any videos yet.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {userData?.watchHistory.map((video, i) => (
            <Grid size={4} key={i}>
              <VideoCard
                id={video._id}
                thumbnail={video.thumbnail}
                avatar={video.owner.avatar}
                fullName={video.owner.fullName}
                views={video.views}
                createdAt={video.createdAt}
                title={video.title}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
