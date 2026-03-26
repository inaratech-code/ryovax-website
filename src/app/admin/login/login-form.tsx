"use client";

import { useActionState } from "react";
import Link from "next/link";
import RyovaxLogo from "@/components/brand/RyovaxLogo";
import { adminLogin, type AdminLoginState } from "./actions";

type Props = {
    /** When `ADMIN_USERNAME` is set in env, user ID must match; otherwise only password is checked. */
    requireUserId: boolean;
};

export default function AdminLoginForm({ requireUserId }: Props) {
    const [state, formAction, pending] = useActionState(adminLogin, null as AdminLoginState);

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-slate-950 text-slate-100">
            <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-slate-900 border-r border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/40 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-800/60 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 max-w-lg text-center">
                    <div className="inline-block bg-white rounded-2xl px-10 py-6 shadow-lg mb-8">
                        <RyovaxLogo priority heightClass="h-28 sm:h-32 md:h-40" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4 leading-tight text-white">Admin console</h1>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Sign in to manage approvals, appointments, testimonials, and RFQs.
                    </p>
                </div>
            </div>

            <div className="flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-20 py-10">
                <div className="flex lg:hidden items-center justify-center mb-8">
                    <RyovaxLogo priority heightClass="h-14 sm:h-[4.5rem]" />
                </div>

                <div className="max-w-md w-full mx-auto min-w-0">
                    <h2 className="text-2xl font-bold text-white mb-1">Sign in</h2>
                    <p className="text-slate-400 mb-8 text-sm">
                        Enter your user ID and password.{" "}
                        <Link href="/" className="text-blue-400 hover:text-blue-300 font-medium">
                            Back to site
                        </Link>
                    </p>

                    <form action={formAction} className="space-y-5">
                        <div>
                            <label htmlFor="admin-username" className="block text-sm font-medium text-slate-300 mb-2">
                                User ID
                            </label>
                            <input
                                id="admin-username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required={requireUserId}
                                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder={requireUserId ? "Your admin user ID" : "Optional if not configured"}
                            />
                        </div>

                        <div>
                            <label htmlFor="admin-password" className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <input
                                id="admin-password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {state?.error ? (
                            <p className="text-sm text-red-400 bg-red-950/50 border border-red-900/60 rounded-lg px-3 py-2">
                                {state.error}
                            </p>
                        ) : null}

                        <button
                            type="submit"
                            disabled={pending}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all shadow-lg"
                        >
                            {pending ? "Signing in…" : "Sign in"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
