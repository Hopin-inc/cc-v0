import { useState } from "react";
import { userProjectsService } from "@/services/userProjects";
import { toast } from "sonner";

export const useJoinProject = (projectId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  const checkJoinStatus = async () => {
    try {
      const joined = await userProjectsService.isJoined(projectId);
      setIsJoined(joined);
    } catch (error) {
      console.error("Failed to check join status:", error);
    }
  };

  const joinProject = async () => {
    setIsLoading(true);
    try {
      await userProjectsService.joinProject(projectId);
      setIsJoined(true);
      toast.success("プロジェクトに参加しました！");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("プロジェクトへの参加に失敗しました");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isJoined,
    joinProject,
    checkJoinStatus,
  };
};
