import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/lib/i18n";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return;

  // ponytail: só olha o idioma primário do Accept-Language; Negotiator se surgirem mais locales
  const accept = request.headers.get("accept-language") ?? "";
  const locale = accept.toLowerCase().startsWith("en") ? "en" : defaultLocale;
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};
