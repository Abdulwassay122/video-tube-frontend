"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  Avatar,
  Box,
  TextField,
  CircularProgress,
} from "@mui/material";
import { apiRequest } from "@/utils/apiRequest";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface AddToPlaylistModalProps {
  open: boolean;
  handleClose: () => void;
  videoId: string;
  onAdded: () => void;
}

export default function AddToPlaylistModal({
  open,
  handleClose,
  videoId,
  onAdded,
}: AddToPlaylistModalProps) {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (open) fetchPlaylists();
  }, [open]);

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("GET", `${apiUrl}/api/v1/playlist/user`);
      setPlaylists(res.data || []);
    } catch (err: any) {
      console.error(err.message || err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!selectedPlaylist) return;

    setLoading(true);
    try {
      const res = await apiRequest(
        "PATCH",
        `${apiUrl}/api/v1/playlist/add/${videoId}/${selectedPlaylist}`,
      );
      if (res?.success) {
        onAdded();
        handleClose();
        toast.success("Added");
      }
    } catch (err: any) {
      toast.error(err.message);
      console.error(err.message || err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName) return;
    setCreating(true);
    try {
      const payload = {
        name: newPlaylistName,
        description: newPlaylistDescription,
      };
      const res = await apiRequest(
        "POST",
        `${apiUrl}/api/v1/playlist/create`,
        payload,
      );
      if (res?.success) {
        fetchPlaylists(); // refresh playlists
        setCreateModalOpen(false);
        setNewPlaylistName("");
        setNewPlaylistDescription("");
      }
    } catch (err: any) {
      console.error(err.message || err);
    } finally {
      setCreating(false);
    }
  };

  const getThumbnail = (playlist: any) => {
    if (playlist.videos && playlist.videos.length > 0) {
      // Ensure this is the video thumbnail, not owner avatar
      return playlist.videos[0].thumbnail || "/default_playlist_thumbnail.png";
    }
    // fallback playlist thumbnail
    return "/default_playlist_placeholder.png";
  };

  return (
    <>
      {/* Add to Playlist Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Add Video to Playlist</DialogTitle>
        <DialogContent>
          {loading ? (
            <Box className="flex justify-center py-5">
              <CircularProgress />
            </Box>
          ) : playlists.length ? (
            <RadioGroup
              value={selectedPlaylist}
              onChange={(e) => setSelectedPlaylist(e.target.value)}
            >
              <List>
                {playlists.map((playlist) => (
                  <ListItem key={playlist._id} disablePadding>
                    <ListItemButton
                      onClick={() => setSelectedPlaylist(playlist._id)}
                      sx={{ display: "flex", alignItems: "center", gap: 2 }}
                    >
                      {/* Playlist Thumbnail */}
                      <Box
                        sx={{
                          width: 80,
                          height: 45,
                          flexShrink: 0,
                          borderRadius: 1,
                          backgroundColor: "#000",
                          backgroundImage: `url(${playlist.videos?.[0]?.thumbnail || "/default_playlist_placeholder.png"})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      {/* Radio + Name */}
                      <FormControlLabel
                        value={playlist._id}
                        control={<Radio />}
                        label={playlist.name}
                        sx={{ flex: 1, m: 0 }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </RadioGroup>
          ) : (
            <Box>No playlists found. Create one!</Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button onClick={() => setCreateModalOpen(true)} variant="outlined">
            Create Playlist
          </Button>
          <Button
            variant="contained"
            disabled={!selectedPlaylist || loading}
            onClick={handleAdd}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Playlist Modal */}
      <Dialog
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Create New Playlist</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Playlist Name"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={newPlaylistDescription}
            onChange={(e) => setNewPlaylistDescription(e.target.value)}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateModalOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!newPlaylistName || creating}
            onClick={handleCreatePlaylist}
          >
            {creating ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
