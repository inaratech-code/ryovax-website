/**
 * Cloudflare Workers forbid eval / dynamic code generation; firebase-admin triggers that at init.
 * When true, use Firestore REST + OAuth (jose) instead of the Admin SDK.
 *
 * **Default:** If `FIREBASE_SERVICE_ACCOUNT_JSON` is set, we use REST. OpenNext deploys to
 * Workers (not always Pages), so `CF_PAGES` / `navigator.userAgent` are unreliable; your
 * JSON secret is the signal that REST is both possible and required on CF.
 *
 * Set `FIRESTORE_USE_REST=false` to force the Admin SDK (Node, local dev, or gRPC-only needs).
 * Set `FIRESTORE_USE_REST=true` to force REST even when only using ADC (must still supply JSON for our REST client).
 */
export function shouldUseFirestoreRest(): boolean {
    if (process.env.FIRESTORE_USE_REST === "false") return false;
    if (process.env.FIRESTORE_USE_REST === "true") return true;
    // Prefer REST whenever JSON credentials are in env (typical for production secrets).
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim()) return true;
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
