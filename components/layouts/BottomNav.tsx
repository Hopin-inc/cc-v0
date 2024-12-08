"use client";

import { usePathname } from "next/navigation";
import { Home, User } from "lucide-react";
import Link from "next/link";
import { useCurrentUserContext } from "@/contexts/UserContext";

export function BottomNav() {
  const pathname = usePathname();
  const { currentUser } = useCurrentUserContext();

  return (
    <nav className="bg-background border-t">
      <div className="flex justify-around">
        <Link
          href={"/"}
          className={`flex flex-col items-center p-2 ${
            pathname === "/" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">ホーム</span>
        </Link>
        <Link
          href={currentUser?.id ? `/u/${currentUser?.id}` : `/login`}
          className={`flex flex-col items-center p-2 ${
            pathname.startsWith("/u") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">プロフィール</span>
        </Link>
      </div>
    </nav>
  );
}
