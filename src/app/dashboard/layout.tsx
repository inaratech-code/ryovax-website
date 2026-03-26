import { redirect } from "next/navigation";
import BuyerDashboardLayout from "@/components/layout/BuyerDashboardLayout";
import { getPortalSessionFromCookies } from "@/lib/portal-session-server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getPortalSessionFromCookies();
    if (!session) {
        redirect("/auth/login");
    }

    return (
        <BuyerDashboardLayout
            userEmail={session.email}
            companyName={session.companyName}
            role={session.role}
        >
            {children}
        </BuyerDashboardLayout>
    );
}
