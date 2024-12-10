"use client";

import { Notifications } from "@/features/notifications/Notifications";
import { DEFAULT_PROJECT } from "@/config";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { ProjectSelector } from "@/components/project/ProjectSelector";

interface AdminLayoutProps {
  children: React.ReactNode;
}

type AdminPath =
  | "activity"
  | "activities"
  | "recruitments"
  | "contribution-types"
  | "badges"
  | "project-prize-items";

interface SidebarItem {
  label: string;
  path: AdminPath;
}

const sidebarItems: SidebarItem[] = [
  {
    label: "申請管理",
    path: "activity",
  },
  {
    label: "活動管理",
    path: "activities",
  },
  {
    label: "ゆる募管理",
    path: "recruitments",
  },
  {
    label: "活動種別管理",
    path: "contribution-types",
  },
  {
    label: "バッジ管理",
    path: "badges",
  },
  {
    label: "特典管理",
    path: "project-prize-items",
  },
] as const;

const getAdminPath = (projectId: string, path: AdminPath) => {
  return `/admin/${projectId}/${path}`;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const projectId = pathname.split("/")[2]; // Extract project_id from URL

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 bg-background border-b z-50 h-14">
        <div className="max-w-screen-2xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-4">
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
            <ProjectSelector />
          </div>
          <Notifications />
        </div>
      </header>
      <div className="pt-14 flex">
        <aside className="w-64 fixed left-0 top-14 bottom-0 bg-background border-r">
          <nav className="p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const href = getAdminPath(projectId, item.path);
                console.log(href, projectId, item.path);  
                return (
                  <li key={item.path}>
                    <Link
                      href={href}
                      className={cn(
                        "block px-4 py-2 rounded-md text-sm font-medium transition-colors",
                        pathname === href
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
        <main className="flex-1 ml-64">
          <div className="max-w-screen-xl mx-auto p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
