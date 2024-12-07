import {
  ProjectStats,
  ProjectDescription,
  ProjectParticipants,
  ProjectTimeline,
  ProjectActivities,
} from "@/features/project";

export default function Project() {
  return (
    <div className="space-y-8 mt-6 pb-20">
      <ProjectDescription />
      <ProjectStats />
      <ProjectParticipants />
      <ProjectActivities />
      <ProjectTimeline />
    </div>
  );
}
