import Link from "next/link";
import { CheckCircle2, Factory, FileText, IndianRupee } from "lucide-react";

export default function SupplierDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Supplier Dashboard</h1>
        <div className="text-sm font-medium text-amber-700 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200 w-fit shrink-0">
          Verification Pending
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: FileText, label: "Open jobs to quote", value: "32", color: "blue", trend: "+5%" },
          { icon: IndianRupee, label: "Quotes Submitted", value: "14", color: "saffron", trend: "+10%" },
          { icon: CheckCircle2, label: "Orders Won", value: "4", color: "emerald", trend: "+2" },
          { icon: Factory, label: "Profile Score", value: "85%", color: "indigo", trend: "+5%" }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl flex items-center justify-center`}>
                  <Icon size={24} />
                </div>
                <span className="flex items-center gap-1 text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                  {stat.trend}
                </span>
              </div>
              <div>
                <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.label}</h3>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-900">New jobs that fit what you sell</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium tracking-wide">
              <tr>
                <th className="px-6 py-4">What they need</th>
                <th className="px-6 py-4">Buyer Region</th>
                <th className="px-6 py-4">Requirement</th>
                <th className="px-6 py-4">Deadline</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { title: "Industrial Aluminum Coils", region: "Europe", req: "2,000 MT", date: "Nov 15, 2026" },
                { title: "Molded Plastic Components", region: "North America", req: "50,000 units", date: "Nov 20, 2026" },
                { title: "Copper Wiring C11000", region: "Middle East", req: "500 km", date: "Nov 10, 2026" }
              ].map((rfq, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">{rfq.title}</td>
                  <td className="px-6 py-4 text-slate-600">{rfq.region}</td>
                  <td className="px-6 py-4 text-slate-600">{rfq.req}</td>
                  <td className="px-6 py-4 text-slate-500">{rfq.date}</td>
                  <td className="px-6 py-4">
                    <Link
                      href="/contact"
                      className="inline-block px-4 py-2 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition-colors text-center"
                    >
                      Submit Quote
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
