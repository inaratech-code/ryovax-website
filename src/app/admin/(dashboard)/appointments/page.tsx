import { CalendarClock } from "lucide-react";
import AdminAppointmentsPanel from "@/components/admin/AdminAppointmentsPanel";
import { getAdminDisplayTimezone } from "@/lib/appointment-time";

export default async function AdminAppointmentsPage() {
    let loadError = "";
    let appointments: any[] = [];
    const adminTimezone = getAdminDisplayTimezone();

    try {
        const { listAppointments } = await import("@/lib/appointments-store");
        appointments = await listAppointments();
    } catch {
        loadError =
            "Appointments data could not be loaded. Check Firebase admin runtime secrets and redeploy.";
    }

    return (
        <div className="space-y-8">
            {loadError ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900 text-sm">
                    {loadError}
                </div>
            ) : null}

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2 sm:gap-3">
                <CalendarClock className="text-blue-700 shrink-0 w-7 h-7 sm:w-8 sm:h-8" />
                <span>Appointments</span>
            </h1>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 space-y-2">
                    <p className="text-slate-600 text-sm">
                        All booking requests from the site. User times are shown in their timezone; the{" "}
                        <span className="font-medium text-slate-800">Admin</span> column uses{" "}
                        <code className="text-xs bg-slate-100 px-1 rounded">{adminTimezone}</code> (set{" "}
                        <code className="text-xs bg-slate-100 px-1 rounded">ADMIN_PANEL_TIMEZONE</code> in env). Adjust
                        the admin slot to coordinate calls.
                    </p>
                </div>
                <div className="p-6">
                    <AdminAppointmentsPanel initial={appointments} adminTimezone={adminTimezone} />
                </div>
            </div>
        </div>
    );
}
