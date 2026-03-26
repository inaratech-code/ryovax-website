import AdminAppLayout from "@/components/layout/AdminAppLayout";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-session";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    const allowPanel = process.env.NODE_ENV === "development" || process.env.ADMIN_PANEL_ENABLED === "true";
    if (!allowPanel) {
        redirect("/");
    }

    const passwordAuth = !!process.env.ADMIN_PASSWORD?.trim();
    if (passwordAuth) {
        const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
        const ok = token ? await verifyAdminSessionToken(token) : false;
        if (!ok) {
            redirect("/admin/login");
        }
    }

    return <AdminAppLayout>{children}</AdminAppLayout>;
}
