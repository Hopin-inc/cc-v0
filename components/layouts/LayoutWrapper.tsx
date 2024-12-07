"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/layouts";
import { Notifications } from "@/features/notifications/Notifications";
import { DEFAULT_PROJECT_NAME } from "@/config";
import { useCurrentProjectContext } from "@/contexts/ProjectContext";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const { currentProject } = useCurrentProjectContext();
  const isActivityApplyPage = pathname === "/activity/apply";

  return (
    <div className="max-w-lg mx-auto relative min-h-screen">
      {!isActivityApplyPage && (
        <header className="fixed top-0 left-0 right-0 bg-background border-b z-50 h-14">
          <div className="max-w-lg mx-auto px-4 py-2 flex justify-between items-center">
            <Link
              href="/"
              className="flex items-center space-x-2"
              aria-label="ホームページへ"
            >
              <div className="w-7 h-7 bg-primary rounded-full flex-shrink-0"></div>
              <h1 className="text-lg font-bold text-foreground">
                {currentProject?.name || DEFAULT_PROJECT_NAME}
              </h1>
            </Link>
            <Notifications />
          </div>
        </header>
      )}
      <main className={`px-4 ${isActivityApplyPage ? "" : "pb-16 mt-20"}`}>
        {children}
      </main>
      {!isActivityApplyPage && (
        <div className="fixed bottom-0 left-0 right-0 bg-background z-50">
          <div className="max-w-lg mx-auto">
            <BottomNav />
          </div>
        </div>
      )}
    </div>
  );
}
