import { getSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const session = await getSession({ req });
  const { pathname } = req.nextUrl;

  // Jika tidak ada token, arahkan ke halaman login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Periksa apakah pengguna sudah login
  if (!session) {
    // Jika belum login, arahkan ke halaman login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role-specific redirects or page access control
  if (pathname.startsWith("/admin") && token.role !== "admin") {
    if (session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/error401", req.url)); // Jika bukan admin, arahkan ke profil
    }
  }

  if (pathname.startsWith("/artist") && token.role !== "artist") {
    if (session.user.role !== "artist") {
      return NextResponse.redirect(new URL("/error401", req.url)); // Jika bukan seller, arahkan ke profil
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard", "/artist/profile", "/member/profile"],
};