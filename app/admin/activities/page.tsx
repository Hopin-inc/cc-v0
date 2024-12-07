"use client";

import { withAdmin } from "@/components/hoc/withAdmin";
import { ActivitiesManagement } from "@/features/admin/activities/ActivitiesManagement";

function AdminActivitiesPage() {
  return (
    <div>
      <h1>Activities Admin</h1>
      <ActivitiesManagement />
    </div>
  );
}

export default withAdmin(AdminActivitiesPage);
