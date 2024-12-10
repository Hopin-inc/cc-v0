import { ProjectPage } from "@/features/project/ProjectPage";

export default function ProjectDetailPage({
  params,
}: {
  params: { project_slug: string };
}) {
  return <ProjectPage projectSlug={params.project_slug} />;
}
