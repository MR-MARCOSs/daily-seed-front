import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: '/api-backend/:path*',
};

export default function middleware(request: NextRequest) {
  
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    
    return NextResponse.json(
      { error: 'BACKEND_URL config missing' },
      { status: 500 }
    );
  }
  
  const pathname = request.nextUrl.pathname;
  const newPath = pathname.replace(/^\/api-backend/, '');
  const targetUrl = new URL(newPath + request.nextUrl.search, backendUrl);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('Host', new URL(backendUrl).host);
  requestHeaders.set('X-Forwarded-Proto', 'https');

  return NextResponse.rewrite(targetUrl, {
    request: {
      headers: requestHeaders,
    },
  });
}