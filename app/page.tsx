"use client";
import { useCurrentProjectContext } from "@/contexts/ProjectContext";
import { redirect } from "next/navigation";

export default function Home() {
  const { currentProject } = useCurrentProjectContext();
  redirect(currentProject ? `/feed/${currentProject.slug}` : "/feed");
}
