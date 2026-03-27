import { FieldValue } from "firebase-admin/lib/firestore/index.js";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { FIRESTORE } from "@/lib/firestore-collections";

/** Matches existing UI labels */
export type BuyingRequestStatus =
    | "Active"
    | "Pending"
    | "Quotes"
    | "Completed"
    | "Closed"
    | string;

export type BuyingRequest = {
    id: string;
    /** Owner registration id (from `user_registrations`). Used to restrict buyer visibility. */
    buyerRegId?: string;
    buyerDisplay: string;
    buyerEmail?: string;
    productName: string;
    quantity: string;
    status: BuyingRequestStatus;
    createdAt: string;
};

const col = () => {
    const db = getAdminFirestore();
    if (!db) return null;
    return db.collection(FIRESTORE.buyingRequests);
};

function docToRequest(id: string, data: Record<string, unknown>): BuyingRequest {
    return {
        id,
        buyerRegId: data.buyerRegId != null ? String(data.buyerRegId) : undefined,
        buyerDisplay: String(data.buyerDisplay ?? ""),
        buyerEmail: data.buyerEmail != null ? String(data.buyerEmail) : undefined,
        productName: String(data.productName ?? ""),
        quantity: String(data.quantity ?? ""),
        status: String(data.status ?? "Pending"),
        createdAt: String(data.createdAt ?? new Date().toISOString()),
    };
}

export async function listBuyingRequests(limit?: number): Promise<BuyingRequest[]> {
    const c = col();
    if (!c) return [];
    let snap;
    try {
        snap = await c.get();
    } catch {
        return [];
    }
    const out: BuyingRequest[] = [];
    snap.forEach((doc) => out.push(docToRequest(doc.id, doc.data() as Record<string, unknown>)));
    out.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return limit != null ? out.slice(0, limit) : out;
}

export async function listBuyingRequestsForBuyer(buyerRegId: string, limit?: number): Promise<BuyingRequest[]> {
    const all = await listBuyingRequests();
    const filtered = all.filter((r) => r.buyerRegId === buyerRegId);
    return limit != null ? filtered.slice(0, limit) : filtered;
}

export async function countBuyingRequests(): Promise<number> {
    const c = col();
    if (!c) return 0;
    try {
        const snap = await c.count().get();
        return snap.data().count;
    } catch {
        return 0;
    }
}

export async function countBuyingRequestsForBuyer(buyerRegId: string): Promise<number> {
    const all = await listBuyingRequestsForBuyer(buyerRegId);
    return all.length;
}

export async function countCompletedDeals(): Promise<number> {
    const c = col();
    if (!c) return 0;
    let snap;
    try {
        snap = await c.get();
    } catch {
        return 0;
    }
    return snap.docs.filter((d) => ["Completed", "Closed"].includes(String(d.data().status))).length;
}

export async function createBuyingRequest(
    input: Omit<BuyingRequest, "id" | "createdAt"> & { id?: string; buyerRegId: string },
) {
    const c = col();
    if (!c) throw new Error("Firebase is not configured");
    const id = input.id ?? `req-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const createdAt = new Date().toISOString();
    await c
        .doc(id)
        .set({
            buyerRegId: input.buyerRegId,
            buyerDisplay: input.buyerDisplay,
            buyerEmail: input.buyerEmail ?? null,
            productName: input.productName,
            quantity: input.quantity,
            status: input.status,
            createdAt,
            updatedAt: FieldValue.serverTimestamp(),
        });
    return { id, createdAt };
}
