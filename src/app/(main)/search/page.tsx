"use client";
import { useEffect, useRef, useState } from "react";

import { Box, CircularProgress, Grid } from "@mui/material";
import { apiRequest } from "@/utils/apiRequest";
import { useRouter, useSearchParams } from "next/navigation";
import VideoCard from "@/components/VideoCard";
import InfiniteScroll from "react-infinite-scroll-component";

export default function page() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const params = useSearchParams();

  const query = params.get("search");
  console.log("qq", query);

  const fetchVideos = async (pageNumber = 1) => {
    if (!query) return;

    try {
      const res = await apiRequest(
        "GET",
        `${apiUrl}/api/v1/videos?query=${query}&page=${pageNumber}&limit=10`,
        {},
        router,
      );

      const { videos, totalPages } = res.data;

      setData((prev) => (pageNumber === 1 ? videos : [...prev, ...videos]));
      setTotalPages(totalPages);
      setPage(pageNumber);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!query) router.push("/");
    fetchVideos(1);
  }, [query]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (data.length === 0) return <div>No Videos Found</div>;

  return (
    <>
      <InfiniteScroll
        dataLength={data.length}
        next={() => fetchVideos(page + 1)}
        hasMore={page < totalPages}
        loader={
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress />
          </Box>
        }
      >
        <Grid container spacing={2}>
          {data?.map((item: any, i: number) => (
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
      </InfiniteScroll>
    </>
  );
}
