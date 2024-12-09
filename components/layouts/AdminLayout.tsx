"use client";

import { Notifications } from "@/features/notifications/Notifications";
import { DEFAULT_PROJECT } from "@/config";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const sidebarItems = [
  {
    label: "申請管理",
    href: "/admin/activity",
  },
  {
    label: "活動管理",
    href: "/admin/activities",
  },
  {
    label: "ゆる募管理",
    href: "/admin/recruitments",
  },
  {
    label: "活動種別管理",
    href: "/admin/contribution-types",
  },
  {
    label: "バッジ管理",
    href: "/admin/badges",
  },
] as const;

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 bg-background border-b z-50 h-14">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center space-x-2"
            aria-label="ホームページへ"
          >
            <img
              src={DEFAULT_PROJECT.thumbnail_url}
              className="w-7 h-7 rounded-full flex-shrink-0"
              alt="logo"
            />
            <h1 className="text-lg font-bold text-foreground">
              {DEFAULT_PROJECT.name}
            </h1>
          </Link>
          <Notifications />
        </div>
      </header>
      <div className="flex mt-14">
        <aside className="w-64 fixed left-0 top-14 h-[calc(100vh-3.5rem)] border-r bg-background">
          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block px-4 py-2 rounded-md transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="ml-64 flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
