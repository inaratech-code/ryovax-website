"use client";

import { useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatInTimeZone } from "date-fns-tz";
import { Globe2, Loader2 } from "lucide-react";
import type { AppointmentRecord } from "@/lib/appointments-store";
import { saveAdminAppointmentNotes, saveAdminAppointmentSlot } from "@/app/admin/(dashboard)/appointments/actions";

function safeFormat(utcIso: string | null | undefined, tz: string, pattern: string) {
    if (!utcIso) return "—";
    try {
        return formatInTimeZone(new Date(utcIso), tz, pattern);
    } catch {
        return utcIso;
    }
}

export default function AdminAppointmentsPanel({
    initial,
    adminTimezone,
}: {
    initial: AppointmentRecord[];
    adminTimezone: string;
}) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    const rows = useMemo(() => initial, [initial]);

    function refresh() {
        router.refresh();
    }

    if (rows.length === 0) {
        return <p className="text-slate-500 text-sm py-8 text-center">No appointments yet.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-sm text-left">
                <thead>
                    <tr className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                        <th className="px-4 py-3">Name / Email</th>
                        <th className="px-4 py-3">Country · TZ</th>
                        <th className="px-4 py-3">User local</th>
                        <th className="px-4 py-3">
                            <span className="inline-flex items-center gap-1">
                                <Globe2 size={14} />
                                Admin ({adminTimezone})
                            </span>
                        </th>
                        <th className="px-4 py-3">Admin slot</th>
                        <th className="px-4 py-3">Notes</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {rows.map((a) => (
                        <tr key={a.id} className="align-top hover:bg-slate-50/80">
                            <td className="px-4 py-4">
                                <p className="font-semibold text-slate-900">{a.name}</p>
                                <p className="text-slate-500 text-xs mt-0.5">{a.email}</p>
                                <p className="text-xs text-slate-400 mt-1 font-mono">{a.id}</p>
                            </td>
                            <td className="px-4 py-4">
                                <p className="text-slate-800">{a.country}</p>
                                <p className="text-xs text-amber-800 bg-amber-50 inline-block px-2 py-0.5 rounded mt-1">
                                    {a.timezone}
                                </p>
                                {a.bookingMode === "range" && a.availabilityRangeLabel && (
                                    <p className="text-xs text-slate-600 mt-2 max-w-[220px]">
                                        Range: {a.availabilityRangeLabel}
                                    </p>
                                )}
                            </td>
                            <td className="px-4 py-4 text-slate-700">
                                {a.bookingMode === "specific" && a.preferredTimeUtc && (
                                    <span className="block">
                                        {safeFormat(a.preferredTimeUtc, a.timezone, "MMM d, yyyy · h:mm a")}
                                    </span>
                                )}
                                {a.bookingMode === "range" && (
                                    <span className="block space-y-1">
                                        {a.availabilityRangeStartUtc && (
                                            <span className="block text-xs">
                                                Start:{" "}
                                                {safeFormat(a.availabilityRangeStartUtc, a.timezone, "MMM d h:mm a")}
                                            </span>
                                        )}
                                        {a.availabilityRangeEndUtc && (
                                            <span className="block text-xs">
                                                End:{" "}
                                                {safeFormat(a.availabilityRangeEndUtc, a.timezone, "MMM d h:mm a")}
                                            </span>
                                        )}
                                    </span>
                                )}
                                {!a.preferredTimeUtc && a.bookingMode === "specific" && "—"}
                            </td>
                            <td className="px-4 py-4 text-slate-700 bg-blue-50/40">
                                {a.preferredTimeUtc && (
                                    <span className="block">
                                        {safeFormat(a.preferredTimeUtc, adminTimezone, "MMM d, yyyy · h:mm a")}
                                    </span>
                                )}
                                {a.bookingMode === "range" && a.availabilityRangeStartUtc && (
                                    <span className="block text-xs">
                                        {safeFormat(a.availabilityRangeStartUtc, adminTimezone, "MMM d h:mm a")} –{" "}
                                        {a.availabilityRangeEndUtc
                                            ? safeFormat(a.availabilityRangeEndUtc, adminTimezone, "h:mm a")
                                            : ""}
                                    </span>
                                )}
                            </td>
                            <td className="px-4 py-4">
                                <div className="flex flex-col gap-2 max-w-[200px]">
                                    <label className="text-xs text-slate-500">Schedule / adjust (admin local)</label>
                                    <input
                                        type="datetime-local"
                                        data-slot={a.id}
                                        defaultValue={
                                            a.adminScheduledAtUtc
                                                ? formatInTimeZone(
                                                      new Date(a.adminScheduledAtUtc),
                                                      adminTimezone,
                                                      "yyyy-MM-dd'T'HH:mm",
                                                  )
                                                : a.preferredTimeUtc
                                                  ? formatInTimeZone(
                                                        new Date(a.preferredTimeUtc),
                                                        adminTimezone,
                                                        "yyyy-MM-dd'T'HH:mm",
                                                    )
                                                  : ""
                                        }
                                        className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                                        disabled={pending}
                                    />
                                    <button
                                        type="button"
                                        disabled={pending}
                                        onClick={() => {
                                            const el = document.querySelector(
                                                `input[data-slot="${a.id}"]`,
                                            ) as HTMLInputElement | null;
                                            startTransition(async () => {
                                                await saveAdminAppointmentSlot(a.id, el?.value ?? "");
                                                refresh();
                                            });
                                        }}
                                        className="text-xs font-semibold bg-blue-700 text-white rounded-lg py-1.5 hover:bg-blue-800 disabled:opacity-50"
                                    >
                                        Save slot
                                    </button>
                                </div>
                                {a.adminScheduledAtUtc && (
                                    <p className="text-xs text-emerald-700 mt-2">
                                        Saved: {safeFormat(a.adminScheduledAtUtc, adminTimezone, "PPp")}
                                    </p>
                                )}
                            </td>
                            <td className="px-4 py-4">
                                <textarea
                                    data-notes={a.id}
                                    defaultValue={a.adminNotes ?? ""}
                                    placeholder="Internal notes…"
                                    rows={3}
                                    className="w-full max-w-[200px] rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                                    disabled={pending}
                                />
                                <button
                                    type="button"
                                    disabled={pending}
                                    onClick={() => {
                                        const el = document.querySelector(
                                            `textarea[data-notes="${a.id}"]`,
                                        ) as HTMLTextAreaElement | null;
                                        startTransition(async () => {
                                            await saveAdminAppointmentNotes(a.id, el?.value ?? "");
                                            refresh();
                                        });
                                    }}
                                    className="mt-1 text-xs font-semibold text-blue-700 hover:underline"
                                >
                                    Save notes
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {pending && (
                <p className="text-xs text-slate-500 flex items-center gap-2 mt-4">
                    <Loader2 className="animate-spin" size={14} />
                    Updating…
                </p>
            )}
        </div>
    );
}
