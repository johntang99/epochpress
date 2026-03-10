// ============================================
// MIDDLEWARE - Admin Auth & Domain Routing
// Epoch Press does not use locale-based routing.
// All public routes are plain (/, /products, /about, etc.)
// ============================================

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // EN should use the main site, not the landing route.
  if (pathname === '/lp/en' || pathname.startsWith('/lp/en/')) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Admin routes: require auth cookie
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  // Pass all other routes through without locale redirect
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|uploads).*)',
  ],
};
