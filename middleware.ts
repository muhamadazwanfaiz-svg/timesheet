import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const url = req.nextUrl;

    // Protect /admin routes
    if (url.pathname.startsWith("/admin")) {
        const cookieStore = req.cookies;
        const isAdmin = cookieStore.get("admin_session")?.value === "true";

        if (!isAdmin) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
