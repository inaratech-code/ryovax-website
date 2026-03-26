import { FileText } from "lucide-react";

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

export default async function AdminRfqsPage() {
    let loadError = "";
    let requests: Array<{
        id: string;
        buyerDisplay: string;
        productName: string;
        quantity: string;
        status: string;
        createdAt: string;
    }> = [];

    try {
        const { listBuyingRequests } = await import("@/lib/buying-requests-store");
        requests = await listBuyingRequests();
    } catch {
        loadError =
            "RFQs data could not be loaded. Check Firebase admin runtime secrets and redeploy.";
    }

    return (
        <div className="space-y-8">
            {loadError ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900 text-sm">
                    {loadError}
                </div>
            ) : null}

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2 sm:gap-3">
                <FileText className="text-blue-700 shrink-0 w-7 h-7 sm:w-8 sm:h-8" />
                <span>All buying requests</span>
            </h1>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <p className="text-slate-600 text-sm">
                        Every request stored in Firestore ({requests.length} total).
                    </p>
                </div>
                <div className="overflow-x-auto">
                    {requests.length === 0 ? (
                        <p className="text-slate-500 text-sm py-12 px-6 text-center">
                            No buying requests yet. Seed demo data with{" "}
                            <code className="text-xs bg-slate-100 px-1 rounded">npm run seed:firestore</code> or add
                            documents in Firebase.
                        </p>
                    ) : (
                        <table className="w-full min-w-[720px] text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium">
                                <tr>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Buyer</th>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Quantity</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {requests.map((row) => (
                                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{row.id}</td>
                                        <td className="px-6 py-4 text-slate-600">{row.buyerDisplay}</td>
                                        <td className="px-6 py-4 text-slate-600">{row.productName}</td>
                                        <td className="px-6 py-4 text-slate-600">{row.quantity}</td>
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
                                        <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{formatDate(row.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
