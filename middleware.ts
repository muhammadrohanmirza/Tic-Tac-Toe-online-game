import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 60;
const RATE_LIMIT_WINDOW = 60000;

export default withAuth(
  function middleware(req) {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();

    const rateLimitInfo = rateLimitMap.get(ip);

    if (!rateLimitInfo) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    } else {
      if (now > rateLimitInfo.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      } else {
        if (rateLimitInfo.count >= RATE_LIMIT) {
          return new NextResponse("Too many requests", { status: 429 });
        }
        rateLimitMap.set(ip, {
          count: rateLimitInfo.count + 1,
          resetTime: rateLimitInfo.resetTime,
        });
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        const publicPaths = [
          "/login",
          "/signup",
          "/api/signup",
          "/api/auth",
          "/",
          "/api/socket",
        ];

        if (publicPaths.some((path) => pathname.startsWith(path))) {
          return true;
        }

        const protectedPaths = ["/lobby", "/room"];

        if (protectedPaths.some((path) => pathname.startsWith(path))) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/lobby/:path*",
    "/room/:path*",
    "/login",
    "/signup",
    "/api/signup",
    "/api/auth/:path*",
    "/api/rooms",
    "/api/scores",
  ],
};
