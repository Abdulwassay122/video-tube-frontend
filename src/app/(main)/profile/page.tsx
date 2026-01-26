"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Avatar, Grid } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";

import VideoCard from "@/components/VideoCard";
import { apiRequest } from "@/utils/apiRequest";
import { useUser } from "@/app/context/UserContext";

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
  videoFile: string;
  thumbnail: string;
  views: number;
  createdAt: string;
  owner: VideoOwner;
}

export interface ProfileData {
  _id: string;
  username: string;
  fullName: string;
  avatar: string;
  coverImage: string;
  subscribersCount: number;
  subscribedToCount: number;
  isSubscribed: boolean;
  videos: Video[];
}

export default function page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const username = searchParams.get("username");
  const { user } = useUser();

  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  const fetchProfile = async () => {
    console.log(username);
    if (!username) return;
    setLoading(true);

    try {
      const res = await apiRequest(
        "GET",
        `${apiUrl}/api/v1/users/profile/${username}/${
          user === null ? "auth" : ""
        }`,
        {},
        router,
      );

      if (res?.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const toggleSubscribe = async () => {
    if (!data) return;
    setSubscribing(true);
    try {
      // Assuming you have subscribe toggle endpoint
      const res = await apiRequest(
        "POST",
        `${apiUrl}/api/v1/subscriptions/c/${data._id}`,
        {},
        router,
      );
      if (res?.success) {
        setData({
          ...data,
          isSubscribed: !data.isSubscribed,
          subscribersCount: data.isSubscribed
            ? data.subscribersCount - 1
            : data.subscribersCount + 1,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) return <Typography>Loading profile...</Typography>;
  if (!data)
    return (
      <Typography className="text-center mt-10">Profile not found</Typography>
    );

  return (
    <Box className="w-full  rounded-xl overflow-hidden ">
      {/* Cover Image */}
      <Box>
        <Box className="relative w-full h-48 md:h-60 bg-gray-200">
          <img
            src={data.coverImage || "/default-cover.jpg"}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </Box>

        {/* Profile Info */}
        <Box className="flex flex-col md:flex-row items-center md:items-end justify-between px-4 md:px-8 py-4 md:py-6 -mt-12">
          <Avatar
            src={data.avatar || "/default-avatar.png"}
            sx={{ width: 100, height: 100, border: "4px solid white" }}
            className="shadow-lg"
          />
          <Box className="flex-1 mt-4 md:mt-0 md:ml-6 text-center md:text-left">
            <Typography variant="h5" className="font-bold text-gray-900">
              {data.fullName}
            </Typography>
            <Typography variant="body2" className="text-gray-500 mt-1">
              @{data.username}
            </Typography>
            <Typography variant="body2" className="text-gray-600 mt-2">
              {data.subscribersCount} Subscribers • {data.subscribedToCount}{" "}
              Subscriptions
            </Typography>
          </Box>
          <Box className="mt-4 md:mt-0">
            <Button
              onClick={toggleSubscribe}
              disabled={subscribing}
              variant={data.isSubscribed ? "outlined" : "contained"}
              sx={{
                borderRadius: "999px",
                backgroundColor: data.isSubscribed ? "white" : "#1976d2",
                color: data.isSubscribed ? "#555" : "white",
                border: data.isSubscribed ? "1px solid #1976d2" : "none",
                px: 4,
                py: 1,
                fontWeight: 600,
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: data.isSubscribed ? "#f0f0f0" : "#1565c0",
                },
              }}
            >
              {data.isSubscribed ? "Subscribed" : "Subscribe"}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Videos Section */}
      <Box className="px-4 md:px-8 pb-6">
        <Typography variant="h6" className="font-semibold mb-4">
          Videos
        </Typography>
        {data.videos.length === 0 ? (
          <Typography className="text-gray-500">No videos yet.</Typography>
        ) : (
          <Grid container spacing={3}>
            {data.videos.map((item, i) => (
              <Grid size={{ md: 4, sm: 6, xs: 12 }} key={i}>
                <VideoCard
                  id={item._id}
                  thumbnail={item.thumbnail}
                  avatar={item.owner.avatar}
                  fullName={item.owner.fullName}
                  views={item.views}
                  createdAt={item.createdAt}
                  title={item.title}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
