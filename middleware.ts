import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const url = req.nextUrl;

    // Protect /admin routes
    if (url.pathname.startsWith("/admin")) {
        const basicAuth = req.headers.get("authorization");

        if (basicAuth) {
            const authValue = basicAuth.split(" ")[1];
            const [user, pwd] = atob(authValue).split(":");

            // Hardcoded credentials for MVP. In production, use env vars.
            // User: admin, Password: password123
            if (user === "admin" && pwd === process.env.ADMIN_PASSWORD) {
                return NextResponse.next();
            }
        }

        // Prompt for Basic Auth
        return new NextResponse("Authentication required", {
            status: 401,
            headers: {
                "WWW-Authenticate": 'Basic realm="Secure Area"',
            },
        });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
