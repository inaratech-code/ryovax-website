import Link from "next/link";
import RyovaxLogo from "@/components/brand/RyovaxLogo";

export const metadata = {
    title: "Registration pending",
    robots: { index: false, follow: false },
};

export default function PendingApprovalPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-slate-50 py-12">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm text-center">
                <div className="flex justify-center mb-6">
                    <RyovaxLogo priority heightClass="h-14 sm:h-16" />
                </div>
                <h1 className="text-xl font-bold text-slate-900 mb-2">Thanks for registering</h1>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    Your profile is <strong>pending admin approval</strong>. You will not be able to sign in to the buyer or
                    supplier dashboard until our team approves your account.
                </p>
                <p className="text-slate-500 text-xs mb-8">
                    We will use your email on file. If you need to reach us sooner, use{" "}
                    <Link href="/contact" className="text-blue-700 font-medium hover:underline">
                        contact
                    </Link>
                    .
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/auth/login"
                        className="inline-flex justify-center rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-3 text-sm transition-colors"
                    >
                        Back to sign in
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex justify-center rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-medium px-5 py-3 text-sm transition-colors"
                    >
                        Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
