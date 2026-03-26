import { cookies } from "next/headers";
import { PORTAL_SESSION_COOKIE, verifyPortalSessionToken, type PortalSessionPayload } from "@/lib/portal-session";

export async function getPortalSessionFromCookies(): Promise<PortalSessionPayload | null> {
    try {
        const jar = await cookies();
        const t = jar.get(PORTAL_SESSION_COOKIE)?.value;
        if (!t) return null;
        return verifyPortalSessionToken(t);
    } catch {
        return null;
    }
}
