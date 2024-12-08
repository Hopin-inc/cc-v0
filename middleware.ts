import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(request: NextRequest) {
  const supabase = createMiddlewareClient({
    req: request,
    res: NextResponse.next(),
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Handle admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!session) {
      // Not authenticated, redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Check if user has admin role
    const { data: userRole } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (userRole?.role !== "admin") {
      // Not an admin, redirect to home or show forbidden
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/admin/:path*"],
};
