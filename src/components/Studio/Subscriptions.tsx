"use client";
import { useUser } from "@/app/context/UserContext";
import { apiRequest } from "@/utils/apiRequest";
import { Box, List, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Subscription() {
  const { user } = useUser();
  const [Subscriptions, setSubscriptions] = useState<any[]>([]);
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const fetchSubs = async () => {
    if (!user?.username) return;
    setLoading(true);

    try {
      const res = await apiRequest(
        "GET",
        `${apiUrl}/api/v1/subscriptions/u/${user?._id}`,
        {},
        router,
      );

      if (res?.success) {
        setSubscriptions(res.data);
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
      {Subscriptions.length > 0 ? (
        Subscriptions.map((ele: any) => (
          <Box
            key={ele._id}
            className="flex items-center gap-3 p-3 bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-200"
          >
            <Link
              href={`/profile/${encodeURIComponent(ele.channel.username)}`}
            >
              <Image
                className="h-16 w-16 rounded-full object-cover"
                alt={ele.channel.username || ""}
                height={64}
                width={64}
                src={ele.channel.avatar || "/default-avatar.png"}
              />
            </Link>
            <Box>
              <Link href={`/profile/${encodeURIComponent(ele.channel.username)}`}>
                <Typography className="text-lg font-semibold hover:text-[#1976d2] transition-colors duration-200">
                  {ele.channel.fullName.slice(0, 100)}
                </Typography>
                <Typography className="text-gray-500 text-sm">
                  @{ele.channel.username}
                </Typography>
              </Link>
            </Box>
          </Box>
        ))
      ) : (
        <div className="text-gray-500 mt-4">No Subscriptions Found</div>
      )}
    </List>
  );
}
