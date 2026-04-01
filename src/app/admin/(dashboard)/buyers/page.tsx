import { Building2, CheckCircle, Clock } from "lucide-react";
import AdminUserDirectoryTable from "@/components/admin/AdminUserDirectoryTable";

export default async function AdminBuyersPage() {
    let loadError = "";
    let setActive:
        | ((id: string, active: boolean) => Promise<unknown>)
        | undefined;
    let approvedCount = 0;
    let pendingCount = 0;
    let rows: Array<{
        id: string;
        companyName: string;
        firstName?: string;
        lastName?: string;
        email: string;
        createdAt: string;
        updatedAt?: string;
        status: "pending" | "approved" | "rejected";
        role: "buyer";
    }> = [];

    try {
        const [
            { listUserRegistrations, countApprovedUserRegistrationsByRole, countUserRegistrationsByRoleAndStatus },
            { setBuyerActive },
        ] = await Promise.all([
            import("@/lib/user-registrations-store"),
            import("./actions"),
        ]);
        const [all, approved, pending] = await Promise.all([
            listUserRegistrations(),
            countApprovedUserRegistrationsByRole("buyer"),
            countUserRegistrationsByRoleAndStatus("buyer", "pending"),
        ]);
        approvedCount = approved;
        pendingCount = pending;
        rows = all
            .filter((u) => u.role === "buyer")
            .map((u) => ({ ...u, role: "buyer" as const }));
        setActive = setBuyerActive;
    } catch {
        loadError =
            "Buyers data could not be loaded. Check Firebase admin runtime secrets and redeploy.";
    }

    return (
        <div className="space-y-8">
            {loadError ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900 text-sm">
                    {loadError}
                </div>
            ) : null}

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2 sm:gap-3">
                <Building2 className="text-blue-700 shrink-0 w-7 h-7 sm:w-8 sm:h-8" />
                <span>Buyers</span>
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Approved</p>
                        <p className="mt-1 text-3xl font-bold text-slate-900 tabular-nums">{approvedCount.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <CheckCircle size={22} />
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Pending</p>
                        <p className="mt-1 text-3xl font-bold text-slate-900 tabular-nums">{pendingCount.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                        <Clock size={22} />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <AdminUserDirectoryTable rows={rows} setActive={setActive} />
            </div>
        </div>
    );
}
