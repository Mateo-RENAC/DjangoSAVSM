// middleware.js
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname === '/Login' || pathname === '/Logout';
  const isApiRoute = pathname.startsWith('/api') || pathname.startsWith('/panel/api');
  const isStaticAsset = pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname.startsWith('/favicon.ico');

  // Get the token from the request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  console.log('Token:', token);  // Debugging statement to check token

  if (!token && !isAuthPage && !isApiRoute && !isStaticAsset) {
    console.log('Redirecting to /Login');  // Debugging statement
    return NextResponse.redirect(new URL('/Login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!Login|Logout|api|panel/api|_next|static|favicon.ico).*)',
  ],
};
