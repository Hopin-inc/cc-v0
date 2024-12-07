"use client";

import { withAdmin } from "@/components/hoc/withAdmin";
import { ContributionTypeManagement } from "@/features/admin/contribution-type/ContributionTypeManagement";

function AdminContributionTypesPage() {
  return (
    <div>
      <h1>Contribution Types Admin</h1>
      <ContributionTypeManagement />
    </div>
  );
}

export default withAdmin(AdminContributionTypesPage);
