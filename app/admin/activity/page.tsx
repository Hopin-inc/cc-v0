"use client";

import { withAdmin } from "@/components/hoc/withAdmin";
import { ActivityManagement } from "@/features/admin/ActivityManagement";

function AdminActivityPage() {
  return (
    <div>
      <h1>Activity Admin</h1>
      <ActivityManagement />
    </div>
  );
}

export default withAdmin(AdminActivityPage);
