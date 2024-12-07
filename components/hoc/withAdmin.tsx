import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCurrentUserContext } from "@/contexts/UserContext";

export function withAdmin<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAdminComponent(props: P) {
    const router = useRouter();
    const { currentUser, isLoading } = useCurrentUserContext();
    const isAdmin = currentUser?.role === "admin";

    useEffect(() => {
      if (currentUser && !isAdmin) {
        router.replace("/");
      }
    }, [currentUser, isAdmin]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAdmin) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
