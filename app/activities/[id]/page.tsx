import { ActivityDetail } from "@/features/activities/ActivityDetail";

type ActivityPageProps = {
  params: {
    id: string;
  };
};

export default function ActivityPage({ params }: ActivityPageProps) {
  return (
    <main className="container py-8">
      <ActivityDetail activityId={params.id} />
    </main>
  );
}
