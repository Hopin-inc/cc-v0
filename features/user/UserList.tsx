"use client";

import { Card } from "@/components/ui";
import { useUsers } from "@/hooks/useUsers";
import Link from "next/link";
import { ArrowUpRight, Medal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function UserList() {
  const { data: users } = useUsers();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-muted-foreground">
        メンバー一覧
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users?.map((user) => (
          <Link key={user.id} href={`/u/${user.id}`} className="group">
            <Card className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.thumbnail_url ?? ""} />
                    <AvatarFallback>
                      {user.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-medium group-hover:text-primary">
                      {user.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {user.bio || "自己紹介はまだありません"}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span>{user.total_points ?? 0} ポイント</span>
                      </div>
                      {user.badges && user.badges.length > 0 && (
                        <div className="flex items-center gap-1">
                          {user.badges.map((badge) => (
                            <Badge key={badge.id} variant="weak-secondary">
                              # {badge.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
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
