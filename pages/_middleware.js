import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const session = await getSession({ req });
  const { pathname } = req.nextUrl;

  // Periksa apakah pengguna sudah login
  if (!session) {
    // Jika belum login, arahkan ke halaman login
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // Role-specific redirects or page access control
  if (pathname.startsWith("/admin")) {
    if (session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/error401", req.url)); // Jika bukan admin, arahkan ke profil
    }
  }

  if (pathname.startsWith("/artist")) {
    if (session.user.role !== "artist") {
      return NextResponse.redirect(new URL("/error401", req.url)); // Jika bukan seller, arahkan ke profil
    }
  }

  return NextResponse.next();
}
