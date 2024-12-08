import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";
import { getSession } from "next-auth/react";
// middleware/roleProtection.js
import { NextResponse } from 'next/server';

export function middleware(req) {
    const role = req.cookies.get('role'); // Mendapatkan role pengguna
    const { pathname } = req.nextUrl;

    // Cek akses untuk folder admin
    if (pathname.startsWith('/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // Cek akses untuk folder seller
    if (pathname.startsWith('/artist') && role !== 'artist') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.next();
}


export const authMiddleware = async (req, res, next) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.user = session.user;
  next();
};

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