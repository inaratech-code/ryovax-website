import Link from "next/link";
import RyovaxLogo from "@/components/brand/RyovaxLogo";

/**
 * Shown when visiting /admin/login but ADMIN_PASSWORD is not set — the page used to redirect to /admin,
 * which made it look like the login URL was broken.
 */
export default function AdminLoginSetupHint() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-slate-950 text-slate-100 py-12">
            <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/80 p-8 sm:p-10 shadow-xl">
                <div className="flex justify-center mb-6">
                    <RyovaxLogo priority heightClass="h-16 sm:h-20" />
                </div>
                <h1 className="text-xl font-bold text-white text-center mb-2">User ID / password login is off</h1>
                <p className="text-slate-400 text-sm text-center mb-6 leading-relaxed">
                    To sign in with <strong className="text-slate-200">User ID</strong> and{" "}
                    <strong className="text-slate-200">password</strong>, add to{" "}
                    <code className="text-blue-300 text-xs">.env.local</code>:{" "}
                    <code className="text-blue-300 text-xs">ADMIN_USERNAME</code> (your user ID),{" "}
                    <code className="text-blue-300 text-xs">ADMIN_PASSWORD</code>, and{" "}
                    <code className="text-blue-300 text-xs">ADMIN_SESSION_SECRET</code> (16+ random characters for the
                    server—nothing you type on this page). Then restart <code className="text-blue-300 text-xs">npm run dev</code>.
                </p>
                <p className="text-slate-500 text-xs text-center mb-6">
                    Until then, the admin area works without a password in development (see middleware).
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/admin"
                        className="inline-flex justify-center rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-3 text-sm transition-colors"
                    >
                        Open admin dashboard
                    </Link>
                    <Link href="/" className="inline-flex justify-center rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium px-5 py-3 text-sm transition-colors">
                        Back to site
                    </Link>
                </div>
            </div>
        </div>
    );
}
