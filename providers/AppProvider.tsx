import { ReactNode } from "react";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { UserProvider } from "@/contexts/UserContext";

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <UserProvider>
      <ProjectProvider>{children}</ProjectProvider>
    </UserProvider>
  );
};
