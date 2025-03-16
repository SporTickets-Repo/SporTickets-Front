import { NextRequest, NextResponse } from "next/server";

const privateRoutes = ["/perfil"];

export function middleware(req: NextRequest) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  const { pathname } = req.nextUrl;

  if (privateRoutes.includes(pathname) && (!token || !user)) {
    return NextResponse.redirect(new URL("/entrar", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};
