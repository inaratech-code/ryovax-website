import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { initializeFirestore, type Firestore } from "firebase-admin/firestore";

let cachedDb: Firestore | undefined;
/** Last Firestore init failure (for diagnostics; no secrets). */
let lastFirestoreInitError: string | null = null;

export function getLastFirestoreInitError(): string | null {
    return lastFirestoreInitError;
}

function isServiceAccountObject(o: Record<string, unknown>): boolean {
    return (
        o.type === "service_account" &&
        typeof o.private_key === "string" &&
        typeof o.client_email === "string"
    );
}

/**
 * Parses `FIREBASE_SERVICE_ACCOUNT_JSON` tolerating a UTF-8 BOM and accidental double-stringification
 * (some UIs store the whole JSON as a JSON string value).
 */
export function parseFirebaseServiceAccountJson(raw: string): { ok: true; data: object } | { ok: false; error: string } {
    let s = raw.trim();
    if (s.charCodeAt(0) === 0xfeff) s = s.slice(1);

    try {
        const first: unknown = JSON.parse(s);
        if (first && typeof first === "object" && !Array.isArray(first)) {
            const rec = first as Record<string, unknown>;
            if (isServiceAccountObject(rec)) return { ok: true, data: rec as object };
        }
        if (typeof first === "string") {
            const second: unknown = JSON.parse(first.trim());
            if (second && typeof second === "object" && !Array.isArray(second)) {
                const rec = second as Record<string, unknown>;
                if (isServiceAccountObject(rec)) return { ok: true, data: rec as object };
            }
        }
        return { ok: false, error: 'Expected a service account object (type "service_account" with client_email and private_key).' };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "JSON parse failed";
        return { ok: false, error: msg };
    }
}

export function isFirebaseConfigured(): boolean {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim()) return true;
    // Local dev: ADC file path. Production serverless (e.g. Cloudflare) has no key file — use FIREBASE_SERVICE_ACCOUNT_JSON secret.
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim()) return false;
    if (process.env.NODE_ENV === "production") {
        return process.env.FIREBASE_ALLOW_GOOGLE_APPLICATION_CREDENTIALS_IN_PRODUCTION === "true";
    }
    return true;
}

/**
 * Returns Firestore when Firebase Admin is configured; otherwise `null` (e.g. CI build without secrets).
 * Set `FIREBASE_SERVICE_ACCOUNT_JSON`, or optionally a readable file path via `GOOGLE_APPLICATION_CREDENTIALS`.
 */
export function getAdminFirestore(): Firestore | null {
    if (!isFirebaseConfigured()) return null;
    if (cachedDb) return cachedDb;

    const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
    lastFirestoreInitError = null;
    try {
        let app: App;
        if (!getApps().length) {
            if (json) {
                const parsed = parseFirebaseServiceAccountJson(json);
                if (!parsed.ok) return null;
                app = initializeApp({ credential: cert(parsed.data) });
            } else {
                app = initializeApp();
            }
        } else {
            app = getApps()[0]!;
        }

        // Cloudflare Workers / edge: default gRPC stack often fails; REST avoids native gRPC deps.
        const preferRest = process.env.FIRESTORE_PREFER_REST !== "false";
        cachedDb = initializeFirestore(app, { preferRest });
        return cachedDb;
    } catch (e) {
        lastFirestoreInitError = e instanceof Error ? e.message : String(e);
        // Runtime credentials/parsing issue: expose as "not configured" to callers.
        return null;
    }
}
