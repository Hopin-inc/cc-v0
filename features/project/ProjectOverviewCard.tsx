import { Card } from "@/components/ui";
import Link from "next/link";
import { ProjectStats } from "@/features/project";
import { useCurrentProjectContext } from "@/contexts/ProjectContext";
import { DEFAULT_PROJECT } from "@/config";
import { useFeedState } from "@/hooks/useFeedState";
import { ArrowUpRight } from "lucide-react";

type ProjectPageProps = {
  projectSlug: string | undefined;
};

export function ProjectOverviewCard({ projectSlug }: ProjectPageProps) {
  const { currentProject } = useCurrentProjectContext();
  const { feedItems } = useFeedState(
    projectSlug ? currentProject?.id : undefined
  );

  return (
    <div className="border-0 shadow-none mb-4">
      <div className="space-y-4 p-0">
        <ProjectStats feedItems={feedItems} />
        <div className="flex items-center justify-end pb-2">
          <Link
            href={`/p/${currentProject?.slug || DEFAULT_PROJECT.slug}`}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary group transition-transform duration-200"
          >
            プロジェクトの詳細を見る
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
