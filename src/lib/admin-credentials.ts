/**
 * Worker-safe constant-time-ish string compare.
 *
 * We avoid Node-only APIs (`node:crypto`, `Buffer`) because admin auth can run
 * on Cloudflare Workers via OpenNext.
 */
function safeEqual(a: string, b: string): boolean {
    const enc = new TextEncoder();
    const aBytes = enc.encode(a);
    const bBytes = enc.encode(b);

    const len = 512;
    const aa = new Uint8Array(len);
    const bb = new Uint8Array(len);

    aa.set(aBytes.subarray(0, len - 1));
    bb.set(bBytes.subarray(0, len - 1));

    let diff = 0;
    for (let i = 0; i < len; i++) {
        diff |= aa[i] ^ bb[i];
    }
    return diff === 0;
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
