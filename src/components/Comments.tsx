"use client";

import {
  Avatar,
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { apiRequest } from "@/utils/apiRequest";
import { timeAgo } from "@/utils/format";
import { useUser } from "@/app/context/UserContext";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
// types/comment.ts
interface CommentOwner {
  _id: string;
  username: string;
  fullName: string;
  avatar: string;
}

interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked: boolean;
  owner: CommentOwner;
}

interface CommentResponse {
  comments: Comment[];
  page: number;
  limit: number;
  totalPages: number;
  totalComments: number;
}

const CommentSection = ({ videoId }: { videoId: string }) => {
  const router = useRouter();
  const { user } = useUser();

  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch comments
  const fetchComments = async (pageNo = 1) => {
    setLoading(true);
    const res = await apiRequest<{ data: CommentResponse }>(
      "GET",
      `${apiUrl}/api/v1/comments/${videoId}${user === null ? "" : "/auth"}?page=${pageNo}&limit=10`,
      {},
      router,
    );

    if (res?.data) {
      setComments((prev) =>
        pageNo === 1 ? res.data.comments : [...prev, ...res.data.comments],
      );
      setTotalPages(res.data.totalPages);
      setTotalComments(res.data.totalComments);
    }
    console.log(res);
    setLoading(false);
  };

  // Add comment
  const handleAddComment = async () => {
    if (!content.trim()) return;

    const res = await apiRequest(
      "POST",
      `${apiUrl}/api/v1/comments/${videoId}`,
      { content },
      router,
    );

    if (res?.success) {
      setContent("");
      setPage(1);
      fetchComments(1);
    }
  };

  // Toggle like
  const toggleLike = async (commentId: string) => {
    await apiRequest(
      "POST",
      `${apiUrl}/api/v1/likes/toggle/c/${commentId}`,
      {},
      router,
    );

    setComments((prev) =>
      prev.map((c) =>
        c._id === commentId
          ? {
              ...c,
              isLiked: !c.isLiked,
              likesCount: c.isLiked ? c.likesCount - 1 : c.likesCount + 1,
            }
          : c,
      ),
    );
  };

  useEffect(() => {
    if (videoId) fetchComments(1);
  }, [videoId]);

  return (
    <Box className="w-full mt-6">
      {/* Comment Count */}
      <Typography variant="h6" className="font-semibold mb-4">
        {totalComments} Comments
      </Typography>

      {/* Add Comment */}
      <Box className="flex gap-3 mb-6">
        <Avatar />
        <Box className="flex-1">
          <TextField
            fullWidth
            variant="standard"
            placeholder="Add a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Box className="flex justify-end gap-2 mt-2">
            <Button size="small" onClick={() => setContent("")}>
              Cancel
            </Button>
            <Button size="small" variant="contained" onClick={handleAddComment}>
              Comment
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Comments */}
      <Box className="space-y-6">
        {comments.map((comment) => (
          <Box key={comment._id} className="flex gap-3">
            <Avatar src={comment.owner.avatar} />
            <Box className="flex-1">
              <Typography className="text-sm font-semibold">
                @{comment.owner.username}{" "}
                <span className="text-gray-500 font-normal ml-2">
                  {timeAgo(comment.createdAt)}
                </span>
              </Typography>

              <Typography className="text-sm mt-1">
                {comment.content}
              </Typography>

              <Box className="flex items-center gap-2 mt-1">
                <IconButton
                  size="small"
                  onClick={() => toggleLike(comment._id)}
                >
                  {comment.isLiked ? (
                    <ThumbUpAltIcon fontSize="small" />
                  ) : (
                    <ThumbUpAltOutlinedIcon fontSize="small" />
                  )}
                </IconButton>

                <Typography className="text-xs">
                  {comment.likesCount}
                </Typography>

                <IconButton size="small">
                  <ThumbDownAltOutlinedIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Load More */}
      {page < totalPages && (
        <Box className="flex justify-center mt-6">
          <Button
            variant="outlined"
            disabled={loading}
            onClick={() => {
              const nextPage = page + 1;
              setPage(nextPage);
              fetchComments(nextPage);
            }}
          >
            Load more comments
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CommentSection;
