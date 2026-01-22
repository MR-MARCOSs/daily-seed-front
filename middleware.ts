import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: '/api-backend/:path*',
};

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const newPath = pathname.replace('/api-backend', '');
  const backendUrl = process.env.BACKEND_URL; 

  if (!backendUrl) {
    return NextResponse.json({ error: 'Env var missing' }, { status: 500 });
  }

  const targetUrl = new URL(newPath + request.nextUrl.search, backendUrl);

  try {
    console.log(`Tentando conectar em: ${targetUrl.toString()}`);
    
    
    const response = await fetch(targetUrl.toString(), {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        
        
      },
      
    });

    console.log(`Conexão bem sucedida! Status: ${response.status}`);
    
    
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error: any) {
    
    console.error('Erro de Conexão:', error);
    
    return NextResponse.json({
      erro_diagnostico: 'A Vercel não conseguiu conectar no seu VPS',
      motivo_tecnico: error.message,
      causa: error.cause,
      tentou_conectar_em: targetUrl.toString()
    }, { status: 502 }); 
  }
}