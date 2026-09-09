import { NextRequest, NextResponse } from 'next/server';
const admin = false;
const login = admin ? '/auth/login' : '/giris';
export async function middleware(req: NextRequest) {
  const response=NextResponse.next();
  response.headers.set('X-Content-Type-Options','nosniff');
  response.headers.set('Referrer-Policy','strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy','camera=(), microphone=(), geolocation=(self)');
  response.headers.set('Content-Security-Policy',[
    "default-src 'self'", "base-uri 'self'", "object-src 'none'", "frame-ancestors 'self'",
    "script-src 'self' 'unsafe-inline' " + (process.env.NODE_ENV==='development'?"'unsafe-eval' ":'') + "https://*.iyzipay.com https://*.iyzico.com https://www.paytr.com https://maps.googleapis.com https://maps.gstatic.com https://accounts.google.com https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", "img-src 'self' data: blob: https:", "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https: " + (process.env.NODE_ENV==='development'?'http://localhost:* http://127.0.0.1:* ws:':''),
    "frame-src 'self' https://www.openstreetmap.org https://*.iyzipay.com https://*.iyzico.com https://www.paytr.com https://www.google.com https://accounts.google.com https://www.youtube.com",
    "media-src 'self' https: blob:", "form-action 'self' https://*.iyzipay.com https://*.iyzico.com https://www.paytr.com"
  ].join('; '));
  const privateRoute=admin?req.nextUrl.pathname.startsWith('/admin'):req.nextUrl.pathname.startsWith('/panel')||req.nextUrl.pathname.startsWith('/dashboard')||req.nextUrl.pathname==='/ilan-ver';
  if (admin || privateRoute || req.nextUrl.pathname.includes('giris') || req.nextUrl.pathname.includes('auth')) response.headers.set('X-Robots-Tag','noindex, nofollow');
  if (!privateRoute) return response;
  response.headers.set('Cache-Control','private, no-store');
  const base=(process.env.API_INTERNAL_URL??'http://127.0.0.1:8070').replace(/\/$/,'');
  const headers={cookie:req.headers.get('cookie')??''};
  try {
    let user=await fetch(`${base}/api/auth/user`,{headers,cache:'no-store',signal:AbortSignal.timeout(5000)});
    if(user.status===401 && req.cookies.has('refresh_token')) {
      const refreshed=await fetch(`${base}/api/auth/token/refresh`,{method:'POST',headers,cache:'no-store',signal:AbortSignal.timeout(5000)});
      if(refreshed.ok){const body=await refreshed.json();user=await fetch(`${base}/api/auth/user`,{headers:{authorization:`Bearer ${body.access_token}`},cache:'no-store'});for(const cookie of refreshed.headers.getSetCookie())response.headers.append('set-cookie',cookie);}
    }
    if(user.status===401){const url=new URL(login,process.env.NODE_ENV==='production'?(admin?'https://panel.paketjet.com':process.env.NEXT_PUBLIC_SITE_URL||'https://paketjet.com'):req.url);url.searchParams.set('next',req.nextUrl.pathname+req.nextUrl.search);return NextResponse.redirect(url);}
    if(!user.ok)return new NextResponse('Oturum kontrolü şu anda yapılamıyor. Lütfen yeniden deneyin.',{status:503});
    const data=await user.json();
    if(admin && (data.role??data.user?.role)!=='admin')return new NextResponse('Bu alana erişim yetkiniz yok.',{status:403});
    return response;
  } catch {return new NextResponse('Oturum kontrolü şu anda yapılamıyor. Lütfen yeniden deneyin.',{status:503});}
}
export const config={matcher:['/((?!api|_next/static|_next/image|favicon.ico|uploads|assets|robots.txt|sitemap.xml|llms.txt).*)']};
