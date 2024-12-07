import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const session = await getSession({ req });
  const { pathname } = req.nextUrl;

  // If there's no session, redirect to login page
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role-based redirects or page access control
  if (pathname.startsWith("/admin") && session.user.role !== "admin") {
    return NextResponse.redirect(new URL("/error401", req.url));
  }

  if (pathname.startsWith("/artist") && session.user.role !== "artist") {
    return NextResponse.redirect(new URL("/error401", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard", "/artist/profile", "/member/profile"],
};
