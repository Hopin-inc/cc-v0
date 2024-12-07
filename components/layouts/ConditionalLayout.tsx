"use client";

import { usePathname } from "next/navigation";
import { LayoutWrapper } from "./LayoutWrapper";
import { AdminLayout } from "./AdminLayout";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  return <LayoutWrapper>{children}</LayoutWrapper>;
}
