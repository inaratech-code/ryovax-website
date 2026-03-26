import { Factory } from "lucide-react";
import AdminUserDirectoryTable from "@/components/admin/AdminUserDirectoryTable";
import { listUserRegistrations } from "@/lib/user-registrations-store";
import { setSupplierActive } from "./actions";

export default async function AdminSuppliersPage() {
    const all = await listUserRegistrations();
    const rows = all
        .filter((u) => u.role === "supplier")
        .map((u) => ({ ...u, role: "supplier" as const }));

    return (
        <div className="space-y-8">
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
