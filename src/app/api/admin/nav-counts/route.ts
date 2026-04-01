import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
    const hasPasswordAuth = !!process.env.ADMIN_PASSWORD?.trim();
    if (hasPasswordAuth) {
        const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
        const ok = token ? await verifyAdminSessionToken(token) : false;
        if (!ok) {
            return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
        }
    }

    try {
        const [
            { countApprovedUserRegistrationsByRole, countPendingUserRegistrations },
            { countBuyingRequests },
            { countAppointments },
            { countPendingTestimonials },
        ] = await Promise.all([
            import("@/lib/user-registrations-store"),
            import("@/lib/buying-requests-store"),
            import("@/lib/appointments-store"),
            import("@/lib/testimonials-store"),
        ]);

        const [buyers, suppliers, pendingApprovals, requests, appointments, pendingTestimonials] = await Promise.all([
            countApprovedUserRegistrationsByRole("buyer"),
            countApprovedUserRegistrationsByRole("supplier"),
            countPendingUserRegistrations(),
            countBuyingRequests(),
            countAppointments(),
            countPendingTestimonials(),
        ]);

        return NextResponse.json(
            {
                ok: true,
                counts: {
                    buyers,
                    suppliers,
                    requests,
                    appointments,
                    pendingApprovals,
                    pendingTestimonials,
                },
            },
            { status: 200 },
        );
    } catch (e) {
        return NextResponse.json(
            { ok: false, error: e instanceof Error ? e.message : "Unknown error" },
            { status: 500 },
        );
    }
}

