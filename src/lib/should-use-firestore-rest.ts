/**
 * Cloudflare Workers forbid eval / dynamic code generation; firebase-admin triggers that at init.
 * When true, use Firestore REST + OAuth (jose) instead of the Admin SDK.
 *
 * Set `FIRESTORE_USE_REST=false` to force the Admin SDK (Node / local dev).
 * Set `FIRESTORE_USE_REST=true` to force REST (e.g. CI or non-CF hosts without the SDK).
 */
export function shouldUseFirestoreRest(): boolean {
    if (process.env.FIRESTORE_USE_REST === "false") return false;
    if (process.env.FIRESTORE_USE_REST === "true") return true;
    try {
        if (typeof navigator !== "undefined" && String(navigator.userAgent ?? "").includes("Cloudflare")) {
            return true;
        }
    } catch {
        /* ignore */
    }
    if (process.env.CF_PAGES === "1") return true;
    return false;
}
