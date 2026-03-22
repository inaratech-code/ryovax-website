import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, Package, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function DashboardOverview() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
                <div className="text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200 w-fit shrink-0">
                    Last 30 Days
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center">
                            <Package size={24} />
                        </div>
                        <span className="flex items-center gap-1 text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                            <ArrowUpRight size={14} /> +12%
                        </span>
                    </div>
                    <div>
                        <h3 className="text-slate-500 text-sm font-medium mb-1">Open buying requests</h3>
                        <p className="text-3xl font-bold text-slate-900">24</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-saffron-50 text-saffron-600 rounded-xl flex items-center justify-center">
                            <Clock size={24} />
                        </div>
                        <span className="flex items-center gap-1 text-sm font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-md">
                            <ArrowDownRight size={14} /> -3%
                        </span>
                    </div>
                    <div>
                        <h3 className="text-slate-500 text-sm font-medium mb-1">Awaiting Quotes</h3>
                        <p className="text-3xl font-bold text-slate-900">12</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center">
                            <ShieldCheck size={24} />
                        </div>
                        <span className="flex items-center gap-1 text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                            <ArrowUpRight size={14} /> +8%
                        </span>
                    </div>
                    <div>
                        <h3 className="text-slate-500 text-sm font-medium mb-1">Verified Suppliers</h3>
                        <p className="text-3xl font-bold text-slate-900">156</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                            <CheckCircle2 size={24} />
                        </div>
                        <span className="flex items-center gap-1 text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                            <ArrowUpRight size={14} /> +24%
                        </span>
                    </div>
                    <div>
                        <h3 className="text-slate-500 text-sm font-medium mb-1">Completed Orders</h3>
                        <p className="text-3xl font-bold text-slate-900">89</p>
                    </div>
                </div>
            </div>

            {/* Tables & Charts Placeholder */}
            <div className="grid lg:grid-cols-3 gap-8">
                <div id="recent-requests" className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm scroll-mt-24">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-lg text-slate-900">Recent requests</h3>
                        <Link href="/dashboard#recent-requests" className="text-sm font-medium text-blue-700 hover:text-blue-800">
                            View All
                        </Link>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Request #</th>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Quantity</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[
                                    { id: "REQ-2041", name: "Aluminum Extrusions", qty: "5,000 kg", status: "Active", date: "Oct 24, 2026" },
                                    { id: "REQ-2039", name: "Copper Piping", qty: "10,000 m", status: "Quotes (3)", date: "Oct 21, 2026" },
                                    { id: "REQ-2035", name: "Solar Inverters", qty: "500 units", status: "Pending", date: "Oct 18, 2026" },
                                    { id: "REQ-2028", name: "Lithium Batteries", qty: "1,200 units", status: "Completed", date: "Oct 10, 2026" },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{row.id}</td>
                                        <td className="px-6 py-4 text-slate-600">{row.name}</td>
                                        <td className="px-6 py-4 text-slate-600">{row.qty}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${row.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : row.status === 'Active' ? 'bg-blue-100 text-blue-700' : row.status === 'Pending' ? 'bg-saffron-100 text-saffron-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">{row.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
                    <h3 className="font-bold text-lg text-slate-900 mb-6">Spend Analysis</h3>
                    <div className="flex-1 flex flex-col justify-center items-center relative">
                        {/* Chart Placeholder SVG */}
                        <div className="w-48 h-48 rounded-full border-[16px] border-blue-100 relative mb-6 relative">
                            <div className="absolute inset-[-16px] rounded-full border-[16px] border-blue-600 border-r-transparent border-t-transparent -rotate-45 block"></div>
                            <div className="absolute inset-[-16px] rounded-full border-[16px] border-saffron-500 border-l-transparent border-b-transparent border-r-transparent rotate-45 block"></div>
                            <div className="flex h-full flex-col items-center justify-center font-bold text-2xl text-slate-900">
                                $1.2M
                                <span className="text-xs text-slate-500 font-medium">Total Spend</span>
                            </div>
                        </div>

                        <div className="w-full space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-600"></div> <span className="text-slate-600 font-medium">Metals</span></div>
                                <span className="font-semibold text-slate-900">65%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-saffron-500"></div> <span className="text-slate-600 font-medium">Electronics</span></div>
                                <span className="font-semibold text-slate-900">25%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-100"></div> <span className="text-slate-600 font-medium">Plastics</span></div>
                                <span className="font-semibold text-slate-900">10%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
