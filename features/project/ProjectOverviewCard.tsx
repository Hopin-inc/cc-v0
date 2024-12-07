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
          className="flex items-center justify-end hover:underline px-4 pb-2"
        >
          <span className="text-sm font-medium text-muted-foreground mr-1">
            プロジェクト詳細を見る
          </span>
          <ArrowRight className="h-4 w-4 text-primary" />
        </Link>
      </CardContent>
    </Card>
  );
}
