import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes
const protectedRoutes = [
  '/dashboard',
  '/dashboard/inventory',
  '/dashboard/leads',
  '/dashboard/rentals',
  '/dashboard/analytics'
];

// Define public routes that should be accessible
const publicRoutes = [
  '/',
  '/login',
  '/about',
  '/contact',
  '/inventory',
  '/rentals',
  '/financing',
  '/auctions',
  '/api',
  '/_next'
];

export function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url);
  
  // Check if the path is public
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Check if the path is protected
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // Check if user is authenticated (in real app, use proper session/cookie management)
    const isAuthenticated = request.cookies.get('isAuthenticated')?.value;
    
    if (!isAuthenticated) {
      // Redirect to login page
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
