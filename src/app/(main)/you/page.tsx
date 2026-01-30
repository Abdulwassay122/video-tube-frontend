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
  const [history, setHistory] = useState<any[]>([]);
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
  const getWatchHistory = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("GET", `${apiUrl}/api/v1/users/history`);
      if (res?.success) setHistory(res.data);
      console.log(history);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchUserDetail();
    if (user) getWatchHistory();
  }, [user]);

  if (!user)
    return <NotAuthenticated message="Login to see your watch history." />;

  if (loading) return "Loading...";

  return (
    <Box className="sm:px-4 mt-6">
      {/* User Info */}
      <Box
        className="flex flex-col sm:flex-row sm:text-left text-center items-center gap-4 mb-6 cursor-pointer"
        onClick={() =>
          router.push(`/profile/${encodeURIComponent(user.username)}`)
        }
      >
        <Avatar src={userData?.avatar} sx={{ width: 120, height: 120 }} />
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, fontSize: { xs: "20px", sm: "30px" } }}
          >
            {userData?.fullName}
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            @{userData?.username}
          </Typography>
        </Box>
      </Box>

      {/* Watch History */}
      <Typography
        variant="h6"
        className="sm:text-left text-center"
        sx={{ fontWeight: 600, fontSize: "20px" }}
      >
        Watch History
      </Typography>

      {history?.length === 0 ? (
        <Typography className="text-gray-500">
          You haven't watched any videos yet.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {history.map((ele, i) => (
            <Grid size={{ md: 4, sm: 6, xs: 12 }} key={i}>
              <VideoCard
                id={ele._id}
                thumbnail={ele.thumbnail}
                avatar={ele.owner.avatar}
                fullName={ele.owner.fullName}
                views={ele.views}
                createdAt={ele.createdAt}
                title={ele.title}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
