import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextRequest, NextResponse } from "next/server";

const i18n = {
  locales: ["pt", "en"],
  defaultLocale: "pt",
};

const privateRoutes = ["/perfil", "/evento/criar", "/pagamento", "/usuario"];

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value;
  });

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    i18n.locales
  );
  const locale = matchLocale(languages, i18n.locales, i18n.defaultLocale);

  return locale;
}

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

  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(req);
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        req.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|robots.txt|.*sitemap.*|api|assets|icons|images).*)",
  ],
};
