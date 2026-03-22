"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Building2, Factory } from "lucide-react";
import RyovaxLogo from "@/components/brand/RyovaxLogo";

export default function RegisterPage() {
    const [role, setRole] = useState<"none" | "buyer" | "supplier">("none");

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
            {/* Visual Identity Panel */}
            <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/50 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-saffron-600/20 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 max-w-lg text-center">
                    <div className="inline-block bg-white rounded-2xl px-10 py-6 shadow-lg mb-8">
                        <RyovaxLogo priority heightClass="h-28 sm:h-32 md:h-40" />
                    </div>
                    <h1 className="text-4xl font-bold mb-6 leading-tight">Join the Network</h1>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Join buyers and sellers we’ve checked. Buy, sell, and track shipments without the usual headache.
                    </p>
                </div>
            </div>

            {/* Form Panel */}
            <div className="flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-24 py-8 sm:py-0">
                <div className="flex lg:hidden items-center justify-center sm:justify-start mb-8 sm:mb-12">
                    <RyovaxLogo priority heightClass="h-14 sm:h-[4.5rem] md:h-20" />
                </div>

                <div className="max-w-md w-full mx-auto min-w-0">
                    <div className="mb-10 text-center">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Create an account</h2>
                        <p className="text-slate-600">Select how you want to use the platform.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8">
                        <button
                            type="button"
                            onClick={() => setRole("buyer")}
                            className={`p-4 sm:p-6 border-2 rounded-2xl flex flex-col items-center text-center transition-all ${role === "buyer" ? "border-blue-600 bg-blue-50/50 shadow-sm" : "border-slate-200 hover:border-slate-300 bg-white"}`}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${role === "buyer" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                                <Building2 size={24} />
                            </div>
                            <h3 className={`font-bold mb-2 ${role === "buyer" ? "text-blue-900" : "text-slate-700"}`}>I'm a Buyer</h3>
                            <p className="text-xs text-slate-500">I want to request quotes and buy materials.</p>
                        </button>

                        <button
                            type="button"
                            onClick={() => setRole("supplier")}
                            className={`p-4 sm:p-6 border-2 rounded-2xl flex flex-col items-center text-center transition-all ${role === "supplier" ? "border-saffron-500 bg-saffron-50/50 shadow-sm" : "border-slate-200 hover:border-slate-300 bg-white"}`}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${role === "supplier" ? "bg-saffron-500 text-slate-900" : "bg-slate-100 text-slate-500"}`}>
                                <Factory size={24} />
                            </div>
                            <h3 className={`font-bold mb-2 ${role === "supplier" ? "text-saffron-900" : "text-slate-700"}`}>I'm a Supplier</h3>
                            <p className="text-xs text-slate-500">I want to quote on jobs and sell goods.</p>
                        </button>
                    </div>

                    {role !== "none" && (
                        <motion.form
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-5"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                                <input type="password" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600" />
                            </div>
                            <Link href={`/dashboard?role=${role}`} className={`w-full font-semibold py-3 rounded-xl transition-all shadow-md block text-center ${role === "buyer" ? "bg-blue-700 hover:bg-blue-800 text-white" : "bg-saffron-500 hover:bg-saffron-600 text-slate-900"}`}>
                                Register as {role === "buyer" ? "Buyer" : "Supplier"}
                            </Link>
                        </motion.form>
                    )}

                    <p className="mt-8 text-center text-slate-600">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="font-semibold text-blue-700 hover:text-blue-800 hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
