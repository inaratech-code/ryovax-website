import { getAdminFirestore } from "@/lib/firebase-admin";
import type { FirestoreQueryDoc } from "@/lib/firestore-query-doc";
import { serverTimestampField } from "@/lib/firestore-timestamps";
import { FIRESTORE } from "@/lib/firestore-collections";

export type BookingMode = "specific" | "range";

export type AppointmentRecord = {
    id: string;
    name: string;
    email: string;
    country: string;
    timezone: string;
    bookingMode: BookingMode;
    /** Single preferred slot in UTC (ISO), when mode is specific */
    preferredTimeUtc: string | null;
    /** Optional range bounds in UTC when mode is range */
    availabilityRangeStartUtc: string | null;
    availabilityRangeEndUtc: string | null;
    /** Human-readable range in user’s local context, e.g. "9:00 AM – 5:00 PM" */
    availabilityRangeLabel: string | null;
    createdAt: string;
    updatedAt?: string;
    /** Admin override for confirmed slot (UTC ISO) */
    adminScheduledAtUtc?: string | null;
    adminNotes?: string;
};

const col = () => {
    const db = getAdminFirestore();
    if (!db) return null;
    return db.collection(FIRESTORE.appointments);
};

function docToAppointment(id: string, data: Record<string, unknown>): AppointmentRecord {
    return {
        id,
        name: String(data.name ?? ""),
        email: String(data.email ?? ""),
        country: String(data.country ?? ""),
        timezone: String(data.timezone ?? "UTC"),
        bookingMode: data.bookingMode === "range" ? "range" : "specific",
        preferredTimeUtc: data.preferredTimeUtc != null ? String(data.preferredTimeUtc) : null,
        availabilityRangeStartUtc: data.availabilityRangeStartUtc != null ? String(data.availabilityRangeStartUtc) : null,
        availabilityRangeEndUtc: data.availabilityRangeEndUtc != null ? String(data.availabilityRangeEndUtc) : null,
        availabilityRangeLabel: data.availabilityRangeLabel != null ? String(data.availabilityRangeLabel) : null,
        createdAt: String(data.createdAt ?? new Date().toISOString()),
        updatedAt: data.updatedAt != null ? String(data.updatedAt) : undefined,
        adminScheduledAtUtc:
            data.adminScheduledAtUtc != null && data.adminScheduledAtUtc !== ""
                ? String(data.adminScheduledAtUtc)
                : null,
        adminNotes: data.adminNotes != null ? String(data.adminNotes) : undefined,
    };
}

export async function listAppointments(): Promise<AppointmentRecord[]> {
    const c = col();
    if (!c) return [];
    const snap = await c.get();
    const out: AppointmentRecord[] = [];
    snap.forEach((doc: FirestoreQueryDoc) =>
        out.push(docToAppointment(doc.id, doc.data() as Record<string, unknown>)),
    );
    out.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return out;
}

export async function countAppointments(): Promise<number> {
    const c = col();
    if (!c) return 0;
    try {
        const snap = await c.count().get();
        return snap.data().count;
    } catch {
        return 0;
    }
}

export async function createAppointment(input: Omit<AppointmentRecord, "id" | "createdAt"> & { id: string }) {
    const c = col();
    if (!c) throw new Error("Firebase is not configured");
    const createdAt = new Date().toISOString();
    await c.doc(input.id).set({
        name: input.name,
        email: input.email,
        country: input.country,
        timezone: input.timezone,
        bookingMode: input.bookingMode,
        preferredTimeUtc: input.preferredTimeUtc,
        availabilityRangeStartUtc: input.availabilityRangeStartUtc,
        availabilityRangeEndUtc: input.availabilityRangeEndUtc,
        availabilityRangeLabel: input.availabilityRangeLabel,
        createdAt,
        adminScheduledAtUtc: input.adminScheduledAtUtc ?? null,
        adminNotes: input.adminNotes ?? "",
        updatedAt: serverTimestampField(),
    });
    return { id: input.id, createdAt };
}

export async function updateAppointmentAdmin(
    id: string,
    patch: {
        adminScheduledAtUtc?: string | null;
        adminNotes?: string;
    },
): Promise<{ ok: true } | { ok: false; error: string }> {
    const c = col();
    if (!c) return { ok: false, error: "Firebase is not configured" };
    const ref = c.doc(id);
    const snap = await ref.get();
    if (!snap.exists) return { ok: false, error: "Not found" };
    const update: Record<string, unknown> = {
        updatedAt: serverTimestampField(),
    };
    if ("adminScheduledAtUtc" in patch) update.adminScheduledAtUtc = patch.adminScheduledAtUtc ?? null;
    if (patch.adminNotes !== undefined) update.adminNotes = patch.adminNotes;
    await ref.update(update);
    return { ok: true };
}

export function newAppointmentId(): string {
    return `apt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
