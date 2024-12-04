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
