import { timingSafeEqual } from "node:crypto";

function padToBuffer(s: string): Buffer {
    const buf = Buffer.alloc(512, 0);
    const src = Buffer.from(s, "utf8");
    src.copy(buf, 0, 0, Math.min(511, src.length));
    return buf;
}

function safeEqual(a: string, b: string): boolean {
    return timingSafeEqual(padToBuffer(a), padToBuffer(b));
}

export function isAdminPasswordAuthEnabled(): boolean {
    return !!process.env.ADMIN_PASSWORD?.trim();
}

/**
 * When `ADMIN_USERNAME` is set, `username` must match. Otherwise only `ADMIN_PASSWORD` is checked.
 */
export function verifyAdminCredentials(username: string, password: string): boolean {
    const expectedPass = process.env.ADMIN_PASSWORD?.trim();
    if (!expectedPass) return false;
    const expectedUser = process.env.ADMIN_USERNAME?.trim();
    if (expectedUser) {
        if (!safeEqual(username, expectedUser)) return false;
    }
    return safeEqual(password, expectedPass);
}
