"use client";

import { useState } from "react";
import { Factory, UserCheck } from "lucide-react";

type ApprovalRow = {
    name: string;
    role: "Supplier" | "Buyer";
    status: "Pending" | "Approved" | "Rejected";
};

const initialRows: ApprovalRow[] = [
    { name: "NeoTech Manufacturing", role: "Supplier", status: "Pending" },
    { name: "Global Supply Co", role: "Buyer", status: "Pending" },
    { name: "Reliance Ind.", role: "Supplier", status: "Approved" },
    { name: "BuildMart", role: "Buyer", status: "Approved" },
];

export default function AdminUserApprovalTable() {
    const [rows, setRows] = useState(initialRows);

    function approve(name: string) {
        setRows((prev) => prev.map((r) => (r.name === name ? { ...r, status: "Approved" } : r)));
    }

    function reject(name: string) {
        setRows((prev) => prev.map((r) => (r.name === name ? { ...r, status: "Rejected" } : r)));
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
                    {rows.map((row) => (
                        <tr key={row.name} className="hover:bg-slate-50 transition-colors">
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
                                            onClick={() => approve(row.name)}
                                            className="bg-emerald-600 text-white px-3 py-1 rounded-lg hover:bg-emerald-700 font-medium transition-colors"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => reject(row.name)}
                                            className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg hover:bg-slate-200 font-medium transition-colors"
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
