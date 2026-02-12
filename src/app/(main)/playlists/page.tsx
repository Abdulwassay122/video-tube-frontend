"use client";

import { useUser } from "@/app/context/UserContext";
import NotAuthenticated from "@/components/NotAuthenticated";
import { apiRequest } from "@/utils/apiRequest";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Box,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Modal,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import { toast } from "react-toastify";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function page() {
  const router = useRouter();
  const { user } = useUser();

  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // modal state
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(
    null,
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedPlaylistId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPlaylistId(null);
  };

  const handleDelete = async () => {
    if (selectedPlaylistId) {
      try {
        const res = await apiRequest(
          "DELETE",
          `${apiUrl}/api/v1/playlist/${selectedPlaylistId}`,
          {},
          router,
        );
        if (res?.success) {
          toast.success("playlist deleted.");
          setPlaylists((prev) => {
            return prev.filter((item) => item._id != selectedPlaylistId);
          });
        }
      } catch (err: any) {
        console.error(err);
        toast.success(err.message || "erorr");
      } finally {
        setLoading(false);
      }
      handleMenuClose();
    }
  };

  async function getUserPlaylists() {
    try {
      const res = await apiRequest(
        "GET",
        `${apiUrl}/api/v1/playlist/user`,
        {},
        router,
      );
      if (res?.success) setPlaylists(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function createPlaylist() {
    if (!name.trim()) {
      toast.error("Playlist name required");
      return;
    }

    setCreating(true);
    try {
      const res = await apiRequest(
        "POST",
        `${apiUrl}/api/v1/playlist`,
        { name, description },
        router,
      );

      if (res?.success) {
        toast.success("Playlist Created");
        setOpen(false);
        setName("");
        setDescription("");
        getUserPlaylists();
      }
    } catch (err: any) {
      toast.error(err.message || "Error creating playlist");
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => {
    if (user !== null && user !== undefined) {
      getUserPlaylists();
    }
  }, [user]);

  if (user === null) {
    return <NotAuthenticated message="Login to see your playlists." />;
  }

  if (loading || user === undefined) return "loading...";
  console.log(playlists);

  return (
    <Box className="p-4 md:p-8">
      {/* Header */}
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h5" fontWeight={700}>
          Your Playlists
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Create Playlist
        </Button>
      </Box>

      {/* Empty State */}
      {playlists.length < 1 ? (
        <Typography>No playlists found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {playlists.map((playlist) => (
            <Grid size={{ md: 4, sm: 6, xs: 12 }} key={playlist._id}>
              <Card
                sx={{
                  borderRadius: "10px",
                  boxShadow: "none",
                  background: "#f5f5f5",
                  padding: 1,
                  position: "relative",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "#fff",
                    transform: "scale(1.03)",
                    cursor: "pointer",
                  },
                }}
              >
                {/* Three-dot menu */}

                <Menu
                  anchorEl={anchorEl}
                  open={
                    Boolean(anchorEl) && selectedPlaylistId === playlist._id
                  }
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleDelete}>Delete</MenuItem>
                </Menu>

                {/* Thumbnail */}
                <Box
                  sx={{
                    aspectRatio: "16/9", 
                    borderRadius: "8px",
                    overflow: "hidden",
                    backgroundColor: "#000",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundImage: `url(${playlist.videos?.[0]?.thumbnail || "/default_playlist_placeholder.png"})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  onClick={() => router.push(`/playlist-detail/${playlist._id}`)}
                >
                  {/* Optional overlay icon */}
                  <PlaylistPlayIcon
                    sx={{ fontSize: 60, color: "#fff", opacity: 0.8 }}
                  />

                  {/* Videos count badge */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      background: "rgba(0,0,0,0.6)",
                      color: "#fff",
                      px: 1,
                      borderRadius: 1,
                      fontSize: 12,
                    }}
                  >
                    {playlist.videos?.length || 0} videos
                  </Box>
                </Box>

                <CardContent
                  sx={{
                    padding: 0,
                    pt: "10px",
                    "&:last-child": { pb: 0 },
                    position: "relative",
                  }}
                >
                  <Typography sx={{ fontSize: "15px", fontWeight: 600 }} noWrap>
                    {playlist.name}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "14px", color: "text.secondary" }}
                    noWrap
                  >
                    {playlist.description || "No description"}
                  </Typography>

                  <IconButton
                    onClick={(e) => handleMenuOpen(e, playlist._id)}
                    sx={{ position: "absolute", top: 8, right: 0 }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Playlist Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: { xs: "90%", sm: 400 },
            bgcolor: "background.paper",
            p: 3,
            mx: "auto",
            mt: "10%",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
            Create Playlist
          </Typography>

          <TextField
            label="Playlist Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Box className="flex justify-end gap-2">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={createPlaylist}
              disabled={creating}
            >
              {creating ? "Creating..." : "Create"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
