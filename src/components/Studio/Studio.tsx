"use client";
import { ProfileData } from "@/app/(main)/profile/page";
import { formatSubscribers } from "@/app/(main)/watch/page";
import { useUser } from "@/app/context/UserContext";
import { apiRequest } from "@/utils/apiRequest";
import { Avatar, Box, Button, List, Modal, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Subscriber from "./Subscriber";
import Subscription from "./Subscriptions";
import EditIcon from "@mui/icons-material/Edit";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Studio() {
  const { user } = useUser();
  const router = useRouter();

  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [navigation, setNavigation] = useState<String>("subscribers");
  const [openModal, setOpenModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const fetchProfile = async () => {
    if (!user?.username) return;
    setLoading(true);

    try {
      const res = await apiRequest(
        "GET",
        `${apiUrl}/api/v1/users/profile/${encodeURIComponent(user?.username)}/${
          user === null ? "auth" : ""
        }`,
        {},
        router,
      );

      console.log(res)
      if (res?.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const [hover, setHover] = useState(false);

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    try {
      const res = await fetch(`${apiUrl}/api/v1/users/change-avatar`, {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });

      const result = await res.json();

      if (res.ok && result.success) {
        // Update local avatar
        setData((prev) => prev && { ...prev, avatar: result.data.avatar });
        setOpenModal(false);
      } else {
        alert(result.message || "Failed to change avatar");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading avatar");
    }
  };

  if (loading) return <Typography>Loading channel...</Typography>;
  if (!data)
    return (
      <Typography className="text-center mt-10">Profile not found</Typography>
    );
  return (
    <div className="p-4 md:p-8">
      {/* Profile Info */}
      <Box className="flex flex-col md:flex-row items-center justify-between mb-6 bg-white shadow-md rounded-xl p-4 md:p-6">
        <Box
          className="relative"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <Avatar
            src={data?.avatar}
            sx={{ width: 180, height: 180, border: "4px solid #1976d2" }}
          />
          {/* Hover overlay */}
          {hover && (
            <Box
              onClick={() => setOpenModal(true)}
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              sx={{
                backgroundColor: "rgba(0,0,0,0.4)",
                borderRadius: "50%",
              }}
            >
              <EditIcon sx={{ color: "#fff", fontSize: 40 }} />
            </Box>
          )}
        </Box>

        <Box className="flex-1 mt-4 md:mt-0 md:ml-6 text-center md:text-left">
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "32px" }}>
            {data?.fullName}
          </Typography>
          <Typography variant="body2" className="text-gray-500 mt-1">
            @{data?.username}
          </Typography>
          <Typography variant="body2" className="text-gray-600 mt-2">
            {data?.subscribersCount} Subscribers • {data?.subscribedToCount}{" "}
            Subscriptions
          </Typography>
        </Box>
      </Box>

      {/* Subscribers Title */}
      <Box className="flex gap-6 mb-3">
        <Typography
          variant="h6"
          onClick={() => setNavigation("subscribers")}
          className={`pt-5 font-semibold ${navigation === "subscribers" ? "border-b-4" : ""} w-fit border-[#1976d2] pb-0 cursor-pointer`}
        >
          Subscribers
        </Typography>
        <Typography
          variant="h6"
          onClick={() => setNavigation("subscription")}
          className={`pt-5 font-semibold ${navigation === "subscription" ? "border-b-4" : ""} w-fit border-[#1976d2] pb-0 cursor-pointer`}
        >
          Subscription
        </Typography>
      </Box>

      {/* Modal for avatar change */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            width: { xs: 300, sm: 400 },
            bgcolor: "background.paper",
            p: 4,
            mx: "auto",
            mt: "10%",
            borderRadius: 2,
            textAlign: "center",
            outline: "none",
          }}
        >
          <Typography variant="h6" mb={2}>
            Change Avatar
          </Typography>

          <Box
            sx={{
              width: 200,
              height: 200,
              mx: "auto",
              mb: 2,
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px dashed gray",
            }}
          >
            <img
              src={preview || data?.avatar}
              alt="preview"
              className="w-full h-full object-cover"
            />
          </Box>

          <Button variant="contained" component="label" sx={{ mb: 2 }}>
            Choose Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>

          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={!selectedFile}
            >
              Change Avatar
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Subscriber List */}
      {navigation === "subscribers" ? <Subscriber /> : <Subscription />}
    </div>
  );
}
