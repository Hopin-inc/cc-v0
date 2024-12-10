"use client";

import { ProjectType } from "@/types";
import { createContext, useContext, ReactNode } from "react";
import { useCurrentProject } from "@/hooks/useCurrentProject";

type ProjectContextType = {
  setCurrentProject: (project: ProjectType) => void;
  currentProject: ProjectType | null;
  isLoading: boolean;
  error: Error | null;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const { currentProject, setCurrentProject, isLoading, error } =
    useCurrentProject();

  return (
    <ProjectContext.Provider
      value={{
        setCurrentProject,
        currentProject,
        isLoading,
        error,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useCurrentProjectContext = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
