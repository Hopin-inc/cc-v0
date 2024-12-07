"use client";

import { useEffect, ComponentType } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";

export function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  return function WithAuthComponent(props: P) {
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const { session } = await authService.getSession();
          if (!session) {
            router.push("/login");
          }
        } catch (error) {
          router.push("/login");
        }
      };
      checkAuth();
    }, [router]);

    return <WrappedComponent {...props} />;
  };
}
