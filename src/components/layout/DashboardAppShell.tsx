"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import RyovaxLogo from "@/components/brand/RyovaxLogo";

export type ShellNavItem = {
    href: string;
    label: string;
    icon: ComponentType<{ size?: number; className?: string }>;
};

type DashboardAppShellProps = {
    navItems: ShellNavItem[];
    sidebarFooter?: ReactNode;
    header: ReactNode;
    children: ReactNode;
    sidebarTitle?: string;
    /** Admin uses blue-700 for active; dashboard uses blue-600 */
    activeTone?: "dashboard" | "admin";
};

export default function DashboardAppShell({
    navItems,
    sidebarFooter,
    header,
    children,
    sidebarTitle,
    activeTone = "dashboard",
}: DashboardAppShellProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();

    const activeBg = activeTone === "admin" ? "bg-blue-700 text-white" : "bg-blue-600 text-white";

    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    const isActive = (href: string) => {
        if (!href || href === "#") return false;
        if (href === "/dashboard") return pathname === "/dashboard";
        if (href === "/admin") return pathname === "/admin";
        if (pathname === href) return true;
        if (href.length > 1 && pathname.startsWith(`${href}/`)) return true;
        return false;
    };

    const navLinkClass = (href: string) => {
        const active = isActive(href);
        return active
            ? `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ease-out ${activeBg}`
            : "flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white font-medium transition-colors duration-200 ease-out";
    };

    const renderSidebarInner = (onClose?: () => void) => (
        <>
            <div className="min-h-[5.5rem] flex items-center gap-2 px-4 sm:px-5 border-b border-slate-800">
                {onClose ? (
                    <button
                        type="button"
                        className="shrink-0 p-2 rounded-lg bg-slate-800 text-white md:hidden"
                        onClick={onClose}
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>
                ) : null}
                <Link
                    href="/"
                    className="flex items-center gap-2 group text-white min-w-0 flex-1 border-0 outline-none ring-0 focus:outline-none focus-visible:outline-none"
                    onClick={() => onClose?.()}
                >
                    <RyovaxLogo
                        priority
                        heightClass="h-11 w-auto max-w-full sm:h-12"
                        className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] object-contain object-left shrink min-w-0"
                    />
                    {sidebarTitle ? (
                        <span className="text-base sm:text-lg font-bold tracking-tight truncate">{sidebarTitle}</span>
                    ) : null}
                </Link>
            </div>

            <nav className="flex-1 py-6 px-3 sm:px-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <Link
                        key={`${item.href}-${item.label}`}
                        href={item.href}
                        className={navLinkClass(item.href)}
                        onClick={() => onClose?.()}
                    >
                        <item.icon size={20} className="shrink-0" />
                        {item.label}
                    </Link>
                ))}
            </nav>

            {sidebarFooter ? <div className="p-4 border-t border-slate-800 shrink-0">{sidebarFooter}</div> : null}
        </>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <aside className="w-72 bg-slate-900 text-slate-300 hidden md:flex flex-col border-r border-slate-800 shrink-0">
                {renderSidebarInner()}
            </aside>

            {mobileOpen ? (
                <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setMobileOpen(false)}
                        aria-label="Close menu"
                    />
                    <aside className="absolute left-0 top-0 bottom-0 w-[min(100%,20rem)] bg-slate-900 text-slate-300 flex flex-col shadow-xl border-r border-slate-800">
                        {renderSidebarInner(() => setMobileOpen(false))}
                    </aside>
                </div>
            ) : null}

            <div className="flex-1 flex flex-col min-w-0">
                <div className="md:hidden flex items-center justify-between gap-2 px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-40">
                    <Link href="/" className="min-w-0 flex-1 border-0 outline-none" onClick={() => setMobileOpen(false)}>
                        <RyovaxLogo
                            priority
                            heightClass="h-10 max-h-10 w-auto max-w-[min(100%,220px)]"
                            className="object-contain object-left"
                        />
                    </Link>
                    <button
                        type="button"
                        className="shrink-0 p-2.5 rounded-lg bg-slate-900 text-white"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu size={22} />
                    </button>
                </div>

                {header}

                <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 sm:px-6 md:px-8 bg-slate-50 scroll-smooth [scrollbar-gutter:stable]">{children}</main>
            </div>
        </div>
    );
}
