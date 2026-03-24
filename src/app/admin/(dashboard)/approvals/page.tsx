import { Flag } from "lucide-react";
import AdminUserApprovalTable from "@/components/admin/AdminUserApprovalTable";
import { listUserRegistrations, userRegistrationToApprovalRow } from "@/lib/user-registrations-store";

export default async function AdminApprovalsPage() {
    const users = await listUserRegistrations();
    const rows = users.map(userRegistrationToApprovalRow);

    return (
        <div className="space-y-8">
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
