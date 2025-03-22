import { NextResponse } from "next/server";

const protectedRoutes = ["/account", "/profile", "/fixing"];

export function middleware(req) {
  const token = req.cookies.get("token"); 
  const url = req.nextUrl.clone();
  
  // Allow access to the register page without a token
  if (url.pathname.startsWith("/register")) {
    return NextResponse.next();
  }

  // Redirect to login if there's no token and the route is protected
  if (protectedRoutes.some((route) => url.pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/profile/:path*", "/fixing/:path*", "/register"],
};
