"use client";

import { useActionState } from "react";
import Link from "next/link";
import RyovaxLogo from "@/components/brand/RyovaxLogo";
import { portalLogin, type PortalLoginState } from "./actions";

type Props = {
    nextPath: string;
};

export default function BuyerLoginForm({ nextPath }: Props) {
    const [state, formAction, pending] = useActionState(portalLogin, null as PortalLoginState);

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
            <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-blue-700 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-800 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 max-w-lg text-center">
                    <div className="inline-block bg-white rounded-2xl px-10 py-6 shadow-lg mb-8">
                        <RyovaxLogo priority heightClass="h-28 sm:h-32 md:h-40" />
                    </div>
                    <h1 className="text-4xl font-bold mb-6 leading-tight">Welcome back to Ryovax</h1>
                    <p className="text-blue-100 text-lg leading-relaxed">
                        Sign in after your account has been approved by our team.
                    </p>
                </div>
            </div>

            <div className="flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-24 py-8 sm:py-0">
                <div className="flex lg:hidden items-center justify-center sm:justify-start mb-8 sm:mb-12">
                    <RyovaxLogo priority heightClass="h-14 sm:h-[4.5rem] md:h-20" />
                </div>

                <div className="max-w-md w-full mx-auto min-w-0">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Sign in</h2>
                    <p className="text-slate-600 mb-8">Use the email and password you registered with.</p>

                    <form action={formAction} className="space-y-6">
                        <input type="hidden" name="next" value={nextPath} />

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                            <input
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                placeholder="you@company.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                            <input
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {state?.error ? (
                            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                                {state.error}
                            </p>
                        ) : null}

                        <button
                            type="submit"
                            disabled={pending}
                            className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all shadow-md"
                        >
                            {pending ? "Signing in…" : "Sign in"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-600">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/register" className="font-semibold text-blue-700 hover:text-blue-800 transition-colors">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
