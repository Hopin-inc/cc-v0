"use client";

import { ProjectList } from "@/features/project/ProjectList";
import { UserList } from "@/features/user/UserList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProjectsPage() {
  return (
    <div className="space-y-4 pb-20">
      <Tabs defaultValue="projects">
        <TabsList className="w-full">
          <TabsTrigger value="projects" className="flex-1">
            プロジェクト
          </TabsTrigger>
          <TabsTrigger value="users" className="flex-1">
            メンバー
          </TabsTrigger>
        </TabsList>
        <TabsContent value="projects" className="mt-6">
          <ProjectList />
        </TabsContent>
        <TabsContent value="users" className="mt-6">
          <UserList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
