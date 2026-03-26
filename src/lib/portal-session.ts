import { SignJWT, jwtVerify } from "jose";

export const PORTAL_SESSION_COOKIE = "portal_session";

export type PortalSessionPayload = {
    email: string;
    companyName: string;
    role: "buyer" | "supplier";
    regId: string;
};

function getSecretKey(): Uint8Array {
    const s = process.env.PORTAL_SESSION_SECRET?.trim();
    if (!s || s.length < 16) {
        throw new Error("PORTAL_SESSION_SECRET must be set (at least 16 characters) for buyer/supplier login.");
    }
    return new TextEncoder().encode(s);
}

export async function createPortalSessionToken(payload: PortalSessionPayload): Promise<string> {
    const secret = getSecretKey();
    return new SignJWT({
        email: payload.email,
        companyName: payload.companyName,
        role: payload.role,
        regId: payload.regId,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(payload.email)
        .setExpirationTime("14d")
        .setIssuedAt()
        .sign(secret);
}

export async function verifyPortalSessionToken(token: string): Promise<PortalSessionPayload | null> {
    try {
        const secret = getSecretKey();
        const { payload } = await jwtVerify(token, secret);
        const email = String(payload.email ?? "");
        const companyName = String(payload.companyName ?? "");
        const regId = String(payload.regId ?? "");
        const role = payload.role === "supplier" ? "supplier" : "buyer";
        if (!email || !regId) return null;
        return { email, companyName, role, regId };
    } catch {
        return null;
    }
}
