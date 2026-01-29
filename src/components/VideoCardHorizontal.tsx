import React from "react";
import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import Image from "next/image";
import { formatNumber, timeAgo } from "@/utils/format";
import Link from "next/link";

type Props = {
  id: string;
  thumbnail: string;
  avatar: string;
  title: string;
  fullName: string;
  views: number;
  createdAt: string;
};

export default function VideoCardHoriontal({
  id,
  thumbnail,
  title,
  fullName,
  views,
  createdAt,
}: Props) {
  return (
    <Link href={`/watch?v=${id}`}>
      <Card
        sx={{
          borderRadius: "10px",
          boxShadow: "none",
          background: "#f5f5f5",
          padding: 1,
          display: "flex",
          "&:hover": {
            background: "#fff",
            cursor: "pointer",
          },
        }}
      >
        <CardMedia
          className="cardMedia"
          sx={{
            borderRadius: "8px",
            height: "125px",
            width: "auto",
          }}
          component="img"
          image={thumbnail}
        />
        <CardContent
          sx={{
            padding: 0, // Remove padding
            pb: 0,
            pt: "10px",
            boxShadow: "none", // Remove shadow
            border: "none", // Remove border
            "&:last-child": { pb: 0 },
          }}
        >
          <Box className="flex flex-col gap-2 pb-0 pl-4">
            <Box>
              <Typography sx={{ fontSize: "15px", fontWeight: 600 }}>
                {title.slice(0, 100)}
              </Typography>
              <Typography sx={{ fontSize: "15px" }} className=" text-gray-400">
                {fullName}
              </Typography>
              <Box className="flex gap-2">
                <Typography
                  sx={{ fontSize: "13px" }}
                  className=" text-gray-400"
                >
                  {formatNumber(views)} views
                </Typography>
                <Typography
                  sx={{ fontSize: "13px" }}
                  className=" text-gray-400"
                >
                  {timeAgo(createdAt)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
}
