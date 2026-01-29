"use client";
import { apiRequest } from "@/utils/apiRequest";
import { formatNumber, timeAgo } from "@/utils/format";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";

export default function StVideoCard() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [error, setError] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);

  const is16by9 = (width: number, height: number) =>
    Math.abs(width / height - 16 / 9) < 0.01;
  const handleThumbnailSelect = (file: any) => {
    if (!file) return;
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      if (!is16by9(img.width, img.height)) {
        toast.error("Thumbnail must be 16:9");
        return;
      }
      setThumbnailFile(file);
      setThumbPreview(URL.createObjectURL(file));
    };
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbPreview(null);
  };

  const openMenu = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, video: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedVideo(video);
    console.log("set", video);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // setSelectedVideo(null);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await apiRequest(
        "DELETE",
        `${apiUrl}/api/v1/videos/${id}`,
        {},
        router,
      );
      toast.success("Video Deleted Successfully.");
      const index = data?.data.videos.findIndex(
        (video: any) => video._id === id,
      );
      if (index !== -1) {
        const newVideos = [...data.data.videos]; // copy the array
        newVideos.splice(index, 1); // remove the item

        setData({
          ...data,
          data: {
            ...data.data,
            videos: newVideos,
            totalVideos: data.data.totalVideos - 1,
            // optionally adjust totalPages if needed
          },
        });
      }
    } catch (error: any) {
      toast.error("Error:", error);
    }
    handleMenuClose();
  };

  const handleUpdate = (video: any) => {
    setSelectedVideo(video);

    setTitle(video?.title || "");
    setDescription(video?.description || "");

    setThumbPreview(video?.thumbnail || null);
    setThumbnailFile(null);

    setOpen(true);
  };

  const handleTogglePublish = async (id: string) => {
    try {
      const response = await apiRequest(
        "PATCH",
        `${apiUrl}/api/v1/videos/toggle/publish/${id}`,
        {},
        router,
      );
      toast.success(response.message);
      const index = data?.data.videos.forEach((video: any) => {
        if (video._id === id) {
        }
      });

      const newVideos = [...data.data.videos];
      newVideos.forEach((video: any) => {
        if (video._id === id) {
          video.isPublished = !video.isPublished;
        }
      });

      setData({
        ...data,
        data: {
          ...data.data,
          videos: newVideos,
          totalVideos: data.data.totalVideos,
        },
      });
    } catch (error: any) {
      console.log(error);
      toast.error("Error:", error);
    }
    handleMenuClose();
  };

  const fetchApi = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest(
        "GET",
        `${apiUrl}/api/v1/videos/user`,
        {},
        router,
      );
      setData(response);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadMetadata = async () => {
    setUpdating(true);

    if (!thumbnailFile && !title && !description) {
      toast.error("At least one change is required");
      return;
    }

    const formData = new FormData();

    if (title) formData.append("title", title);
    if (description) formData.append("description", description);
    if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
    try {
      const res = await apiRequest(
        "PATCH",
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/videos/${selectedVideo?._id}`,
        formData,
        router,
      );
      toast.success(res.message);
      handleCloseModal();
    } catch (err: any) {
      toast.error(err?.message || "Upload failed");
    } finally {
      setUpdating(false);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedVideo(null);
    setTitle("");
    setDescription("");
    setThumbnailFile(null);
    setThumbPreview(null);
    handleMenuClose();
  };

  useEffect(() => {
    fetchApi();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (data?.data.videos.length === 0) return <div className="mt-4 text-gray-500">No videos uploaded</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box className="mt-4">
      <Grid container spacing={2}>
        {data?.data.videos.map((item: any, i: number) => (
          <Grid size={{ md: 4, sm: 6, xs: 12 }} key={i}>
            <Card
              onClick={() => router.push(`/watch?v=${item._id}`)}
              sx={{
                borderRadius: "10px",
                boxShadow: "none",
                background: "#f5f5f5",
                padding: 1,
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
                }}
                component="img"
                image={item.thumbnail}
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
                <Box className="flex gap-2 pb-0 w-full">
                  <Box className="w-full">
                    <Box className="flex justify-between items-start w-full">
                      <Typography sx={{ fontSize: "15px", fontWeight: 600 }}>
                        {item.title.slice(0, 100)}
                      </Typography>

                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuOpen(e, item);
                        }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Box className="flex gap-2">
                      <Typography
                        sx={{ fontSize: "13px" }}
                        className=" text-gray-400"
                      >
                        {formatNumber(item.views)} views
                      </Typography>
                      <Typography
                        sx={{ fontSize: "13px" }}
                        className=" text-gray-400"
                      >
                        {timeAgo(item.createdAt)}
                      </Typography>
                    </Box>
                    <Box className="flex gap-2">
                      <Typography
                        sx={{ fontSize: "13px" }}
                        className={`${
                          item.isPublished
                            ? "text-emerald-700 bg-emerald-500/20"
                            : "text-amber-700 bg-amber-400/25"
                        } rounded-full px-2 text-sm font-medium backdrop-blur-md border border-white/30 shadow-sm`}
                      >
                        {item.isPublished ? "Published" : "Un Published"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          "& .MuiMenuItem-root": {
            fontSize: "14px",
            minHeight: "28px",
            padding: "4px 12px",
          },
        }}
      >
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleUpdate(selectedVideo);
          }}
        >
          Update
        </MenuItem>

        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(selectedVideo?._id);
          }}
          sx={{
            color: "error.main",
          }}
        >
          Delete
        </MenuItem>

        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleTogglePublish(selectedVideo?._id);
          }}
        >
          {selectedVideo?.isPublished ? "Unpublish" : "Publish"}
        </MenuItem>
      </Menu>

      {/* Update Modal */}
      <Modal open={open} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: 520,
            maxHeight: "90vh",
            overflowY: "auto",
            // Hide scrollbar
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
            // Firefox
            "-ms-overflow-style": "none", // IE 10+
          }}
        >
          <Paper sx={{ p: 4, borderRadius: 2, position: "relative" }}>
            <IconButton
              onClick={handleCloseModal}
              sx={{ position: "absolute", top: 12, right: 14 }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Upload Video
            </Typography>

            <Stack spacing={2}>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
              />
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
                fullWidth
              />

              {/* Thumbnail Input */}
              {/* Thumbnail Input */}
              <Button variant="outlined" component="label">
                Select Thumbnail (16:9)
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files && handleThumbnailSelect(e.target.files[0])
                  }
                />
              </Button>

              {thumbPreview && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={thumbPreview}
                    alt="Thumbnail Preview"
                    style={{
                      width: "100%",
                      aspectRatio: "16/9",
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />

                  <Button
                    color="error"
                    size="small"
                    onClick={removeThumbnail}
                    sx={{ mt: 1 }}
                  >
                    Remove Thumbnail
                  </Button>
                </Box>
              )}

              <Button
                variant="contained"
                disabled={loading || (!title && !description && !thumbnailFile)}
                onClick={handleUploadMetadata}
              >
                {updating ? "Updating..." : "Update"}
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Modal>
    </Box>
  );
}
