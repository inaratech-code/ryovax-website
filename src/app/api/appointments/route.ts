import { NextResponse } from "next/server";
import { isFirebaseConfigured } from "@/lib/firebase-admin";
import { createAppointment, newAppointmentId } from "@/lib/appointments-store";
import type { BookingMode } from "@/lib/appointments-store";

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
    if (!isFirebaseConfigured()) {
        return NextResponse.json(
            { error: "Booking is unavailable (server configuration)." },
            { status: 503 },
        );
    }

    let body: Record<string, unknown>;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const country = typeof body.country === "string" ? body.country.trim() : "";
    const timezone = typeof body.timezone === "string" ? body.timezone.trim() : "";
    const bookingMode = body.bookingMode === "range" ? "range" : "specific";

    if (!name || !email || !country || !timezone || !isValidEmail(email)) {
        return NextResponse.json({ error: "Missing or invalid name, email, country, or timezone." }, { status: 400 });
    }

    const preferredTimeUtc =
        typeof body.preferredTimeUtc === "string" && body.preferredTimeUtc.length > 0
            ? body.preferredTimeUtc
            : null;
    const availabilityRangeStartUtc =
        typeof body.availabilityRangeStartUtc === "string" && body.availabilityRangeStartUtc.length > 0
            ? body.availabilityRangeStartUtc
            : null;
    const availabilityRangeEndUtc =
        typeof body.availabilityRangeEndUtc === "string" && body.availabilityRangeEndUtc.length > 0
            ? body.availabilityRangeEndUtc
            : null;
    const availabilityRangeLabel =
        typeof body.availabilityRangeLabel === "string" ? body.availabilityRangeLabel.trim() : null;

    if (bookingMode === "specific" && !preferredTimeUtc) {
        return NextResponse.json({ error: "Preferred date and time are required." }, { status: 400 });
    }
    if (bookingMode === "range" && (!availabilityRangeStartUtc || !availabilityRangeEndUtc)) {
        return NextResponse.json(
            { error: "Availability range requires start and end times." },
            { status: 400 },
        );
    }

    const mode: BookingMode = bookingMode;
    const id = newAppointmentId();

    try {
        await createAppointment({
            id,
            name,
            email,
            country,
            timezone,
            bookingMode: mode,
            preferredTimeUtc,
            availabilityRangeStartUtc,
            availabilityRangeEndUtc,
            availabilityRangeLabel: availabilityRangeLabel || null,
            adminScheduledAtUtc: null,
            adminNotes: "",
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Could not save appointment." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id });
}
