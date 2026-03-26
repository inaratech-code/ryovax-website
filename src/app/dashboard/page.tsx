import Link from "next/link";
import { Package, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { countBuyingRequestsForBuyer, listBuyingRequestsForBuyer } from "@/lib/buying-requests-store";
import { getBuyerDashboardCounts } from "@/lib/buyer-dashboard-data";
import { getPortalSessionFromCookies } from "@/lib/portal-session-server";

function formatDate(iso: string) {
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

export default async function DashboardOverview() {
    const session = await getPortalSessionFromCookies();
    // Layout already redirects unauthenticated users, but keep this page safe too.
    if (!session) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center text-slate-600">
                Please sign in to view your dashboard.
            </div>
        );
    }

    const [counts, recentRequests, totalRfqs] = await Promise.all([
        getBuyerDashboardCounts(session.regId),
        listBuyingRequestsForBuyer(session.regId, 6),
        countBuyingRequestsForBuyer(session.regId),
    ]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
                <div className="text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200 w-fit shrink-0">
                    Last 30 Days
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center">
                            <Package size={24} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-slate-500 text-sm font-medium mb-1">Open buying requests</h3>
                        <p className="text-3xl font-bold text-slate-900">{counts.openBuyingRequests}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-saffron-50 text-saffron-600 rounded-xl flex items-center justify-center">
                            <Clock size={24} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-slate-500 text-sm font-medium mb-1">Awaiting quotes</h3>
                        <p className="text-3xl font-bold text-slate-900">{counts.awaitingQuotes}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center">
                            <ShieldCheck size={24} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-slate-500 text-sm font-medium mb-1">Verified suppliers</h3>
                        <p className="text-3xl font-bold text-slate-900">{counts.verifiedSuppliers}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                            <CheckCircle2 size={24} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-slate-500 text-sm font-medium mb-1">Completed orders</h3>
                        <p className="text-3xl font-bold text-slate-900">{counts.completedOrders}</p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div id="recent-requests" className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm scroll-mt-24">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-lg text-slate-900">Recent requests</h3>
                        <Link href="/dashboard#recent-requests" className="text-sm font-medium text-blue-700 hover:text-blue-800">
                            View All
                        </Link>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        {recentRequests.length === 0 ? (
                            <p className="text-slate-500 text-sm py-8 px-6 text-center">No requests yet.</p>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Request #</th>
                                        <th className="px-6 py-4">Product</th>
                                        <th className="px-6 py-4">Quantity</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentRequests.map((row) => (
                                        <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900">{row.id}</td>
                                            <td className="px-6 py-4 text-slate-600">{row.productName}</td>
                                            <td className="px-6 py-4 text-slate-600">{row.quantity}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        row.status === "Completed"
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : row.status === "Active"
                                                              ? "bg-blue-100 text-blue-700"
                                                              : row.status === "Pending"
                                                                ? "bg-saffron-100 text-saffron-700"
                                                                : "bg-indigo-100 text-indigo-700"
                                                    }`}
                                                >
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">{formatDate(row.createdAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
                    <h3 className="font-bold text-lg text-slate-900 mb-4">Activity summary</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Figures above are computed from Firestore: your open and completed buying requests and approved
                        supplier registrations. Add category fields to RFQs to enable a detailed spend breakdown later.
                    </p>
                    <div className="mt-6 pt-6 border-t border-slate-100 space-y-3 text-sm">
                        <div className="flex justify-between text-slate-600">
                            <span>Total RFQs tracked</span>
                            <span className="font-semibold text-slate-900">{totalRfqs}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
