"use server";

import { approvePendingById, deletePendingById } from "@/lib/testimonials-store";

export async function approveTestimonial(id: string) {
    const r = await approvePendingById(id);
    if (!r.ok) return { ok: false as const, error: r.error };
    return { ok: true as const };
}

export async function rejectTestimonial(id: string) {
    const r = await deletePendingById(id);
    if (!r.ok) return { ok: false as const, error: r.error };
    return { ok: true as const };
}

/** Permanently removes a pending submission from the queue (same effect as reject). */
export async function deletePendingTestimonial(id: string) {
    const r = await deletePendingById(id);
    if (!r.ok) return { ok: false as const, error: r.error };
    return { ok: true as const };
}
