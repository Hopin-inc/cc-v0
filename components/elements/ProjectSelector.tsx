"use client";

import { useRouter, usePathname, useParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjects } from "@/hooks/useProjects";
import { useCallback } from "react";

export const ProjectSelector = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const projectId = params.project_id as string;
  const { data: projects, isLoading } = useProjects();

  const isAdminRoute = pathname.startsWith("/admin");

  const handleValueChange = useCallback(
    (value: string) => {
      if (isAdminRoute) {
        router.push(`/admin/${value}/activity`);
      } else {
        router.push(`/`);
      }
    },
    [router, isAdminRoute]
  );

  if (isLoading || !projects?.length) {
    return null;
  }

  const currentProject = projects.find((p) => p.id === projectId);

  if (!currentProject) return null;

  return (
    <div className="w-64">
      <Select value={currentProject.id} onValueChange={handleValueChange}>
        <SelectTrigger>
          <SelectValue>
            <div className="flex items-center space-x-2">
              {/* <img
                src={currentProject}
                alt={currentProject.name}
                className="w-4 h-4 rounded-full"
              /> */}
              <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs text-primary-foreground font-bold">
                  {currentProject.name.split("")[0]}
                </span>
              </div>
              <span>{currentProject.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs text-primary-foreground font-bold">
                    {currentProject.name.split("")[0]}
                  </span>
                </div>
                <span>{project.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
