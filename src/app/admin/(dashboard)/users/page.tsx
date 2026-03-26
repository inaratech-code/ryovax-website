import Link from "next/link";
import { Users } from "lucide-react";

export default function AdminUsersPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2 sm:gap-3 min-w-0">
                    <Users className="text-blue-700 shrink-0 w-7 h-7 sm:w-8 sm:h-8" />
                    <span className="truncate">Users</span>
                </h1>
                <Link
                    href="/auth/register"
                    className="w-full sm:w-auto inline-flex justify-center bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm"
                >
                    + Add User
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center text-slate-600">
                Use the dedicated directories:
                <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/admin/buyers"
                        className="inline-flex justify-center rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-3 text-sm transition-colors"
                    >
                        Buyers
                    </Link>
                    <Link
                        href="/admin/suppliers"
                        className="inline-flex justify-center rounded-xl bg-saffron-500 hover:bg-saffron-600 text-slate-900 font-semibold px-5 py-3 text-sm transition-colors"
                    >
                        Suppliers
                    </Link>
                </div>
            </div>
        </div>
    );
}
