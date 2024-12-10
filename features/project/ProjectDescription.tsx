import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Link from "next/link";
import { ProjectType } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_PROJECT } from "@/config";
import {
  Globe2 as Globe,
  Facebook,
  Twitter,
  Instagram,
  FileText,
} from "lucide-react";
import { useCurrentProjectContext } from "@/contexts/ProjectContext";
import { useJoinProject } from "@/hooks/useJoinProject";
import { Users } from "lucide-react";
import { useEffect } from "react";

type ProjectDescriptionProps = {
  isLoading: boolean;
  project: ProjectType | null;
};

export function ProjectDescription({
  isLoading,
  project,
}: ProjectDescriptionProps) {
  const { currentProject } = useCurrentProjectContext();
  const {
    isLoading: isJoinLoading,
    isJoined,
    joinProject,
    checkJoinStatus,
  } = useJoinProject(currentProject?.id ?? "");

  useEffect(() => {
    if (currentProject?.id) {
      checkJoinStatus();
    }
  }, [currentProject?.id, checkJoinStatus]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
          <div className="flex items-center justify-between mt-8">
            <div className="flex space-x-3">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-muted-foreground/80">
          プロジェクト概要
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-base text-foreground mb-4">
          {project?.description || DEFAULT_PROJECT.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex space-x-3">
            {DEFAULT_PROJECT.links.map((link) => {
              const Icon =
                {
                  homepage: Globe,
                  facebook: Facebook,
                  twitter: Twitter,
                  instagram: Instagram,
                  blog: FileText,
                }[link.service] || Globe;

              return (
                <Link
                  key={link.service}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.service}
                >
                  <Icon className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                </Link>
              );
            })}
          </div>
          <Button
            onClick={joinProject}
            className="w-auto text-base"
            disabled={isJoinLoading || isJoined}
          >
            <Users className="mr-2 h-4 w-4" />
            {isJoined ? "参加中" : "参加する"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
