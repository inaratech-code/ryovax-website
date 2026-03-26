import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-session";
import { PORTAL_SESSION_COOKIE, verifyPortalSessionToken } from "@/lib/portal-session";

/**
 * Admin: production requires ADMIN_PANEL_ENABLED; optional password gate.
 * Buyer/supplier: /dashboard requires approved portal session (JWT cookie).
 */
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/admin")) {
        // Cloudflare edge/proxy deployments may not expose runtime env vars reliably.
        // Admin gating is enforced in the server layouts/pages instead of here.
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

        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin", "/admin/:path*", "/dashboard", "/dashboard/:path*"],
};
