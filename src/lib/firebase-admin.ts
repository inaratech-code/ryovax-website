import { getRestFirestoreDb } from "@/lib/firestore-rest-client";
import { shouldUseFirestoreRest } from "@/lib/should-use-firestore-rest";

/** Avoid `import type` from `firebase-admin/*` so bundlers never pull that package into the worker. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AdminFirestore = any;

let cachedRest: ReturnType<typeof getRestFirestoreDb> | undefined;
let lastInitError: string | null = null;

export function getLastFirebaseAdminInitError(): string | null {
    return lastInitError;
}

export function isFirebaseConfigured(): boolean {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim()) return true;
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim()) return false;
    if (process.env.NODE_ENV === "production") {
        return process.env.FIREBASE_ALLOW_GOOGLE_APPLICATION_CREDENTIALS_IN_PRODUCTION === "true";
    }
    return true;
}

/**
 * Returns Firestore when configured; otherwise `null` (e.g. CI without secrets).
 * On Cloudflare Workers, uses Firestore REST + OAuth (no firebase-admin — avoids EvalError).
 */
export function getAdminFirestore(): AdminFirestore | null {
    if (!isFirebaseConfigured()) return null;
    lastInitError = null;

    if (shouldUseFirestoreRest()) {
        try {
            if (!cachedRest) cachedRest = getRestFirestoreDb();
            return cachedRest as AdminFirestore;
        } catch (e) {
            lastInitError = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
            return null;
        }
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { getSdkFirestore } = require("@/lib/firebase-admin-sdk") as typeof import("@/lib/firebase-admin-sdk");
        const db = getSdkFirestore();
        if (!db) {
            lastInitError = "getSdkFirestore returned null";
            return null;
        }
        return db;
    } catch (e) {
        lastInitError = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
        return null;
    }
}
