import { FieldValue } from "firebase-admin/firestore";
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
    const snap = await c.get();
    const out: BuyingRequest[] = [];
    snap.forEach((doc) => out.push(docToRequest(doc.id, doc.data() as Record<string, unknown>)));
    out.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return limit != null ? out.slice(0, limit) : out;
}

export async function countBuyingRequests(): Promise<number> {
    const c = col();
    if (!c) return 0;
    const snap = await c.count().get();
    return snap.data().count;
}

export async function countCompletedDeals(): Promise<number> {
    const c = col();
    if (!c) return 0;
    const snap = await c.get();
    return snap.docs.filter((d) => ["Completed", "Closed"].includes(String(d.data().status))).length;
}

export async function createBuyingRequest(input: Omit<BuyingRequest, "id" | "createdAt"> & { id?: string }) {
    const c = col();
    if (!c) throw new Error("Firebase is not configured");
    const id = input.id ?? `req-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const createdAt = new Date().toISOString();
    await c
        .doc(id)
        .set({
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
