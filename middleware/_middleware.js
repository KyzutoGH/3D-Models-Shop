// middleware.js
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname;
    const token = req.nextauth.token;

    if (pathname.startsWith("/login") && token) {
      const role = token.role;
      let redirectUrl = "/member/profile";
      
      if (role === "admin") {
        redirectUrl = "/admin/dashboard";
      }
      if (role === "artist") {
        redirectUrl = "/artist/profile";
      }
      
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: function({ req, token }) {
        if (req.nextUrl.pathname.startsWith("/login")) {
          return true;
        }
        return Boolean(token);
      }
    }
  }
);

export const config = {
  matcher: ["/login", "/member/:path*", "/admin/:path*", "/artist/:path*"]
};