/**
 * One-time migration: data/testimonials.json -> Firestore collection `testimonial_submissions`.
 * Usage (PowerShell):
 *   $env:FIREBASE_SERVICE_ACCOUNT_JSON = Get-Content -Raw path/to/key.json
 *   node scripts/migrate-testimonials-to-firestore.mjs
 */
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function init() {
    const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
    if (!json) {
        console.error("Set FIREBASE_SERVICE_ACCOUNT_JSON to your service account JSON string.");
        process.exit(1);
    }
    if (!getApps().length) {
        initializeApp({ credential: cert(JSON.parse(json)) });
    }
    return getFirestore();
}

async function main() {
    const db = init();
    const raw = await readFile(path.join(root, "data", "testimonials.json"), "utf-8");
    const data = JSON.parse(raw);
    const col = db.collection("testimonial_submissions");
    const batch = db.batch();

    for (const p of data.pending ?? []) {
        batch.set(col.doc(p.id), {
            status: "pending",
            reviewType: p.reviewType,
            name: p.name,
            email: p.email,
            company: p.company,
            message: p.message,
            rating: p.rating ?? null,
            issueType: p.issueType ?? null,
            submittedAt: p.submittedAt,
            updatedAt: FieldValue.serverTimestamp(),
        });
    }
    for (const a of data.approved ?? []) {
        batch.set(col.doc(a.id), {
            status: "approved",
            text: a.text,
            author: a.author,
            role: a.role,
            company: a.company,
            approvedAt: a.approvedAt,
            submittedAt: a.approvedAt,
            updatedAt: FieldValue.serverTimestamp(),
        });
    }

    await batch.commit();
    console.log(`Migrated ${(data.pending ?? []).length} pending and ${(data.approved ?? []).length} approved testimonials.`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
