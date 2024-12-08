"use client";

import { UserProfile } from "@/types";
import { createContext, useContext, ReactNode } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type UserContextType = {
  refetch: () => Promise<void>;
  currentUser: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { refetch, currentUser, isLoading, error, isAuthenticated } =
    useCurrentUser();

  return (
    <UserContext.Provider
      value={{
        refetch,
        currentUser,
        error,
        isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useCurrentUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useCurrentUserContext must be used within a UserProvider");
  }
  return context;
};
