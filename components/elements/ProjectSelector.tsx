import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjects } from "@/hooks/useProjects";

export const ProjectSelector = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const { data: projects } = useProjects();

  const handleValueChange = useCallback(
    (value: string) => {
      router.push(`/admin/${value}/activity`);
    },
    [router]
  );

  return (
    <div className="w-64">
      <Select value={projectId as string} onValueChange={handleValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="プロジェクトを選択" />
        </SelectTrigger>
        <SelectContent>
          {projects?.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
