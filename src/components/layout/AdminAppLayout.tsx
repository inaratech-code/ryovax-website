"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Users,
    FileText,
    Settings,
    LayoutDashboard,
    Flag,
    MessageSquareQuote,
    RefreshCcw,
    CalendarClock,
} from "lucide-react";
import Link from "next/link";
import DashboardAppShell from "@/components/layout/DashboardAppShell";

const navItems = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/buyers", label: "Buyers", icon: Users },
    { href: "/admin/suppliers", label: "Suppliers", icon: Users },
    { href: "/admin/rfqs", label: "All requests", icon: FileText },
    { href: "/admin/appointments", label: "Appointments", icon: CalendarClock },
    { href: "/admin/approvals", label: "Approvals", icon: Flag },
    { href: "/admin/testimonials", label: "POV & testimonials", icon: MessageSquareQuote },
];

export default function AdminAppLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);

    const sidebarFooter = (
        <>
            <Link
                href="/admin/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white font-medium transition-colors"
            >
                <Settings size={20} />
                Settings
            </Link>
            <div className="mt-4 flex items-center gap-3 px-4 py-2">
                <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-white shrink-0">
                    A
                </div>
                <div className="text-sm min-w-0">
                    <p className="font-semibold text-white truncate">Admin User</p>
                    <p className="text-slate-500 text-xs truncate">Superadmin</p>
                </div>
            </div>
        </>
    );

    const header = (
        <header className="min-h-[4.5rem] bg-white border-b border-slate-200 flex items-center justify-end gap-2 px-4 sm:px-6 md:px-8 py-3 md:sticky md:top-0 md:z-20">
            <button
                type="button"
                onClick={() => {
                    setRefreshing(true);
                    startTransition(() => {
                        router.refresh();
                    });
                    setTimeout(() => setRefreshing(false), 450);
                }}
                className="p-2 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-slate-100 transition-colors"
                aria-label="Refresh page"
                title="Refresh page"
            >
                <RefreshCcw size={18} className={refreshing ? "animate-spin" : ""} />
            </button>
            <form action="/admin/logout" method="post">
                <button
                    type="submit"
                    className="text-sm font-bold text-slate-700 hover:text-blue-700 transition-colors duration-200 ease-out px-2 py-1 rounded-md hover:bg-slate-50"
                >
                    Log out
                </button>
            </form>
        </header>
    );

    return (
        <DashboardAppShell
            navItems={navItems}
            sidebarFooter={sidebarFooter}
            header={header}
            sidebarTitle="Admin"
            activeTone="admin"
        >
            {children}
        </DashboardAppShell>
    );
}
