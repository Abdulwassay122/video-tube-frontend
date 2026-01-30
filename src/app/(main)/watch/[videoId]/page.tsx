"use client";
import React from "react";
import { apiRequest } from "@/utils/apiRequest";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Collapse,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Plyr } from "plyr-react";
import "plyr-react/plyr.css";
import Image from "next/image";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { timeAgo } from "@/utils/format";
import CommentSection from "@/components/Comments";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import VideoCardHoriontal from "@/components/VideoCardHorizontal";
import { useUser } from "@/app/context/UserContext";
import Link from "next/link";
import VideoCard from "@/components/VideoCard";

type video = {
  _id: string;
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  likesCount: number;
  isLiked: boolean;
  owner: {
    _id: string;
    username: string;
    email: string;
    fullName: string;
    avatar: string;
    coverImage: string;
    createdAt: string;
    updatedAt: string;
    subscribersCount: number;
    isSubscribed: boolean;
  };
  createdAt: string;
  updatedAt: string;
};

export function formatSubscribers(count: number): string {
  if (count < 1000) return count.toString();
  if (count < 1_000_000)
    return `${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 1)}K`;
  if (count < 1_000_000_000)
    return `${(count / 1_000_000).toFixed(count % 1_000_000 === 0 ? 0 : 1)}M`;
  return `${(count / 1_000_000_000).toFixed(count % 1_000_000_000 === 0 ? 0 : 1)}B`;
}

export default function page({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const { user } = useUser();

  const { videoId } = React.use(params);

  const isMobile = useMediaQuery("(max-width:500px)");

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<video>();
  const [videoData, setVideoData] = useState<any[]>();
  const [error, setError] = useState<string>("");
  const [expanded, setExpanded] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(!isMobile); // toggle for small screen
  const isLong = (data?.description ?? "").length > 200;

  const fetchApi = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiRequest(
        "GET",
        `${apiUrl}/api/v1/videos/${videoId}/${user !== null ? "" : "unauth"}`,
        {},
        router,
      );
      setData(response.data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  async function toggleSubscribe() {
    const res = await apiRequest(
      "POST",
      `${apiUrl}/api/v1/subscriptions/c/${data?.owner._id}`,
      {},
      router,
    );

    if (res?.success) {
      setData(
        (prev) =>
          prev && {
            ...prev,
            owner: { ...prev.owner, isSubscribed: !prev.owner.isSubscribed },
          },
      );
    }
  }

  const fetchApiVideos = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiRequest(
        "GET",
        `${apiUrl}/api/v1/videos`,
        {},
        router,
      );
      setVideoData(
        response.data.videos.filter((video: any) => video._id !== videoId),
      );
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  async function toggleLike() {
    const res = await apiRequest(
      "POST",
      `${apiUrl}/api/v1/likes/toggle/v/${videoId}`,
      {},
      router,
    );

    if (res?.success) {
      setData((prev) => prev && { ...prev, isLiked: !prev.isLiked });
    }
  }

  useEffect(() => {
    fetchApi();
    fetchApiVideos();
  }, [videoId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Grid container spacing={2}>
      {/* Video + Description + Comments */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Card
          variant="outlined"
          sx={{
            backgroundColor: "transparent",
            boxShadow: "none",
            border: "none",
            padding: 0,
          }}
        >
          <Box
            sx={{
              width: "100%",
              aspectRatio: "16 / 9",
              backgroundColor: "#000",
              overflow: "hidden",
              "& .plyr": { height: "100%" },
              "& video": { objectFit: "cover" },
            }}
          >
            <Plyr
              source={{
                type: "video",
                sources: [{ src: data?.videoFile || "", type: "video/mp4" }],
                poster: data?.thumbnail || "",
              }}
              options={{
                controls: [
                  "play-large",
                  "play",
                  "progress",
                  "current-time",
                  "mute",
                  "volume",
                  "settings",
                  "fullscreen",
                  "rewind",
                  "fast-forward",
                ],
                keyboard: { focused: true, global: true },
              }}
            />
          </Box>

          <CardContent
            sx={{ padding: 0, pb: 0, pt: "10px", "&:last-child": { pb: 0 } }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, marginBottom: "10px" }}
            >
              {data?.title}
            </Typography>

            <Box className="flex flex-col md:flex-row justify-between gap-2">
              <Box className="flex gap-2 items-center">
                <Link
                  className="flex gap-3 cursor-pointer"
                  href={`/profile/${encodeURIComponent(data?.owner.username || "")}`}
                >
                  <Image
                    className="h-10 w-10 rounded-full"
                    alt={data?.owner.username || ""}
                    height={30}
                    width={30}
                    src={data?.owner.avatar || ""}
                  />
                  <Box>
                    <Typography sx={{ fontSize: "15px", fontWeight: 600 }}>
                      {data?.owner.fullName.slice(0, 100)}
                    </Typography>
                    <Typography
                      sx={{ fontSize: "13px" }}
                      className="text-gray-400"
                    >
                      {formatSubscribers(data?.owner.subscribersCount || 0)}{" "}
                      subscribers
                    </Typography>
                  </Box>
                </Link>
                <Box className="ml-0 md:ml-4">
                  <Button
                    onClick={toggleSubscribe}
                    variant="contained"
                    sx={{
                      borderRadius: "100px",
                      boxShadow: "none",
                      background: data?.owner.isSubscribed
                        ? "white"
                        : undefined,
                      color: data?.owner.isSubscribed ? "gray" : undefined,
                    }}
                  >
                    {data?.owner.isSubscribed ? "Unsubscribe" : "Subscribe"}
                  </Button>
                </Box>
              </Box>

              <Box className="flex gap-2">
                <Box className="flex gap-2 h-fit bg-white rounded-full py-2 px-4">
                  <Button onClick={toggleLike} sx={{ padding: 0, margin: 0 }}>
                    {data?.isLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                  </Button>
                  <span>{formatSubscribers(data?.likesCount || 0)}</span>
                  <span className="border-l"></span>
                  <Button sx={{ padding: 0, margin: 0 }}>
                    <ThumbDownOffAltOutlinedIcon />
                  </Button>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Description */}
        <Box
          sx={{
            background: "white",
            borderRadius: "10px",
            marginTop: "20px",
            padding: "10px",
          }}
        >
          <p className="font-bold text-[14px]">
            {formatSubscribers(data?.views || 0)} views{" "}
            {timeAgo(data?.createdAt || "")}
          </p>

          <p className="text-gray-900">
            {expanded || !isLong
              ? data?.description
              : data?.description.slice(0, 200) + "..."}
          </p>

          {isLong && (
            <Button
              size="small"
              sx={{ mt: 1, p: 0, textTransform: "none" }}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Show less" : "More"}
            </Button>
          )}
        </Box>

        {/* Comment Section with collapse on small screen */}
        <Box sx={{ marginTop: "20px" }}>
          <Box className="flex justify-between md:hidden items-center mb-1">
            <Typography variant="subtitle1">Comments</Typography>
            <IconButton
              size="small"
              onClick={() => setCommentsOpen(!commentsOpen)}
            >
              {commentsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>

          <Collapse
            in={commentsOpen}
            orientation="vertical"
            timeout={300}
            sx={{ width: "100%" }}
          >
            <CommentSection videoId={videoId || ""} />
          </Collapse>
        </Box>
      </Grid>

      {/* Related Videos */}
      <Grid size={{ xs: 12, md: 4 }}>
        {videoData?.length ? (
          videoData.map((item: any) =>
            isMobile ? (
              <VideoCard
                key={item._id}
                id={item._id}
                thumbnail={item.thumbnail}
                title={item.title}
                views={item.views}
                createdAt={item.createdAt}
                avatar={item.owner.avatar}
                fullName={item.owner.fullName}
              />
            ) : (
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
            ),
          )
        ) : (
          <div className="font-semibold text-[16px] text-center mt-5">
            No Related Videos
          </div>
        )}
      </Grid>
    </Grid>
  );
}
