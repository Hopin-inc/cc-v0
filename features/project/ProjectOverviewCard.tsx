import Link from "next/link";
import { Card, CardContent } from "@/components/ui";
import { ArrowRight } from "lucide-react";
import { ProjectStats } from "@/features/project";

export function ProjectOverviewCard() {
  return (
    <Card className="border-0 shadow-none mb-4">
      <CardContent className="space-y-4 p-0">
        <ProjectStats />
        <Link
          href="/project"
          className="flex items-center justify-end pb-2 group transition-transform duration-200 hover:-translate-y-0.5"
        >
          <span className="text-sm font-medium text-muted-foreground group-hover:text-primary group-hover:underline mr-1">
            プロジェクト詳細
          </span>
          <ArrowRight className="h-4 w-4 text-primary" />
        </Link>
      </CardContent>
    </Card>
  );
}
