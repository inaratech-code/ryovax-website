"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function AdminDashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const [show, setShow] = useState(true);

    // Ensure we hide the error quickly after reset to avoid stale UI flicker.
    useEffect(() => {
        setShow(true);
    }, [error]);

    return show ? (
        <div className="space-y-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900 text-sm flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 mt-0.5" />
                <div>
                    <div className="font-semibold">Admin page failed to load</div>
                    <div className="text-amber-900/80">
                        This is usually due to Firebase/runtime configuration on Cloudflare. Try reloading or retry.
                    </div>
                    {process.env.NODE_ENV === "development" && error?.message ? (
                        <div className="mt-2 text-xs bg-amber-100/60 p-2 rounded border border-amber-200 overflow-auto">
                            {error.message}
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
                <button
                    type="button"
                    onClick={() => {
                        reset();
                        setShow(false);
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 text-sm font-semibold transition-colors"
                >
                    <RefreshCcw size={16} />
                    Retry
                </button>
            </div>
        </div>
    ) : null;
}

