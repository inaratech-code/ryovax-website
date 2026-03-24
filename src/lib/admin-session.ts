import { SignJWT, jwtVerify } from "jose";

export const ADMIN_SESSION_COOKIE = "admin_session";

function getSecretKey(): Uint8Array {
    const s = process.env.ADMIN_SESSION_SECRET?.trim();
    if (!s || s.length < 16) {
        throw new Error(
            "ADMIN_SESSION_SECRET must be set (at least 16 characters) when ADMIN_PASSWORD is used.",
        );
    }
    return new TextEncoder().encode(s);
}

export async function createAdminSessionToken(): Promise<string> {
    const secret = getSecretKey();
    return new SignJWT({ role: "admin" })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .setIssuedAt()
        .sign(secret);
}

export async function verifyAdminSessionToken(token: string): Promise<boolean> {
    try {
        const secret = getSecretKey();
        await jwtVerify(token, secret);
        return true;
    } catch {
        return false;
    }
}
