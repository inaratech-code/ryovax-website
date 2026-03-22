import { FileText } from "lucide-react";

export default function AdminRfqsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2 sm:gap-3">
        <FileText className="text-blue-700 shrink-0 w-7 h-7 sm:w-8 sm:h-8" />
        <span>All buying requests</span>
      </h1>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center text-slate-500">
        A searchable list of every request will show here once your API is connected.
      </div>
    </div>
  );
}
