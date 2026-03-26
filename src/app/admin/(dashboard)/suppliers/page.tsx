import { Factory } from "lucide-react";
import AdminUserDirectoryTable from "@/components/admin/AdminUserDirectoryTable";
import { setSupplierActive } from "./actions";

export default async function AdminSuppliersPage() {
    let loadError = "";
    let rows: Array<{
        id: string;
        companyName: string;
        firstName?: string;
        lastName?: string;
        email: string;
        createdAt: string;
        updatedAt?: string;
        status: "pending" | "approved" | "rejected";
        role: "supplier";
    }> = [];

    try {
        const { listUserRegistrations } = await import("@/lib/user-registrations-store");
        const all = await listUserRegistrations();
        rows = all
            .filter((u) => u.role === "supplier")
            .map((u) => ({ ...u, role: "supplier" as const }));
    } catch {
        loadError =
            "Suppliers data could not be loaded. Check Firebase admin runtime secrets and redeploy.";
    }

    return (
        <div className="space-y-8">
            {loadError ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900 text-sm">
                    {loadError}
                </div>
            ) : null}

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2 sm:gap-3">
                <Factory className="text-saffron-600 shrink-0 w-7 h-7 sm:w-8 sm:h-8" />
                <span>Suppliers</span>
            </h1>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <AdminUserDirectoryTable rows={rows} setActive={setSupplierActive} />
            </div>
        </div>
    );
}
