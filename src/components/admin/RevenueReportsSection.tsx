"use client";

import { useEffect, useState } from "react";
import { IndianRupee, TrendingUp } from "lucide-react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const revenueByMonth = [
    { month: "Jul", revenue: 2.1 },
    { month: "Aug", revenue: 2.4 },
    { month: "Sep", revenue: 2.2 },
    { month: "Oct", revenue: 2.9 },
    { month: "Nov", revenue: 3.2 },
    { month: "Dec", revenue: 3.6 },
];

const revenueByCategory = [
    { name: "Metals", value: 42, fill: "#1b365d" },
    { name: "Electronics", value: 28, fill: "#c49a00" },
    { name: "Plastics", value: 15, fill: "#0f766e" },
    { name: "Other", value: 15, fill: "#64748b" },
];

const tooltipStyle = {
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "0.75rem",
    fontSize: "12px",
};

function ChartPlaceholder({ className }: { className?: string }) {
    return <div className={`rounded-xl bg-slate-100 animate-pulse ${className ?? "h-[280px]"}`} aria-hidden />;
}

export default function RevenueReportsSection() {
    const [chartsReady, setChartsReady] = useState(false);
    useEffect(() => setChartsReady(true), []);

    const totalPct = revenueByCategory.reduce((a, c) => a + c.value, 0);

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Reports &amp; revenue</h1>
                    <p className="text-slate-600 mt-1 text-sm sm:text-base">
                        Platform fee and deal-based revenue overview (sample data in millions USD).
                    </p>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg w-fit">
                    Year to date
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="md:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                            <IndianRupee className="w-4 h-4 text-saffron-600" />
                            Total recognized revenue
                        </p>
                        <p className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">$16.4M</p>
                        <p className="text-emerald-600 text-sm font-semibold mt-2 flex items-center gap-1">
                            <TrendingUp size={16} /> +18.4% vs last year
                        </p>
                    </div>
                    <div className="flex gap-8 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-8">
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Avg. deal</p>
                            <p className="text-xl font-bold text-slate-900">$42.8k</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Deals closed</p>
                            <p className="text-xl font-bold text-slate-900">382</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white p-5 sm:p-6 rounded-2xl shadow-lg">
                    <p className="text-blue-100 text-sm font-medium">Pipeline (weighted)</p>
                    <p className="text-3xl font-bold mt-2">$4.2M</p>
                    <p className="text-blue-200 text-sm mt-2">Next 90 days (forecast)</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-1">Revenue trend</h2>
                    <p className="text-sm text-slate-500 mb-6">Millions USD, last 6 months</p>
                    <div className="h-[280px] w-full min-w-0 min-h-[280px]">
                        {chartsReady ? (
                            <ResponsiveContainer width="100%" height={280} minWidth={0}>
                                <AreaChart data={revenueByMonth} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#1b365d" stopOpacity={0.35} />
                                            <stop offset="100%" stopColor="#1b365d" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                                    <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={(v) => `$${v}M`} />
                                    <Tooltip
                                        contentStyle={tooltipStyle}
                                        formatter={(value) => {
                                            const v = typeof value === "number" ? value : Number(value);
                                            return [`$${Number.isFinite(v) ? v : 0}M`, "Revenue"];
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#1b365d"
                                        strokeWidth={2}
                                        fill="url(#revFill)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <ChartPlaceholder />
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-1">Revenue by category</h2>
                    <p className="text-sm text-slate-500 mb-2">Share of total (circular view)</p>
                    <div className="h-[300px] w-full min-w-0 flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-full sm:w-1/2 h-[220px] min-h-[220px] min-w-0">
                            {chartsReady ? (
                                <ResponsiveContainer width="100%" height={220} minWidth={0}>
                                    <PieChart>
                                        <Pie
                                            data={revenueByCategory}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={58}
                                            outerRadius={88}
                                            paddingAngle={2}
                                        >
                                            {revenueByCategory.map((entry) => (
                                                <Cell key={entry.name} fill={entry.fill} stroke="#fff" strokeWidth={2} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={tooltipStyle}
                                            formatter={(value) => {
                                                const v = typeof value === "number" ? value : Number(value);
                                                return [`${Number.isFinite(v) ? v : 0}%`, "Share"];
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <ChartPlaceholder className="h-[220px] w-full" />
                            )}
                        </div>
                        <ul className="w-full sm:w-1/2 space-y-3 text-sm">
                            {revenueByCategory.map((c) => (
                                <li key={c.name} className="flex items-center justify-between gap-2">
                                    <span className="flex items-center gap-2 min-w-0">
                                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: c.fill }} />
                                        <span className="text-slate-700 truncate">{c.name}</span>
                                    </span>
                                    <span className="font-semibold text-slate-900">{c.value}%</span>
                                </li>
                            ))}
                            <li className="pt-2 border-t border-slate-100 flex justify-between text-slate-500 text-xs">
                                <span>Total</span>
                                <span>{totalPct}%</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 text-sm text-slate-600">
                <strong className="text-slate-800">Note:</strong> Replace with live finance data from your billing or ERP integration.
            </div>
        </div>
    );
}
