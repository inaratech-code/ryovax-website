import Link from "next/link";
import { Users, FileText, CheckCircle, Flag, Activity, ArrowRight } from "lucide-react";
import AdminUserApprovalTable from "@/components/admin/AdminUserApprovalTable";
import { getAdminDashboardStats } from "@/lib/admin-stats";
import { listBuyingRequests } from "@/lib/buying-requests-store";
import { listRecentUserRegistrations, userRegistrationToApprovalRow } from "@/lib/user-registrations-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatRequestDate(iso: string) {
    try {
        return new Date(iso).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch {
        return iso;
    }
}

export default async function AdminDashboard() {
    const [stats, approvalUsers, rfqs] = await Promise.all([
        getAdminDashboardStats(),
        listRecentUserRegistrations(8),
        listBuyingRequests(8),
    ]);
    const approvalRows = approvalUsers.map(userRegistrationToApprovalRow);

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Admin Overview</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center">
                            <Users size={24} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-slate-500 text-sm font-medium mb-1">Total Users</h3>
                        <p className="text-3xl font-bold text-slate-900">{stats.totalUsers.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-saffron-50 text-saffron-600 rounded-xl flex items-center justify-center">
                            <FileText size={24} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-slate-500 text-sm font-medium mb-1">Total buying requests</h3>
                        <p className="text-3xl font-bold text-slate-900">{stats.totalBuyingRequests.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center">
                            <Flag size={24} />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-md">
                            {stats.pendingApprovals} Pending
                        </span>
                    </div>
                    <div>
                        <h3 className="text-slate-500 text-sm font-medium mb-1">Approvals Required</h3>
                        <p className="text-3xl font-bold text-slate-900">{stats.pendingApprovals.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                            <CheckCircle size={24} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-slate-500 text-sm font-medium mb-1">Completed Deals</h3>
                        <p className="text-3xl font-bold text-slate-900">{stats.completedDeals.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 max-w-xl">
                <Link
                    href="/admin/analytics"
                    className="group bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-md transition-all flex items-center justify-between gap-4"
                >
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                            <Activity size={24} />
                        </div>
                        <div className="min-w-0">
                            <h2 className="font-bold text-slate-900">Web analytics</h2>
                            <p className="text-sm text-slate-500 truncate">Sessions, page views, top pages</p>
                        </div>
                    </div>
                    <ArrowRight className="text-slate-400 group-hover:text-blue-700 shrink-0" size={20} />
                </Link>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-lg text-slate-900">Recent User Approvals</h3>
                        <Link href="/admin/users" className="text-sm font-medium text-blue-700 hover:text-blue-800">
                            View All
                        </Link>
                    </div>
                    <AdminUserApprovalTable initialRows={approvalRows} />
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-lg text-slate-900">Recent requests on the platform</h3>
                        <Link href="/admin/rfqs" className="text-sm font-medium text-blue-700 hover:text-blue-800">
                            View All
                        </Link>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        {rfqs.length === 0 ? (
                            <p className="text-slate-500 text-sm py-8 px-6 text-center">No buying requests yet.</p>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Buyer</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {rfqs.map((row) => (
                                        <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900">{row.id}</td>
                                            <td className="px-6 py-4 text-slate-600">{row.buyerDisplay}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        row.status === "Closed"
                                                            ? "bg-slate-100 text-slate-700"
                                                            : row.status === "Active"
                                                              ? "bg-blue-100 text-blue-700"
                                                              : row.status === "Completed"
                                                                ? "bg-emerald-100 text-emerald-700"
                                                                : "bg-saffron-100 text-saffron-700"
                                                    }`}
                                                >
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">{formatRequestDate(row.createdAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
