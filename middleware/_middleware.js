import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname;
    const token = req.nextauth.token;

    if (pathname.startsWith("/login") && token) {
      const redirectUrl = token.role === "admin" ? "/admin/dashboard" 
                       : token.role === "artist" ? "/artist/dashboard"
                       : "/member";
      
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }

    if (pathname.startsWith("/artist") && token?.role !== "artist") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (pathname.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (req.nextUrl.pathname.startsWith("/login")) {
          return true;
        }
        return Boolean(token);
      }
    }
  }
);

export const config = {
  matcher: [
    "/login",
    "/member/:path*",
    "/admin/:path*",
    "/artist/:path*"
  ]
};