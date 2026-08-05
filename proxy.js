import { NextResponse } from "next/server";

export function proxy(request) {
  const token = request.cookies.get("adminToken")?.value;
  const { pathname } = request.nextUrl;

  // Intercept all routes starting with /admin
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";

    // If hitting exactly '/admin', redirect based on credentials
    if (pathname === "/admin") {
      const destination = token ? "/admin/dashboard" : "/admin/login";
      return NextResponse.redirect(new URL(destination, request.url));
    }

    // Redirect to login if accessing a protected sub-page without token
    if (!isLoginPage && !token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Redirect to dashboard if logged in and attempting to access login page
    if (isLoginPage && token) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
