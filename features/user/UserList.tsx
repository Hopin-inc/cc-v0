"use client";

import { Card } from "@/components/ui";
import { useUsers } from "@/hooks/useUsers";
import Link from "next/link";
import { ArrowUpRight, Users, Trophy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function UserList() {
  const { data: users } = useUsers();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-muted-foreground">
        メンバー一覧
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {users?.map((user) => (
          <Link key={user.id} href={`/u/${user.id}`} className="group">
            <Card className="relative p-6 hover:bg-muted/50 transition-all duration-200 hover:shadow-md">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={user.thumbnail_url ?? ""} />
                  <AvatarFallback>
                    {user.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-lg group-hover:text-primary truncate">
                      {user.name}
                    </h3>
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground/0 group-hover:text-primary transition-all duration-200 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-2">
                    {user.bio || "自己紹介はまだありません"}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="weak-secondary">
                      {user.total_points ?? 0} pt
                    </Badge>
                    {user.badges && user.badges.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1">
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
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
