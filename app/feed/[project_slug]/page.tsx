import { Feed } from "@/features/feed/Feed";

export default function FeedPage({
  params,
}: {
  params: { project_slug: string };
}) {
  return <Feed projectSlug={params.project_slug} />;
}
