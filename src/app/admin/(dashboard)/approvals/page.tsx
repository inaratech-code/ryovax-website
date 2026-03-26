import { Flag } from "lucide-react";
import AdminUserApprovalTable from "@/components/admin/AdminUserApprovalTable";

export default async function AdminApprovalsPage() {
    let loadError = "";
    let rows: Array<{ id: string; name: string; role: "Supplier" | "Buyer"; status: "Pending" | "Approved" | "Rejected" }> = [];

    try {
        const [{ listUserRegistrations, userRegistrationToApprovalRow }] = await Promise.all([import("@/lib/user-registrations-store")]);
        const users = await listUserRegistrations();
        rows = users.map(userRegistrationToApprovalRow);
    } catch {
        loadError =
            "Approvals data could not be loaded. Check Firebase admin runtime secrets and redeploy.";
    }

    return (
        <div className="space-y-8">
            {loadError ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900 text-sm">
                    {loadError}
                </div>
            ) : null}

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2 sm:gap-3">
                <Flag className="text-blue-700 shrink-0 w-7 h-7 sm:w-8 sm:h-8" />
                <span>Approvals</span>
            </h1>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <p className="text-slate-600 text-sm">
                        Pending sign-ups and changes that need a decision. Data is loaded from Firestore.
                    </p>
                </div>
                <AdminUserApprovalTable initialRows={rows} />
            </div>
        </div>
    );
}
