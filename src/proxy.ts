import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PORTAL_SESSION_COOKIE, verifyPortalSessionToken } from "@/lib/portal-session";

/**
 * Admin auth is enforced in admin server layouts/pages.
 * Buyer/supplier: /dashboard requires approved portal session (JWT cookie).
 */
export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/admin")) {
        // Keep passthrough for admin routes; page-level guards handle auth.
        return NextResponse.next();
    }

    if (pathname.startsWith("/dashboard")) {
        const token = request.cookies.get(PORTAL_SESSION_COOKIE)?.value;
        const session = token ? await verifyPortalSessionToken(token) : null;

        if (!session) {
            const login = new URL("/auth/login", request.url);
            login.searchParams.set("next", pathname);
            return NextResponse.redirect(login);
        }

        const isSupplierPath = pathname === "/dashboard/supplier" || pathname.startsWith("/dashboard/supplier/");
        if (session.role === "supplier" && !isSupplierPath) {
            return NextResponse.redirect(new URL("/dashboard/supplier", request.url));
        }
        if (session.role === "buyer" && isSupplierPath) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin", "/admin/:path*", "/dashboard", "/dashboard/:path*"],
};
