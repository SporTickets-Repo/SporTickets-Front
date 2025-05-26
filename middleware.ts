import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import routing from "./lib/i18n/routing";

const privateRoutes = ["/perfil", "/evento/criar", "/pagamento", "/usuario"];

export default createMiddleware(routing);

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const token = req.cookies.get("token")?.value || null;

  const forwardedProto = req.headers.get("x-forwarded-proto");
  if (process.env.NODE_ENV === "production" && forwardedProto === "http") {
    const url = req.nextUrl.clone();
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  if (
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/evento/sitemap.xml"
  ) {
    return NextResponse.next();
  }

  if (pathname === "/entrar" && token) {
    const redirect = searchParams.get("redirect") || "/";
    return NextResponse.redirect(new URL(redirect, req.url));
  }

  const isPrivateRoute = privateRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isPrivateRoute && !token) {
    const loginUrl = new URL("/entrar", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|robots.txt|.*sitemap.*|api).*)"],
};
