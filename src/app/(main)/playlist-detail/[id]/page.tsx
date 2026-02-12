"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/utils/apiRequest";
import { Grid, Typography, Box } from "@mui/material";
import VideoCardHoriontal from "@/components/VideoCardHorizontal";

type PlaylistVideo = {
  _id: string;
  thumbnail: string;
  title: string;
  description: string;
  views: number;
  createdAt: string;
  owner: {
    avatar: string;
    fullName: string;
  };
};

type Playlist = {
  _id: string;
  name: string;
  description: string;
  videos: PlaylistVideo[];
};

export default function PlaylistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlaylist = async () => {
      setLoading(true);
      try {
        const res = await apiRequest("GET", `${apiUrl}/api/v1/playlist/${id}`);
        if (res.success && res.data.length > 0) {
          setPlaylist(res.data[0]); // API returns an array
        } else {
          setError("Playlist not found");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!playlist) return <div>No playlist data</div>;

  return (
    <Box sx={{ padding: 2 }}>
      {/* Playlist Info */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          {playlist.name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {playlist.description || "No description"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {playlist.videos.length} videos
        </Typography>
      </Box>

      {/* Videos */}
      <Grid container spacing={2}>
        {playlist.videos.length > 0 ? (
          playlist.videos.map((item) => (
            <Grid size={{ xs: 12 }} key={item._id}>
              <VideoCardHoriontal
                key={item._id}
                id={item._id}
                thumbnail={item.thumbnail}
                avatar={item.owner.avatar}
                fullName={item.owner.fullName}
                views={item.views}
                createdAt={item.createdAt}
                title={item.title}
              />
            </Grid>
          ))
        ) : (
          <Typography>No videos in this playlist</Typography>
        )}
      </Grid>
    </Box>
  );
}
