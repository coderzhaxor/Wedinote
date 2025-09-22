import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from "better-auth/cookies"
 
export function middleware(req: NextRequest) {
  const sessionCookie = getSessionCookie(req);
  const { pathname } = req.nextUrl;

  // Jika akses ke /dashboard dan belum login, redirect ke /login
  if (pathname.startsWith("/dashboard") && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Jika akses ke homepage dan sudah login, redirect ke /dashboard
  if (pathname === "/" && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Jika akses ke homepage dan belum login, tetap di homepage
  return NextResponse.next();
}
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}