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

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Studio() {
  const { user } = useUser();
  const router = useRouter();

  const [data, setData] = useState<ProfileData | null>(null);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user?.username) return;
    setLoading(true);

    try {
      const res = await apiRequest(
        "GET",
        `${apiUrl}/api/v1/users/profile/${user?.username}/${
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

  const fetchSubs = async () => {
    if (!user?.username) return;
    setLoading(true);

    try {
      const res = await apiRequest(
        "GET",
        `${apiUrl}/api/v1/subscriptions/c/${user?._id}`,
        {},
        router,
      );

      if (res?.success) {
        setSubscribers(res.data);
        console.log(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchSubs();
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
        {data?.subscribersCount} Subscribers • {data?.subscribedToCount} Subscriptions
      </Typography>
    </Box>
  </Box>

  {/* Subscribers Title */}
  <Typography
    variant="h5"
    className="pt-5 font-semibold border-b-4 w-fit border-[#1976d2] pb-2 mb-4"
  >
    Subscribers
  </Typography>

  {/* Subscriber List */}
  <List className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {subscribers.length > 0 ? (
      subscribers.map((ele: any) => (
        <Box
          key={ele._id}
          className="flex items-center gap-3 p-3 bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-200"
        >
          <Link href={`/profile?username=${ele.subscriber.username}`}>
            <Image
              className="h-16 w-16 rounded-full object-cover"
              alt={ele.subscriber.username || ""}
              height={64}
              width={64}
              src={ele.subscriber.avatar || "/default-avatar.png"}
            />
          </Link>
          <Box>
            <Link href={`/profile?username=${ele.subscriber.username}`}>
              <Typography
                className="text-lg font-semibold hover:text-[#1976d2] transition-colors duration-200"
              >
                {ele.subscriber.fullName.slice(0, 100)}
              </Typography>
              <Typography className="text-gray-500 text-sm">
                @{ele.subscriber.username}
              </Typography>
            </Link>
          </Box>
        </Box>
      ))
    ) : (
      <div className="text-gray-500 mt-4">No Subscribers Found</div>
    )}
  </List>
</div>

  );
}
