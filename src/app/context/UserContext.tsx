"use client";

import React, { createContext, useContext } from "react";

export type User = {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage: string;
};

type UserContextType = {
  user: User | null;
};

const UserContext = createContext<UserContextType>({
  user: null,
});

export const UserProvider = ({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) => {
  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
