"use client";

import { useEffect, useMemo, useState } from "react";
import { formatInTimeZone } from "date-fns-tz";
import { CalendarClock, Loader2 } from "lucide-react";
import { COUNTRY_OPTIONS, COMMON_TIMEZONES } from "@/lib/countries-timezones";
import { localWallTimeToUtcIso } from "@/lib/appointment-client-utils";

function buildTimezoneOptions(detected: string) {
    const seen = new Set<string>();
    const out: { value: string; label: string }[] = [];
    if (detected) {
        seen.add(detected);
        out.push({ value: detected, label: `${detected} (detected)` });
    }
    for (const c of COUNTRY_OPTIONS) {
        if (!seen.has(c.timezone)) {
            seen.add(c.timezone);
            out.push({ value: c.timezone, label: `${c.name} — ${c.timezone}` });
        }
    }
    for (const z of COMMON_TIMEZONES) {
        if (!seen.has(z.value)) {
            seen.add(z.value);
            out.push(z);
        }
    }
    return out;
}

export default function BookAppointmentForm() {
    const [detectedTz, setDetectedTz] = useState("UTC");
    useEffect(() => {
        try {
            setDetectedTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
        } catch {
            /* ignore */
        }
    }, []);

    const tzOptions = useMemo(() => buildTimezoneOptions(detectedTz), [detectedTz]);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [countryName, setCountryName] = useState(COUNTRY_OPTIONS[6]?.name ?? "India");
    const [timezone, setTimezone] = useState(COUNTRY_OPTIONS[6]?.timezone ?? "Asia/Kolkata");
    const [mode, setMode] = useState<"specific" | "range">("specific");

    const [dateStr, setDateStr] = useState("");
    const [timeStr, setTimeStr] = useState("10:00");

    const [rangeDateStr, setRangeDateStr] = useState("");
    const [rangeStart, setRangeStart] = useState("09:00");
    const [rangeEnd, setRangeEnd] = useState("17:00");

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState(false);

    useEffect(() => {
        const c = COUNTRY_OPTIONS.find((x) => x.name === countryName);
        if (c) setTimezone(c.timezone);
    }, [countryName]);

    const previewSpecific = useMemo(() => {
        if (!dateStr || !timeStr || !timezone) return null;
        try {
            const iso = localWallTimeToUtcIso(dateStr, timeStr, timezone);
            return {
                iso,
                localLabel: formatInTimeZone(new Date(iso), timezone, "EEEE, MMM d, yyyy · h:mm a zzz"),
                utcLabel: formatInTimeZone(new Date(iso), "UTC", "MMM d, yyyy · HH:mm 'UTC'"),
            };
        } catch {
            return null;
        }
    }, [dateStr, timeStr, timezone]);

    const previewRange = useMemo(() => {
        if (!rangeDateStr || !timezone) return null;
        try {
            const startIso = localWallTimeToUtcIso(rangeDateStr, rangeStart, timezone);
            const endIso = localWallTimeToUtcIso(rangeDateStr, rangeEnd, timezone);
            return {
                startIso,
                endIso,
                localLabel: `${rangeDateStr} · ${rangeStart} – ${rangeEnd} (${timezone})`,
            };
        } catch {
            return null;
        }
    }, [rangeDateStr, rangeStart, rangeEnd, timezone]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            let body: Record<string, unknown> = {
                name: name.trim(),
                email: email.trim(),
                country: countryName,
                timezone,
                bookingMode: mode,
            };

            if (mode === "specific") {
                if (!dateStr || !timeStr) {
                    setError("Please choose a date and time.");
                    setSubmitting(false);
                    return;
                }
                body.preferredTimeUtc = localWallTimeToUtcIso(dateStr, timeStr, timezone);
                body.availabilityRangeStartUtc = null;
                body.availabilityRangeEndUtc = null;
                body.availabilityRangeLabel = null;
            } else {
                if (!rangeDateStr) {
                    setError("Please choose a date for your availability.");
                    setSubmitting(false);
                    return;
                }
                const startIso = localWallTimeToUtcIso(rangeDateStr, rangeStart, timezone);
                const endIso = localWallTimeToUtcIso(rangeDateStr, rangeEnd, timezone);
                body.preferredTimeUtc = null;
                body.availabilityRangeStartUtc = startIso;
                body.availabilityRangeEndUtc = endIso;
                body.availabilityRangeLabel = `${rangeDateStr} · ${rangeStart} – ${rangeEnd} (your local time, ${timezone})`;
            }

            const res = await fetch("/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = (await res.json().catch(() => ({}))) as { error?: string };
            if (!res.ok) {
                setError(data.error ?? "Something went wrong.");
                setSubmitting(false);
                return;
            }
            setDone(true);
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    if (done) {
        return (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 px-6 py-10 text-center max-w-lg mx-auto">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 mb-4">
                    <CalendarClock size={28} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">You&apos;re booked in</h2>
                <p className="text-slate-600 leading-relaxed">
                    Thanks, {name.trim() || "there"}. We received your appointment request and will email you at{" "}
                    <span className="font-medium text-slate-800">{email}</span> with a confirmation or follow-up
                    shortly. Times are stored in UTC and our team sees them in the office timezone too.
                </p>
            </div>
        );
    }

    const today = new Date().toISOString().slice(0, 10);

    return (
        <form onSubmit={onSubmit} className="max-w-xl mx-auto space-y-8">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
                    <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                        placeholder="Your name"
                        autoComplete="name"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                    <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                        placeholder="you@company.com"
                        autoComplete="email"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Country</label>
                    <select
                        value={countryName}
                        onChange={(e) => setCountryName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                    >
                        {COUNTRY_OPTIONS.map((c) => (
                            <option key={c.code} value={c.name}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Your timezone</label>
                    <p className="text-xs text-slate-500 mb-2">
                        We detected <span className="font-medium text-slate-700">{detectedTz}</span>. Adjust if
                        needed so we convert your time correctly to UTC.
                    </p>
                    <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                    >
                        {tzOptions.map((z) => (
                            <option key={z.value} value={z.value}>
                                {z.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/80 space-y-4">
                <p className="text-sm font-semibold text-slate-800">How should we schedule?</p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="mode"
                            checked={mode === "specific"}
                            onChange={() => setMode("specific")}
                            className="text-blue-700"
                        />
                        <span className="text-sm text-slate-800">Pick a specific date &amp; time</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="mode"
                            checked={mode === "range"}
                            onChange={() => setMode("range")}
                            className="text-blue-700"
                        />
                        <span className="text-sm text-slate-800">Share an available time range</span>
                    </label>
                </div>

                {mode === "specific" ? (
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
                            <input
                                type="date"
                                min={today}
                                required={mode === "specific"}
                                value={dateStr}
                                onChange={(e) => setDateStr(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Time</label>
                            <input
                                type="time"
                                required={mode === "specific"}
                                value={timeStr}
                                onChange={(e) => setTimeStr(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
                            <input
                                type="date"
                                min={today}
                                required={mode === "range"}
                                value={rangeDateStr}
                                onChange={(e) => setRangeDateStr(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900"
                            />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">From</label>
                                <input
                                    type="time"
                                    value={rangeStart}
                                    onChange={(e) => setRangeStart(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">To</label>
                                <input
                                    type="time"
                                    value={rangeEnd}
                                    onChange={(e) => setRangeEnd(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900"
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="rounded-xl bg-white border border-blue-100 px-4 py-3 text-sm text-slate-700">
                    <p className="font-semibold text-blue-900 mb-1">Your local time</p>
                    {mode === "specific" && previewSpecific && (
                        <p className="leading-relaxed">
                            {previewSpecific.localLabel}
                            <span className="block text-xs text-slate-500 mt-1">Stored as UTC: {previewSpecific.utcLabel}</span>
                        </p>
                    )}
                    {mode === "range" && previewRange && (
                        <p className="leading-relaxed">
                            {previewRange.localLabel}
                            <span className="block text-xs text-slate-500 mt-1">
                                Range bounds are saved in UTC for our team calendar.
                            </span>
                        </p>
                    )}
                    {mode === "specific" && !previewSpecific && (
                        <p className="text-slate-500">Choose a date and time to see a preview.</p>
                    )}
                    {mode === "range" && !previewRange && <p className="text-slate-500">Choose a date and range.</p>}
                </div>
            </div>

            {error && (
                <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-2">{error}</p>
            )}

            <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-3.5 transition-colors disabled:opacity-60"
            >
                {submitting ? (
                    <>
                        <Loader2 className="animate-spin" size={18} />
                        Sending…
                    </>
                ) : (
                    "Request appointment"
                )}
            </button>
        </form>
    );
}
