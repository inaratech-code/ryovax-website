"use client";

import { startTransition, useEffect, useMemo, useRef, useState } from "react";
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
    Bell,
    BellOff,
} from "lucide-react";
import Link from "next/link";
import DashboardAppShell from "@/components/layout/DashboardAppShell";

type NavCounts = {
    buyers: number;
    suppliers: number;
    requests: number;
    appointments: number;
    pendingApprovals: number;
    pendingTestimonials: number;
};

function playNotificationBeep() {
    try {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctx) return;
        const ctx = new Ctx();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = 880;
        g.gain.value = 0.0001;
        o.connect(g);
        g.connect(ctx.destination);
        const now = ctx.currentTime;
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
        o.start(now);
        o.stop(now + 0.2);
        o.onended = () => ctx.close().catch(() => undefined);
    } catch {
        /* ignore */
    }
}

export default function AdminAppLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);
    const [counts, setCounts] = useState<NavCounts | null>(null);
    const [soundEnabled, setSoundEnabled] = useState(() => {
        try {
            const v = window.localStorage.getItem("adminNotifSound");
            return v !== "off";
        } catch {
            return true;
        }
    });
    const lastNotifRef = useRef<number>(0);

    useEffect(() => {
        try {
            window.localStorage.setItem("adminNotifSound", soundEnabled ? "on" : "off");
        } catch {
            /* ignore */
        }
    }, [soundEnabled]);

    useEffect(() => {
        let cancelled = false;
        let t: number | undefined;

        const fetchCounts = async () => {
            try {
                const res = await fetch("/api/admin/nav-counts", { cache: "no-store" });
                if (!res.ok) return;
                const json = (await res.json()) as { ok: boolean; counts?: NavCounts };
                if (!json.ok || !json.counts) return;
                if (cancelled) return;
                setCounts(json.counts);

                const notifTotal = (json.counts.pendingApprovals ?? 0) + (json.counts.pendingTestimonials ?? 0);
                if (lastNotifRef.current === 0) {
                    lastNotifRef.current = notifTotal;
                } else if (notifTotal > lastNotifRef.current) {
                    lastNotifRef.current = notifTotal;
                    if (soundEnabled) playNotificationBeep();
                } else {
                    lastNotifRef.current = notifTotal;
                }
            } catch {
                /* ignore */
            }
        };

        const schedule = () => {
            if (t) window.clearInterval(t);
            t = window.setInterval(() => {
                if (document.visibilityState !== "visible") return;
                void fetchCounts();
            }, 25_000);
        };

        void fetchCounts();
        schedule();
        const onVis = () => {
            if (document.visibilityState === "visible") void fetchCounts();
        };
        window.addEventListener("visibilitychange", onVis);
        return () => {
            cancelled = true;
            window.removeEventListener("visibilitychange", onVis);
            if (t) window.clearInterval(t);
        };
    }, [soundEnabled]);

    const navItems = useMemo(() => {
        const base = [
            { href: "/admin", label: "Overview", icon: LayoutDashboard },
            { href: "/admin/buyers", label: "Buyers", icon: Users },
            { href: "/admin/suppliers", label: "Suppliers", icon: Users },
            { href: "/admin/rfqs", label: "All requests", icon: FileText },
            { href: "/admin/appointments", label: "Appointments", icon: CalendarClock },
            { href: "/admin/approvals", label: "Approvals", icon: Flag },
            { href: "/admin/testimonials", label: "POV & testimonials", icon: MessageSquareQuote },
        ] as const;

        const c = counts;
        return base.map((item) => {
            if (!c) return item;
            if (item.href === "/admin/approvals") return { ...item, badge: c.pendingApprovals };
            if (item.href === "/admin/testimonials") return { ...item, badge: c.pendingTestimonials };
            return item;
        });
    }, [counts]);

    const notifCount = (counts?.pendingApprovals ?? 0) + (counts?.pendingTestimonials ?? 0);

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
                onClick={() => setSoundEnabled((v) => !v)}
                className="relative p-2 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-slate-100 transition-colors"
                aria-label={soundEnabled ? "Disable notification sound" : "Enable notification sound"}
                title={soundEnabled ? "Notification sound: on" : "Notification sound: off"}
            >
                {soundEnabled ? <Bell size={18} /> : <BellOff size={18} />}
                {notifCount > 0 ? (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center tabular-nums">
                        {notifCount > 99 ? "99+" : String(notifCount)}
                    </span>
                ) : null}
            </button>
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
