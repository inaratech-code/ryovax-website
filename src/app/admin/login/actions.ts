"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminCredentials } from "@/lib/admin-credentials";
import { ADMIN_SESSION_COOKIE, createAdminSessionToken } from "@/lib/admin-session";

export type AdminLoginState = { error: string } | null;

export async function adminLogin(_prevState: AdminLoginState, formData: FormData): Promise<AdminLoginState> {
    const password = formData.get("password")?.toString() ?? "";
    const username = formData.get("username")?.toString() ?? "";
    if (!verifyAdminCredentials(username, password)) {
        return { error: "Invalid credentials." };
    }
    let token: string;
    try {
        token = await createAdminSessionToken();
    } catch {
        return {
            error: "Could not create session. Set ADMIN_SESSION_SECRET (at least 16 characters).",
        };
    }
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });
    redirect("/admin");
}

export async function adminLogout() {
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });
    redirect("/admin/login");
}
