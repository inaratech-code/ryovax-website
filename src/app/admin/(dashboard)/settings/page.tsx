import { Settings } from "lucide-react";
import Link from "next/link";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2 sm:gap-3">
        <Settings className="text-blue-700 shrink-0 w-7 h-7 sm:w-8 sm:h-8" />
        <span>Settings</span>
      </h1>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-slate-600">
        <p className="mb-4">Admin configuration will live here. For account or product questions, contact the team.</p>
        <Link href="/contact" className="font-semibold text-blue-700 hover:text-blue-800 hover:underline">
          Contact Ryovax
        </Link>
      </div>
    </div>
  );
}
