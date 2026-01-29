"use client";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Box,
  Button,
  Typography,
  Paper,
  Modal,
  Stack,
  TextField,
  LinearProgress,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { apiRequest } from "@/utils/apiRequest";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";

const CLOUD_NAME = "dogzyov9k";
const UPLOAD_PRESET = "video_upload";

export default function VideoUpload() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Files & Previews
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);

  // Cloudinary URLs
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  // Loading & Progress
  const [loading, setLoading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [thumbProgress, setThumbProgress] = useState(0);

  const [videoUploaded, setVideoUploaded] = useState(false);
  const [thumbUploaded, setThumbUploaded] = useState(false);

  const [videoPublicId, setVideoPublicId] = useState<string | null>(null);
  const [thumbPublicId, setThumbPublicId] = useState<string | null>(null);

  const [videoUploading, setVideoUploading] = useState(false);
  const [thumbUploading, setThumbUploading] = useState(false);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const [duration, setDuration] = useState(false);

  const is16by9 = (width: number, height: number) =>
    Math.abs(width / height - 16 / 9) < 0.01;

  // Direct Cloudinary Upload

  const uploadToCloudinary = async (
    file: File,
    folder: string,
    setProgress: (p: number) => void,
    setUploaded: (uploaded: boolean) => void,
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", folder);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
      formData,
      {
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / (event.total || 1));
          setProgress(percent);
        },
      },
    );

    setUploaded(true); // mark as uploaded

    if (folder === "videos") {
      setVideoPublicId(res.data.public_id);
      setDuration(res.data.duration);
    }
    if (folder === "thumbnails") setThumbPublicId(res.data.public_id);

    return res.data.secure_url;
  };

  // Handle Video Select

  const handleVideoSelect = async (file: File) => {
    setVideoUploading(true);
    const videoEl = document.createElement("video");
    const url = URL.createObjectURL(file);
    videoEl.src = url;

    videoEl.onloadedmetadata = async () => {
      if (!is16by9(videoEl.videoWidth, videoEl.videoHeight)) {
        toast.error("Video must be 16:9");
        URL.revokeObjectURL(url);
        return;
      }
      setVideoFile(file);
      setVideoPreview(url);

      try {
        const uploadedUrl = await uploadToCloudinary(
          file,
          "videos",
          setVideoProgress,
          setVideoUploaded,
        );
        setVideoUrl(uploadedUrl);
      } catch (err) {
        toast.error("Video upload failed");
      } finally {
        setVideoUploading(false);
      }
    };
  };

  // Handle Thumbnail Select

  const handleThumbnailSelect = async (file: File) => {
    setThumbUploading(true);
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
      if (!is16by9(img.width, img.height)) {
        toast.error("Thumbnail must be 16:9");
        setThumbUploading(false);
        return;
      }
      setThumbnailFile(file);
      setThumbPreview(img.src);

      try {
        const uploadedUrl = await uploadToCloudinary(
          file,
          "thumbnails",
          setThumbProgress,
          setThumbUploaded,
        );
        setThumbnailUrl(uploadedUrl);
      } catch (err) {
        toast.error("Thumbnail upload failed");
      } finally {
        setThumbUploading(false);
      }
    };
  };

  // Remove files

  const removeVideo = async () => {
    if (videoPublicId) {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/videos/cloudinary/delete`,
        {
          publicId: videoPublicId,
          resourceType: "video",
        },
        { withCredentials: true },
      );
    }
    setVideoPreview("");
    setVideoUrl("");
    setVideoUploaded(false);
    setVideoProgress(0);

    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const removeThumbnail = async () => {
    if (thumbPublicId) {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/videos/cloudinary/delete`,
        { publicId: thumbPublicId, resourceType: "image" },
        { withCredentials: true },
      );
    }
    setThumbPreview("");
    setThumbnailUrl("");
    setThumbUploaded(false);
    setThumbProgress(0);

    if (thumbInputRef.current) {
      thumbInputRef.current.value = "";
    }
  };

  // Upload Metadata to Backend

  const handleUploadMetadata = async () => {
    if (!videoUrl || !thumbnailUrl || !title || !description || !duration) {
      toast.error("All fields are required!");
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest(
        "POST",
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/videos/withurl`,
        {
          title,
          description,
          videoFile: videoUrl,
          thumbnail: thumbnailUrl,
          duration,
        },
        router,
      );
      toast.success(res.message);
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, textAlign: "center", width: "100%" }}>
        <CloudUploadIcon sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
        <Typography variant="h6" fontWeight={600}>
          Upload your video
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Share your content with your audience
        </Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Upload Video
        </Button>
      </Paper>

      <Modal open={open} onClose={() => setOpen(false)}>
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
              onClick={() => setOpen(false)}
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

              {/* Video Input */}
              <Button variant="outlined" component="label">
                Select Video (16:9)
                <input
                  ref={videoInputRef}
                  type="file"
                  hidden
                  accept="video/*"
                  onChange={(e) =>
                    e.target.files && handleVideoSelect(e.target.files[0])
                  }
                />
              </Button>
              {videoUploading && (
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <CircularProgress />
                  <Typography sx={{ mt: 1 }}>{videoProgress}%</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={videoProgress}
                    sx={{ mt: 1, height: 8, borderRadius: 1 }}
                  />
                </Box>
              )}

              {videoUploaded && !videoUploading && videoPreview && (
                <Box>
                  <video
                    src={videoPreview}
                    controls
                    style={{
                      width: "100%",
                      aspectRatio: "16/9",
                      borderRadius: 8,
                    }}
                  />
                  <Typography color="green" sx={{ mt: 1 }}>
                    Uploaded
                  </Typography>

                  <Button
                    color="error"
                    size="small"
                    onClick={removeVideo}
                    sx={{ mt: 1 }}
                  >
                    Remove Video
                  </Button>
                </Box>
              )}

              {/* Thumbnail Input */}
              <Button variant="outlined" component="label">
                Select Thumbnail (16:9)
                <input
                  ref={thumbInputRef}
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files && handleThumbnailSelect(e.target.files[0])
                  }
                />
              </Button>
              {thumbUploading && (
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <CircularProgress />
                  <Typography sx={{ mt: 1 }}>{thumbProgress}%</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={thumbProgress}
                    sx={{ mt: 1, height: 8, borderRadius: 1 }}
                  />
                </Box>
              )}

              {thumbUploaded && !thumbUploading && thumbPreview && (
                <Box>
                  <img
                    src={thumbPreview}
                    style={{
                      width: "100%",
                      aspectRatio: "16/9",
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                  <Typography color="green" sx={{ mt: 1 }}>
                    Uploaded
                  </Typography>

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
                disabled={
                  loading ||
                  !title ||
                  !description ||
                  !videoUrl ||
                  !thumbnailUrl
                }
                onClick={handleUploadMetadata}
              >
                Upload
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Modal>
    </Box>
  );
}
