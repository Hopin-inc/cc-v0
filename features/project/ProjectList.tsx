"use client";

import { Card } from "@/components/ui";
import { useProjects } from "@/hooks/useProjects";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function ProjectList() {
  const { data: projects } = useProjects();

  return (
    <div className="space-y-4 pb-20">
      <h2 className="text-xl font-semibold text-muted-foreground">
        プロジェクト一覧
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects?.map((project) => (
          <Link
            key={project.id}
            href={`/p/${project.slug}`}
            className="group"
          >
            <Card className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium group-hover:text-primary">
                    {project.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {project.description}
                  </p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
