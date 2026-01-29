"use client";
import { ProfileData } from "@/app/(main)/profile/page";
import { formatSubscribers } from "@/app/(main)/watch/page";
import { useUser } from "@/app/context/UserContext";
import { apiRequest } from "@/utils/apiRequest";
import { Avatar, Box, List, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Subscriber from "./Subscriber";
import Subscription from "./Subscriptions";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Studio() {
  const { user } = useUser();
  const router = useRouter();

  const [data, setData] = useState<ProfileData | null>(null);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [navigation, setNavigation] = useState<String>("subscribers");

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

  if (loading) return <Typography>Loading channel...</Typography>;
  if (!data)
    return (
      <Typography className="text-center mt-10">Profile not found</Typography>
    );
  return (
    <div className="p-4 md:p-8">
      {/* Profile Info */}
      <Box className="flex flex-col md:flex-row items-center justify-between mb-6 bg-white shadow-md rounded-xl p-4 md:p-6">
        <Avatar
          src={data?.avatar}
          sx={{ width: 180, height: 180, border: "4px solid #1976d2" }}
        />
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

      {/* Subscriber List */}
      {navigation === "subscribers" ? <Subscriber /> : <Subscription />}
    </div>
  );
}
