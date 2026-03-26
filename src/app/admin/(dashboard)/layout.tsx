import AdminAppLayout from "@/components/layout/AdminAppLayout";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    const hasPasswordAuth = !!process.env.ADMIN_PASSWORD?.trim();
    const allowPanel =
        process.env.NODE_ENV === "development" ||
        process.env.ADMIN_PANEL_ENABLED === "true" ||
        hasPasswordAuth;
    if (!allowPanel) {
        redirect("/");
    }

    if (hasPasswordAuth) {
        const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
        const ok = token ? await verifyAdminSessionToken(token) : false;
        if (!ok) {
            redirect("/admin/login");
        }
    }

    return <AdminAppLayout>{children}</AdminAppLayout>;
}
