/**
 * Cloudflare Workers forbid eval / dynamic code generation; firebase-admin triggers that at init.
 * When true, use Firestore REST + OAuth (jose) instead of the Admin SDK.
 *
 * **Important:** If `FIREBASE_SERVICE_ACCOUNT_JSON` is set, we choose REST **before** honoring
 * `FIRESTORE_USE_REST=false`. Many deployments still have `FIRESTORE_USE_REST=false` in secrets
 * from earlier debugging; that would otherwise force the Admin SDK and cause EvalError on Workers.
 *
 * To use the Admin SDK with JSON credentials (Node only), set `USE_FIREBASE_ADMIN_SDK=true`.
 *
 * ADC-only (no JSON): `FIRESTORE_USE_REST=false` forces the SDK; `true` forces REST.
 */
export function shouldUseFirestoreRest(): boolean {
    if (process.env.USE_FIREBASE_ADMIN_SDK === "true") return false;

    if (process.env.FIRESTORE_USE_REST === "true") return true;

    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim()) return true;

    if (process.env.FIRESTORE_USE_REST === "false") return false;

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
