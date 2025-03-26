import { NextRequest, NextResponse } from "next/server";

const privateRoutes = ["/perfil", "/evento/criar", "/pagamento"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || null;
  const user = req.cookies.get("user")?.value || null;

  const { pathname } = req.nextUrl;

  const isPrivateRoute = privateRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isPrivateRoute && (!token || !user)) {
    const loginUrl = new URL("/entrar", req.url);

    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};
