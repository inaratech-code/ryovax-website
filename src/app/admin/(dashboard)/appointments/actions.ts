"use server";

import { revalidatePath } from "next/cache";
import { fromZonedTime } from "date-fns-tz";
import { getAdminDisplayTimezone } from "@/lib/appointment-time";
import { updateAppointmentAdmin } from "@/lib/appointments-store";

export async function saveAdminAppointmentSlot(id: string, localDateTime: string) {
    if (!localDateTime.trim()) {
        const r = await updateAppointmentAdmin(id, { adminScheduledAtUtc: null });
        revalidatePath("/admin/appointments");
        return r;
    }
    const tz = getAdminDisplayTimezone();
    const utc = fromZonedTime(localDateTime, tz);
    const r = await updateAppointmentAdmin(id, { adminScheduledAtUtc: utc.toISOString() });
    revalidatePath("/admin/appointments");
    return r;
}

export async function saveAdminAppointmentNotes(id: string, adminNotes: string) {
    const r = await updateAppointmentAdmin(id, { adminNotes });
    revalidatePath("/admin/appointments");
    return r;
}
