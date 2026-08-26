import { NextResponse } from 'next/server';

// Gates the entire site behind a themed login page (pages/login.js).
// Session is a signed cookie set by /api/login after checking
// SITE_USERNAME / SITE_PASSWORD (server env).
async function sha256Hex(text) {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

const PUBLIC_PATHS = ['/login', '/api/login'];

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next();
  }

  const user = process.env.SITE_USERNAME || 'neoadmin';
  const pass = process.env.SITE_PASSWORD || 'Neo@2026';
  const secret = process.env.SESSION_SECRET || 'ns-dev-secret-change-me';
  const expected = await sha256Hex(`${user}:${pass}:${secret}`);

  const cookie = req.cookies.get('ns_auth')?.value;
  if (cookie === expected) {
    return NextResponse.next();
  }

  const loginUrl = new URL('/login', req.url);
  loginUrl.searchParams.set('next', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
