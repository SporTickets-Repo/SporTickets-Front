import { NextRequest, NextResponse } from "next/server";

const privateRoutes = ["/perfil", "/evento/criar", "/pagamento", "/usuario"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || null;
  const { pathname, searchParams } = req.nextUrl;

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
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};
