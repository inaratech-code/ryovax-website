import { shouldUseFirestoreRest } from "@/lib/should-use-firestore-rest";

/**
 * Server timestamp for writes. REST uses ISO strings; Admin SDK uses FieldValue.serverTimestamp().
 */
export function serverTimestampField(): unknown {
    if (shouldUseFirestoreRest()) {
        return new Date().toISOString();
    }
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { FieldValue } = require("firebase-admin/firestore") as typeof import("firebase-admin/firestore");
    return FieldValue.serverTimestamp();
}
