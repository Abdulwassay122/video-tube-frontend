"use client";
import { useUser } from "@/app/context/UserContext";
import NotAuthenticated from "@/components/NotAuthenticated";
import Studio from "@/components/Studio/Studio";

export default function page() {
  const { user } = useUser();
  if (user === null) return <NotAuthenticated />;
  if (user === undefined) return null;
  return <div>Analytic</div>;
}
