import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectStats } from "@/features/project";
import { useCurrentProjectContext } from "@/contexts/ProjectContext";
import { DEFAULT_PROJECT } from "@/config";

export function ProjectOverviewCard() {
  const { currentProject } = useCurrentProjectContext();
  return (
    <div className="border-0 shadow-none mb-4">
      <div className="space-y-4 p-0">
        <ProjectStats />
        <Link
          href={`/p/${currentProject?.slug || DEFAULT_PROJECT.slug}`}
          className="flex items-center justify-end pb-2 group transition-transform duration-200 hover:-translate-y-0.5"
        >
          <span className="text-sm font-medium text-muted-foreground group-hover:text-primary group-hover:underline mr-1">
            プロジェクト詳細
          </span>
          <ArrowRight className="h-4 w-4 text-primary" />
        </Link>
      </div>
    </div>
  );
}
