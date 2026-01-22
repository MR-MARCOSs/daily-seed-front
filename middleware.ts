import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  
  matcher: '/api-backend/:path*',
};

export default function middleware(request: NextRequest) {
  
  const pathname = request.nextUrl.pathname;
  const newPath = pathname.replace('/api-backend', ''); 
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return NextResponse.json(
      { error: 'BACKEND_URL not defined in environment variables' },
      { status: 500 }
    );
  }
  
  const targetUrl = new URL(newPath + request.nextUrl.search, backendUrl);

  return NextResponse.rewrite(targetUrl);
}