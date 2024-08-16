import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const { pathname } = req.nextUrl;

  // Public routes
  const publicRoutes = ["/", "/kyc"];

  // Get user information from local storage
  const isLoggedIn = req.cookies.get("isLoggedIn")?.value;
  const userRole = req.cookies.get("userRole")?.value;

  // Check if the user is not logged in and tries to access protected routes
  if (!isLoggedIn && !publicRoutes.includes(pathname)) {
    url.pathname = "/";
    url.searchParams.set("showModal", "true");
    return NextResponse.redirect(url);
  }

  // Check if the user is trying to access a route without appropriate role
  if (pathname.startsWith("/admin") && userRole !== "admin") {
    url.pathname = "/";
    url.searchParams.set("showModal", "true");
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith("/invest") && userRole !== "user") {
    url.pathname = "/";
    url.searchParams.set("showModal", "true");
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith("/allowlist") && userRole !== "guardian") {
    url.pathname = "/";
    url.searchParams.set("showModal", "true");
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith("/assetsender") && userRole !== "assetsender") {
    url.pathname = "/";
    url.searchParams.set("showModal", "true");
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith("/portfolio") && userRole !== "user") {
    url.pathname = "/";
    url.searchParams.set("showModal", "true");
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith("/profile") && !isLoggedIn) {
    url.pathname = "/";
    url.searchParams.set("showModal", "true");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/invest/:path*",
    "/allowlist/:path*",
    "/assetsender/:path*",
    "/portfolio/:path*",
    "/profile/:path*",
  ],
};
