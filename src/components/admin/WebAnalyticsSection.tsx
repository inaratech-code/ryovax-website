"use client";

import { useEffect, useState } from "react";
import { Activity, Eye, MousePointerClick, Timer } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const trafficByDay = [
    { day: "Mon", sessions: 420, pageviews: 1840 },
    { day: "Tue", sessions: 512, pageviews: 2210 },
    { day: "Wed", sessions: 488, pageviews: 2050 },
    { day: "Thu", sessions: 601, pageviews: 2680 },
    { day: "Fri", sessions: 540, pageviews: 2390 },
    { day: "Sat", sessions: 310, pageviews: 1320 },
    { day: "Sun", sessions: 295, pageviews: 1180 },
];

const tooltipStyle = {
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "0.75rem",
    fontSize: "12px",
};

function ChartPlaceholder({ className }: { className?: string }) {
    return (
        <div
            className={`rounded-xl bg-slate-100 animate-pulse ${className ?? "h-[280px]"}`}
            aria-hidden
        />
    );
}

export default function WebAnalyticsSection() {
    const [chartsReady, setChartsReady] = useState(false);
    useEffect(() => setChartsReady(true), []);

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Web analytics</h1>
                    <p className="text-slate-600 mt-1 text-sm sm:text-base">
                        Traffic and engagement (sample data—wire to your analytics API when ready).
                    </p>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg w-fit">
                    Last 7 days
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                {[
                    { label: "Sessions", value: "3,166", delta: "+8.2%", icon: Activity, tone: "text-blue-700 bg-blue-50" },
                    { label: "Page views", value: "13.7k", delta: "+5.4%", icon: Eye, tone: "text-saffron-700 bg-saffron-50" },
                    { label: "Avg. session", value: "3m 12s", delta: "−0.4%", icon: Timer, tone: "text-emerald-700 bg-emerald-50" },
                    { label: "Engaged clicks", value: "1,204", delta: "+12%", icon: MousePointerClick, tone: "text-violet-700 bg-violet-50" },
                ].map((k) => (
                    <div key={k.label} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${k.tone}`}>
                                <k.icon size={22} />
                            </div>
                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{k.delta}</span>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">{k.label}</p>
                        <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">{k.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-1">Sessions &amp; page views</h2>
                <p className="text-sm text-slate-500 mb-6">Daily trend</p>
                <div className="h-[280px] w-full min-w-0 min-h-[280px]">
                    {chartsReady ? (
                        <ResponsiveContainer width="100%" height={280} minWidth={0}>
                            <LineChart data={trafficByDay} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Line type="monotone" dataKey="sessions" name="Sessions" stroke="#1b365d" strokeWidth={2} dot={{ r: 3 }} />
                                <Line
                                    type="monotone"
                                    dataKey="pageviews"
                                    name="Page views"
                                    stroke="#c49a00"
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <ChartPlaceholder />
                    )}
                </div>
                <div className="flex flex-wrap gap-4 mt-4 text-sm">
                    <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#1b365d]" /> Sessions
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#c49a00]" /> Page views
                    </span>
                </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 text-sm text-slate-600">
                <strong className="text-slate-800">Note:</strong> Connect Google Analytics, Plausible, or your own events API to replace
                sample numbers.
            </div>
        </div>
    );
}
