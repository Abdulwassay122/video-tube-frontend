"use client";

import React, { useEffect, useState } from "react";
import { Box, Grid, Button, Typography, CircularProgress } from "@mui/material";
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
  thumbnail: string;
  title: string;
  views: number;
  createdAt: string;
  owner: VideoOwner;
}

interface SubscriptionResponse {
  videos: Video[];
  page: number;
  limit: number;
  totalPages: number;
  totalVideos: number;
}

export default function SubscribedVideos() {
  const { user } = useUser();
  const router = useRouter();

  const [videos, setVideos] = useState<Video[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchSubscribedVideos = async (pageNo = 1) => {
    setLoading(true);
    try {
      const res = await apiRequest(
        "GET",
        `${apiUrl}/api/v1/videos/subscriprtion?page=${pageNo}&limit=10`,
        {},
        router
      );

      if (res?.success) {
        setVideos((prev) =>
          pageNo === 1 ? res.data.videos : [...prev, ...res.data.videos]
        );
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchSubscribedVideos(1);
  }, [user]);

  /* 🔐 Not authenticated */
  if (!user) {
    return (
      <NotAuthenticated message="Login to see videos from channels you subscribe to." />
    );
  }

  return (
    <Box className="">
      {/* Header */}
      <Typography variant="h6" className="font-semibold mb-4">
        Subscriptions
      </Typography>

      {/* Empty State */}
      {!loading && videos.length === 0 && (
        <Typography className="text-gray-500">
          No videos from your subscriptions yet.
        </Typography>
      )}

      {/* Videos */}
      <Grid container spacing={2}>
        {videos.map((video, i) => (
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

      {/* Loading */}
      {loading && (
        <Box className="flex justify-center mt-6">
          <CircularProgress />
        </Box>
      )}

      {/* Load More */}
      {!loading && page < totalPages && (
        <Box className="flex justify-center mt-6">
          <Button
            variant="outlined"
            onClick={() => {
              const nextPage = page + 1;
              setPage(nextPage);
              fetchSubscribedVideos(nextPage);
            }}
          >
            Load more
          </Button>
        </Box>
      )}
    </Box>
  );
}
