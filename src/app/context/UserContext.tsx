"use client";

import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  ReactNode,
} from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { refreshToken } from "@/utils/apiRequest";

export type User = {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage: string;
};

type UserContextType = {
  user: User | null | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | null | undefined>>;
};

const UserContext = createContext<UserContextType>({
  user: undefined as User | null | undefined,
  setUser: () => {},
});

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const router = useRouter();

  const fetchMe = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/v1/users/me`, {
        withCredentials: true,
      });

      setUser(res.data.data);
    } catch (err) {
      const error = err as AxiosError;

      if (error.response?.status === 401) {
        const refreshed = await refreshToken();
        console.log("refreshed", refreshed);

        if (refreshed) {
          // retry /me after refresh
          await fetchMe();
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
  };

  useLayoutEffect(() => {
    fetchMe();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
