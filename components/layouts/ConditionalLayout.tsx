"use client";

import { usePathname } from "next/navigation";
import { LayoutWrapper } from "./LayoutWrapper";
import { AdminLayout } from "./AdminLayout";
import { ScrollToTop } from "@/components/functional/ScrollToTop";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <AdminLayout>
        <ScrollToTop />
        {children}
      </AdminLayout>
    );
  }

  return (
    <LayoutWrapper>
      <ScrollToTop />
      {children}
    </LayoutWrapper>
  );
}
