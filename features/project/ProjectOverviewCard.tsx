import { Card } from "@/components/ui";
import Link from "next/link";
import { ProjectStats } from "@/features/project";
import { DEFAULT_PROJECT } from "@/config";
import { ArrowUpRight } from "lucide-react";
import { FeedItem } from "@/types";

type ProjectPageProps = {
  projectSlug: string | undefined;
  feedItems: FeedItem[];
};

export function ProjectOverviewCard({
  projectSlug,
  feedItems,
}: ProjectPageProps) {
  return (
    <div className="border-0 shadow-none mb-4">
      <div className="space-y-4 p-0">
        <ProjectStats feedItems={feedItems} />
        <div className="flex items-center justify-end pb-2">
          <Link
            href={`/p/${projectSlug || DEFAULT_PROJECT.slug}`}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary group transition-transform duration-200"
          >
            プロジェクト詳細
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
