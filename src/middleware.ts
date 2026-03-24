import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-session";

/**
 * Admin UI: production requires ADMIN_PANEL_ENABLED (unchanged).
 * When ADMIN_PASSWORD is set, /admin/* (except /admin/login) requires a valid admin session cookie.
 */
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
    if (!isAdminPath) {
        return NextResponse.next();
    }

    const allowPanel =
        process.env.NODE_ENV === "development" || process.env.ADMIN_PANEL_ENABLED === "true";
    if (!allowPanel) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    const passwordAuth = !!process.env.ADMIN_PASSWORD?.trim();
    if (!passwordAuth) {
        return NextResponse.next();
    }

    const isAdminLogin = pathname === "/admin/login" || pathname.startsWith("/admin/login/");
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

    if (isAdminLogin) {
        if (token && (await verifyAdminSessionToken(token))) {
            return NextResponse.redirect(new URL("/admin", request.url));
        }
        return NextResponse.next();
    }

    if (!token || !(await verifyAdminSessionToken(token))) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin", "/admin/:path*"],
};
