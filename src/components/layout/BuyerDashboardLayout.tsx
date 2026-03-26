"use client";

import {
    Bell,
    Search,
    LayoutDashboard,
    FileText,
    Settings,
    Users,
    Truck,
} from "lucide-react";
import Link from "next/link";
import DashboardAppShell from "@/components/layout/DashboardAppShell";
import { portalLogout } from "@/app/auth/login/actions";

type Props = {
    children: React.ReactNode;
    userEmail: string;
    companyName: string;
    role: "buyer" | "supplier";
};

export default function BuyerDashboardLayout({ children, userEmail, companyName, role }: Props) {
    const base = role === "supplier" ? "/dashboard/supplier" : "/dashboard";

    const navItems = [
        { href: base, label: "Overview", icon: LayoutDashboard },
        { href: `${base}#recent-requests`, label: "Buying requests", icon: FileText },
        { href: "/services", label: "Shipments", icon: Truck },
        { href: "/about", label: "Network", icon: Users },
    ];

    const sidebarFooter = (
        <>
            <Link
                href="/contact"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white font-medium transition-colors"
            >
                <Settings size={20} />
                Help &amp; settings
            </Link>
            <div className="mt-4 flex items-center gap-3 px-4 py-2">
                <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {companyName.slice(0, 1).toUpperCase()}
                </div>
                <div className="text-sm min-w-0 flex-1">
                    <p className="font-semibold text-white truncate">{companyName || userEmail}</p>
                    <p className="text-slate-500 text-xs truncate">{userEmail}</p>
                </div>
            </div>
            <form action={portalLogout} className="px-4 pt-2">
                <button
                    type="submit"
                    className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                    Log out
                </button>
            </form>
        </>
    );

    const header = (
        <header className="min-h-[4.5rem] bg-white border-b border-slate-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 md:px-8 py-3 md:sticky md:top-0 md:z-20">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200 w-full min-w-0">
                <Search size={18} className="shrink-0" />
                <input
                    type="text"
                    placeholder="Search requests, shipments, partners…"
                    className="bg-transparent border-none outline-none text-sm w-full min-w-0 placeholder:text-slate-400 text-slate-900"
                />
            </div>

            <div className="flex items-center justify-end gap-4 sm:gap-6 shrink-0">
                <Link
                    href="/contact"
                    className="relative text-slate-500 hover:text-slate-700 transition-colors duration-200 p-1 rounded-md hover:bg-slate-100"
                    aria-label="Messages and updates"
                >
                    <Bell size={20} />
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-saffron-500 rounded-full border-2 border-white" />
                </Link>
                <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 sm:px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm whitespace-nowrap"
                >
                    + New buying request
                </Link>
            </div>
        </header>
    );

    return (
        <DashboardAppShell
            navItems={navItems}
            sidebarFooter={sidebarFooter}
            header={header}
            sidebarTitle={role === "supplier" ? "Supplier" : "Buyer"}
            activeTone="dashboard"
        >
            {children}
        </DashboardAppShell>
    );
}
