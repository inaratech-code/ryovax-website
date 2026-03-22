"use client";

import { useState } from "react";

export default function NewsletterForm() {
    const [done, setDone] = useState(false);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setDone(true);
    }

    if (done) {
        return (
            <p className="text-sm text-saffron-400">
                Thanks! You&apos;re on the list—we&apos;ll only send useful stuff.
            </p>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row border border-slate-700 rounded-lg overflow-hidden bg-slate-800 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
            <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className="flex-1 bg-transparent px-4 py-3 text-sm text-white focus:outline-none min-w-0"
            />
            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 sm:py-0 font-semibold transition-colors whitespace-nowrap shrink-0"
            >
                Subscribe
            </button>
        </form>
    );
}
