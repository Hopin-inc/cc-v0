import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

export type AvatarGroupUser = {
  id: string;
  name: string;
  thumbnailUrl?: string;
};

type AvatarGroupProps = {
  users: AvatarGroupUser[];
  limit?: number;
  className?: string;
};

export function AvatarGroup({
  users,
  limit = 3,
  className = "",
}: AvatarGroupProps) {
  const displayUsers = users.slice(0, limit);
  const remainingCount = Math.max(0, users.length - limit);

  return (
    <div className={`flex -space-x-2 ${className}`}>
      <TooltipProvider>
        {displayUsers.map((user, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Link href={`/u/${user.id}`}>
                <Avatar className="border-2 border-background hover:translate-y-[-2px] transition-transform">
                  {user.thumbnailUrl ? (
                    <AvatarImage src={user.thumbnailUrl} alt={user.name} />
                  ) : (
                    <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                  )}
                </Avatar>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{user.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        {remainingCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="border-2 border-background hover:translate-y-[-2px] transition-transform">
                <AvatarFallback>+{remainingCount}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>他{remainingCount}人が参加</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
}
