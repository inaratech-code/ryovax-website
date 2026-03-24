import { isAdminPasswordAuthEnabled } from "@/lib/admin-credentials";
import AdminLoginSetupHint from "./admin-login-setup-hint";
import AdminLoginForm from "./login-form";

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
