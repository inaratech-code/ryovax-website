import { Building2 } from "lucide-react";
import AdminUserDirectoryTable from "@/components/admin/AdminUserDirectoryTable";
import { listUserRegistrations } from "@/lib/user-registrations-store";
import { setBuyerActive } from "./actions";

export default async function AdminBuyersPage() {
    const all = await listUserRegistrations();
    const rows = all
        .filter((u) => u.role === "buyer")
        .map((u) => ({ ...u, role: "buyer" as const }));

    return (
        <div className="space-y-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2 sm:gap-3">
                <Building2 className="text-blue-700 shrink-0 w-7 h-7 sm:w-8 sm:h-8" />
                <span>Buyers</span>
            </h1>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <AdminUserDirectoryTable rows={rows} setActive={setBuyerActive} />
            </div>
        </div>
    );
}
