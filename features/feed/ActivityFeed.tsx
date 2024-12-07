import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const activities = [
  {
    id: 1,
    date: "2023-05-15",
    photos: ["/placeholder.svg?height=100&width=100"],
    user: "田中さん",
    action: "清掃活動をしました",
  },
  {
    id: 2,
    date: "2023-05-14",
    photos: [
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
    ],
    user: "佐藤さん",
    action: "イベント運営に参加しました",
  },
];

export function ActivityFeed() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-2">
              {activity.date}
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {activity.photos.map((photo, index) => (
                <Image
                  key={index}
                  src={photo}
                  alt="活動の写真"
                  width={100}
                  height={100}
                  className="rounded-md"
                />
              ))}
            </div>
            <p className="text-sm">
              {activity.user}が{activity.action}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
