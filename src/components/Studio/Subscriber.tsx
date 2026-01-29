"use client";
import { useUser } from "@/app/context/UserContext";
import { apiRequest } from "@/utils/apiRequest";
import { Box, List, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Subscriber() {
  const { user } = useUser();
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const router = useRouter();

  const [loading, setLoading] = useState(true);

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
    fetchSubs();
  }, []);

  if (loading) return "Loading...";
  return (
    <List className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {subscribers.length > 0 ? (
        subscribers.map((ele: any) => (
          <Box
            key={ele._id}
            className="flex items-center gap-3 p-3 bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-200"
          >
            <Link href={`/profile?username=${encodeURIComponent(ele.subscriber.username)}`}>
              <Image
                className="h-16 w-16 rounded-full object-cover"
                alt={ele.subscriber.username || ""}
                height={64}
                width={64}
                src={ele.subscriber.avatar || "/default-avatar.png"}
              />
            </Link>
            <Box>
              <Link href={`/profile?username=${encodeURIComponent(ele.subscriber.username)}`}>
                <Typography className="text-lg font-semibold hover:text-[#1976d2] transition-colors duration-200">
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
  );
}
