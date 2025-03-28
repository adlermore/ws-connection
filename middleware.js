import { NextResponse } from "next/server";

const protectedRoutes = ["/account", "/profile", "/fixing"];

export function middleware(req) {
  const token = req.cookies.get("token");
  const url = req.nextUrl.clone();
  
  // Allow access to public routes without a token
  if (!protectedRoutes.some((route) => url.pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Redirect to login if no token for protected routes
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/profile/:path*", "/fixing/:path*"],
};
