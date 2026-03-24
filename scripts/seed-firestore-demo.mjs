/**
 * Seeds demo `user_registrations` and `buying_requests` (idempotent: upserts by document id).
 * Usage:
 *   $env:FIREBASE_SERVICE_ACCOUNT_JSON = Get-Content -Raw path/to/key.json
 *   node scripts/seed-firestore-demo.mjs
 */
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

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

const now = new Date().toISOString();

const users = [
    {
        id: "seed-reg-1",
        companyName: "NeoTech Manufacturing",
        email: "contact@neotech.example.com",
        role: "supplier",
        status: "pending",
        createdAt: now,
    },
    {
        id: "seed-reg-2",
        companyName: "Global Supply Co",
        email: "ops@globalsupply.example.com",
        role: "buyer",
        status: "pending",
        createdAt: now,
    },
    {
        id: "seed-reg-3",
        companyName: "Reliance Ind.",
        email: "vendor@reliance.example.com",
        role: "supplier",
        status: "approved",
        createdAt: now,
    },
    {
        id: "seed-reg-4",
        companyName: "BuildMart",
        email: "buy@buildmart.example.com",
        role: "buyer",
        status: "approved",
        createdAt: now,
    },
];

const requests = [
    {
        id: "REQ-5041",
        buyerDisplay: "Global Supply Co",
        productName: "Industrial fasteners",
        quantity: "Lot",
        status: "Active",
        createdAt: now,
    },
    {
        id: "REQ-5039",
        buyerDisplay: "TechParts",
        productName: "Copper piping",
        quantity: "10,000 m",
        status: "Active",
        createdAt: now,
    },
    {
        id: "REQ-5035",
        buyerDisplay: "BuildMart",
        productName: "Solar inverters",
        quantity: "500 units",
        status: "Pending",
        createdAt: now,
    },
    {
        id: "REQ-5028",
        buyerDisplay: "MedEquip",
        productName: "Lithium batteries",
        quantity: "1,200 units",
        status: "Closed",
        createdAt: now,
    },
    {
        id: "REQ-2041",
        buyerDisplay: "BuildMart",
        productName: "Aluminum extrusions",
        quantity: "5,000 kg",
        status: "Active",
        createdAt: now,
    },
    {
        id: "REQ-2039",
        buyerDisplay: "TechParts",
        productName: "Copper piping",
        quantity: "10,000 m",
        status: "Quotes",
        createdAt: now,
    },
    {
        id: "REQ-2035",
        buyerDisplay: "BuildMart",
        productName: "Solar inverters",
        quantity: "500 units",
        status: "Pending",
        createdAt: now,
    },
    {
        id: "REQ-2028",
        buyerDisplay: "MedEquip",
        productName: "Lithium batteries",
        quantity: "1,200 units",
        status: "Completed",
        createdAt: now,
    },
];

async function main() {
    const db = init();
    const batch = db.batch();

    for (const u of users) {
        batch.set(
            db.collection("user_registrations").doc(u.id),
            {
                companyName: u.companyName,
                email: u.email,
                role: u.role,
                status: u.status,
                createdAt: u.createdAt,
                updatedAt: FieldValue.serverTimestamp(),
            },
            { merge: true },
        );
    }

    for (const r of requests) {
        batch.set(
            db.collection("buying_requests").doc(r.id),
            {
                buyerDisplay: r.buyerDisplay,
                buyerEmail: null,
                productName: r.productName,
                quantity: r.quantity,
                status: r.status,
                createdAt: r.createdAt,
                updatedAt: FieldValue.serverTimestamp(),
            },
            { merge: true },
        );
    }

    await batch.commit();
    console.log(`Seeded ${users.length} user registrations and ${requests.length} buying requests.`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
