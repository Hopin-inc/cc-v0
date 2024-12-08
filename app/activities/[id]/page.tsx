import { ActivityDetail } from "@/features/activities/ActivityDetail";

type ActivityPageProps = {
  params: {
    id: string;
  };
};

export default function ActivityPage({ params }: ActivityPageProps) {
  return (
    <main className="py-2">
      <ActivityDetail activityId={params.id} />
    </main>
  );
}
