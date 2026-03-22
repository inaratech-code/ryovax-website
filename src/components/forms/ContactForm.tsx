"use client";

import { useState } from "react";

export default function ContactForm() {
    const [sent, setSent] = useState(false);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSent(true);
    }

    if (sent) {
        return (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                <p className="text-lg font-semibold text-emerald-900 mb-2">Message sent</p>
                <p className="text-emerald-800 text-sm">
                    Thanks—we&apos;ll read your note and get back to you at the email you provided.
                </p>
                <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-6 text-sm font-medium text-blue-700 hover:text-blue-800 underline"
                >
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="cf-first" className="block text-sm font-medium text-slate-700 mb-2">
                        First Name
                    </label>
                    <input
                        id="cf-first"
                        name="firstName"
                        required
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                        placeholder="John"
                    />
                </div>
                <div>
                    <label htmlFor="cf-last" className="block text-sm font-medium text-slate-700 mb-2">
                        Last Name
                    </label>
                    <input
                        id="cf-last"
                        name="lastName"
                        required
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                        placeholder="Doe"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="cf-email" className="block text-sm font-medium text-slate-700 mb-2">
                    Company Email
                </label>
                <input
                    id="cf-email"
                    name="email"
                    required
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                    placeholder="john@company.com"
                />
            </div>
            <div>
                <label htmlFor="cf-topic" className="block text-sm font-medium text-slate-700 mb-2">
                    What is this about?
                </label>
                <select
                    id="cf-topic"
                    name="topic"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none bg-white"
                >
                    <option>I want to buy / source products</option>
                    <option>I want to sell / supply products</option>
                    <option>Help from your experts</option>
                    <option>Something else</option>
                </select>
            </div>
            <div>
                <label htmlFor="cf-msg" className="block text-sm font-medium text-slate-700 mb-2">
                    Message
                </label>
                <textarea
                    id="cf-msg"
                    name="message"
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none resize-none"
                    placeholder="How can we help you?"
                />
            </div>
            <button
                type="submit"
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-md"
            >
                Send message
            </button>
        </form>
    );
}
