import { isAdminPasswordAuthEnabled } from "@/lib/admin-auth-flags";
import AdminLoginSetupHint from "./admin-login-setup-hint";
import AdminLoginForm from "./login-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
    title: "Admin sign in",
    robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
    if (!isAdminPasswordAuthEnabled()) {
        return <AdminLoginSetupHint />;
    }

    const requireUserId = !!process.env.ADMIN_USERNAME?.trim();

    return <AdminLoginForm requireUserId={requireUserId} />;
}
