import { Building2 } from "lucide-react";
import AdminUserDirectoryTable from "@/components/admin/AdminUserDirectoryTable";

export default async function AdminBuyersPage() {
    let loadError = "";
    let setActive:
        | ((id: string, active: boolean) => Promise<unknown>)
        | undefined;
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
            { listUserRegistrations },
            { setBuyerActive },
        ] = await Promise.all([
            import("@/lib/user-registrations-store"),
            import("./actions"),
        ]);
        const all = await listUserRegistrations();
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

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <AdminUserDirectoryTable rows={rows} setActive={setActive} />
            </div>
        </div>
    );
}
