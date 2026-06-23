import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // 1. Status Protection
    // If user is not "APPROVED", they should be restricted to the account-issue page
    // except if they are already going there.
    const isApproved = token?.status === "APPROVED";
    const isRestrictedPath = path.startsWith("/dashboard/restricted");

    if (!isApproved && path.startsWith("/dashboard") && !isRestrictedPath) {
       return NextResponse.redirect(new URL("/dashboard/restricted", req.url));
    }

    // 2. Role-Based Dashboard Routing (Root redirection)
    if (path === "/dashboard") {
       if (token?.role === "MENTOR") {
          return NextResponse.redirect(new URL("/dashboard/mentor?v=2", req.url));
       }
       if (token?.role === "ADMIN") {
          return NextResponse.redirect(new URL("/dashboard/admin", req.url));
       }
       // Students stay at /dashboard
    }

    // 3. Path Access Protection
    // Mentors only access /dashboard/mentor
    if (path.startsWith("/dashboard/mentor") && token?.role !== "MENTOR" && token?.role !== "ADMIN") {
       return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Admin only access /dashboard/admin
    if (path.startsWith("/dashboard/admin") && token?.role !== "ADMIN") {
       return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
