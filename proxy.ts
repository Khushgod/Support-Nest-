import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt, SESSION_COOKIE } from "@/lib/auth/session";

const PROTECTED_PREFIXES = ["/dashboard", "/account"];
const REDIRECT_WHEN_AUTHED = ["/login", "/register"];

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => path === p || path.startsWith(p + "/")
  );
  const isAuthOnly = REDIRECT_WHEN_AUTHED.includes(path);

  if (!isProtected && !isAuthOnly) {
    return NextResponse.next();
  }

  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = await decrypt(token);

  if (isProtected && !session?.userId) {
    const url = new URL("/login", req.nextUrl);
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (isAuthOnly && session?.userId) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/account/:path*",
    "/login",
    "/register",
  ],
};
