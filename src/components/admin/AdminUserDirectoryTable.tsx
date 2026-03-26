"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { UserRegistration } from "@/lib/user-registrations-store";

export type DirectoryRow = Pick<
    UserRegistration,
    "id" | "companyName" | "firstName" | "lastName" | "email" | "createdAt" | "updatedAt" | "status" | "role"
>;

type Props = {
    rows: DirectoryRow[];
    /** Server action that toggles approved/rejected behind the scenes. */
    setActive: (id: string, active: boolean) => Promise<unknown>;
};

function displayName(row: DirectoryRow): string {
    const first = row.firstName?.trim() ?? "";
    const last = row.lastName?.trim() ?? "";
    const full = `${first} ${last}`.trim();
    return full || "—";
}

function fmtDate(iso: string | undefined): string {
    if (!iso) return "—";
    try {
        return new Date(iso).toLocaleString(undefined, {
            year: "numeric",
            month: "short",
            day: "2-digit",
        });
    } catch {
        return iso;
    }
}

export default function AdminUserDirectoryTable({ rows, setActive }: Props) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    if (rows.length === 0) {
        return (
            <p className="text-slate-600 text-sm py-6 px-6 text-center">No registrations yet.</p>
        );
    }

    return (
        <div className="p-0 overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                    <tr>
                        <th className="px-6 py-4">Company</th>
                        <th className="px-6 py-4">Contact</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Created</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {rows.map((row) => {
                        const active = row.status === "approved";
                        const statusLabel = active ? "Active" : "Inactive";
                        const statusTone = active
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-700";

                        return (
                            <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">{row.companyName || "—"}</td>
                                <td className="px-6 py-4 text-slate-700">{displayName(row)}</td>
                                <td className="px-6 py-4 text-slate-700">{row.email || "—"}</td>
                                <td className="px-6 py-4 text-slate-600">{fmtDate(row.createdAt)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusTone}`}>
                                        {statusLabel}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        type="button"
                                        disabled={pending}
                                        onClick={() => {
                                            startTransition(() => {
                                                void (async () => {
                                                    await setActive(row.id, !active);
                                                    router.refresh();
                                                })();
                                            });
                                        }}
                                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                                            active
                                                ? "bg-slate-100 text-slate-800 hover:bg-slate-200"
                                                : "bg-emerald-600 text-white hover:bg-emerald-700"
                                        }`}
                                    >
                                        {active ? "Deactivate" : "Activate"}
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
