import { Card, CardContent } from "@/components/ui/card";
import { Users, Award } from "lucide-react";

const stats = [
  { title: "総動員数", value: 1234, unit: "人", icon: Users, change: "+12%" },
  {
    title: "総配布ポイント数",
    value: 98765,
    unit: "pt",
    icon: Award,
    change: "+8%",
  },
];

export function ProjectStats() {
  return (
    <div className="grid gap-4 grid-cols-2">
      {stats.map((stat, index) => (
        <Card key={index} className="flex flex-col justify-between p-3 pb-2">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-primary/10 rounded-full">
              <stat.icon className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              {" "}
              {/* Updated title font size and color */}
              {stat.title}
            </p>
          </div>
          <div className="mt-1 pl-9 mb-1">
            <div className="text-lg font-bold text-foreground">
              {" "}
              {/* Updated value font size */}
              {stat.value.toLocaleString()}
              <span className="text-xs font-normal text-muted-foreground ml-1">
                {stat.unit}
              </span>
            </div>
            <p className="text-sm font-medium text-green-600">
              {" "}
              {/* Updated change font size and color */}
              {stat.change}
              <span className="text-[10px] text-muted-foreground ml-1">
                先月比
              </span>
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
