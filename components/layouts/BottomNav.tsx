"use client";

import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, User } from "lucide-react";
import Link from "next/link";
import { useCurrentUserContext } from "@/contexts/UserContext";

export function BottomNav() {
  const pathname = usePathname();
  const { currentUser } = useCurrentUserContext();

  const navigation = [
    {
      name: "ホーム",
      href: "/feed",
      icon: Home,
      current: pathname === "/feed",
    },
    {
      name: "探す",
      href: "/projects",
      icon: Search,
      current: pathname === "/projects",
    },
    {
      name: "マイページ",
      href: currentUser?.id ? `/u/${currentUser?.id}` : `/login`,
      icon: User,
      current: pathname.startsWith("/u"),
    },
  ];

  return (
    <nav className="bg-background border-t">
      <div className="flex justify-around">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center p-4 min-w-[64px] ${
              item.current
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
