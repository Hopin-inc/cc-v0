"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_PROJECT } from "@/config";
import { useProjects } from "@/hooks/useProjects";

export default function AdminRootPage() {
  const router = useRouter();
  const { data: projects, isLoading } = useProjects();

  useEffect(() => {
    if (isLoading) return;
    // If projects are loaded, redirect to the first project's admin page
    // or use DEFAULT_PROJECT if no projects are available
    const firstProject = projects?.[0] || DEFAULT_PROJECT;
    router.replace(`/admin/${firstProject.id}/activity`);
  }, [projects, isLoading, router]);

  return null; // This page will redirect immediately, so no need to render anything
}
