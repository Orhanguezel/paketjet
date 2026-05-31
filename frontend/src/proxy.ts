import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isDev = process.env.NODE_ENV === "development";

export function proxy(_request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");

  if (!isDev) {
    response.headers.set(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://maps.googleapis.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "img-src 'self' data: blob: https: http://localhost:*",
        "font-src 'self' https://fonts.gstatic.com",
        "connect-src 'self' https: http://localhost:*",
        "frame-src 'self' https://www.google.com https://www.youtube.com https://sandbox-api.iyzipay.com https://api.iyzipay.com https://maps.googleapis.com",
        "media-src 'self' https: http://localhost:*",
      ].join("; "),
    );
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|uploads|assets|robots.txt|sitemap.xml|llms.txt).*)"],
};
