"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Factory, UserCheck } from "lucide-react";
import { approveUserRegistration, rejectUserRegistration } from "@/app/admin/(dashboard)/approvals/actions";
import type { UserApprovalRow } from "@/lib/user-registrations-store";

export default function AdminUserApprovalTable({ initialRows }: { initialRows: UserApprovalRow[] }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function approve(id: string) {
        startTransition(() => {
            void (async () => {
                await approveUserRegistration(id);
                router.refresh();
            })();
        });
    }

    function reject(id: string) {
        startTransition(() => {
            void (async () => {
                await rejectUserRegistration(id);
                router.refresh();
            })();
        });
    }

    if (initialRows.length === 0) {
        return (
            <p className="text-slate-600 text-sm py-6 px-6 text-center">
                No user registrations yet. Entries appear here when users sign up.
            </p>
        );
    }

    return (
        <div className="p-0 overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                    <tr>
                        <th className="px-6 py-4">Company</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {initialRows.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">{row.name}</td>
                            <td className="px-6 py-4">
                                <span
                                    className={`flex items-center gap-1.5 ${row.role === "Supplier" ? "text-saffron-600" : "text-blue-600"}`}
                                >
                                    {row.role === "Supplier" ? <Factory size={14} /> : <UserCheck size={14} />}
                                    {row.role}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        row.status === "Approved"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : row.status === "Rejected"
                                              ? "bg-slate-200 text-slate-700"
                                              : "bg-rose-100 text-rose-700"
                                    }`}
                                >
                                    {row.status}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                {row.status === "Pending" ? (
                                    <div className="flex gap-2 text-xs">
                                        <button
                                            type="button"
                                            disabled={isPending}
                                            onClick={() => approve(row.id)}
                                            className="bg-emerald-600 text-white px-3 py-1 rounded-lg hover:bg-emerald-700 font-medium transition-colors disabled:opacity-50"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            type="button"
                                            disabled={isPending}
                                            onClick={() => reject(row.id)}
                                            className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg hover:bg-slate-200 font-medium transition-colors disabled:opacity-50"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                ) : (
                                    <span className="text-slate-400 text-xs">Processed</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
