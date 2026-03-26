"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PORTAL_SESSION_COOKIE, createPortalSessionToken } from "@/lib/portal-session";
import { getRegistrationByEmailForAuth } from "@/lib/user-registrations-store";

export type PortalLoginState = { error: string } | null;

function safeNext(next: string | undefined): string {
    if (!next?.startsWith("/")) return "/dashboard";
    if (!next.startsWith("/dashboard")) return "/dashboard";
    return next;
}

export async function portalLogin(_prev: PortalLoginState, formData: FormData): Promise<PortalLoginState> {
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const next = safeNext(String(formData.get("next") ?? "") || undefined);

    if (!email || !password) {
        return { error: "Enter your email and password." };
    }

    const user = await getRegistrationByEmailForAuth(email);
    if (!user) {
        return { error: "Invalid email or password." };
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
        return { error: "Invalid email or password." };
    }

    if (user.status === "pending") {
        return {
            error: "Your account is pending admin approval. You can sign in after your profile is approved.",
        };
    }
    if (user.status === "rejected") {
        return {
            error: "Your registration was not approved. Contact Ryovax if you need help.",
        };
    }

    let token: string;
    try {
        token = await createPortalSessionToken({
            email: user.email,
            companyName: user.companyName,
            role: user.role,
            regId: user.id,
        });
    } catch {
        return { error: "Sign-in is not configured (set PORTAL_SESSION_SECRET on the server)." };
    }

    const jar = await cookies();
    jar.set(PORTAL_SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 14,
    });

    if (user.role === "supplier") {
        if (next.startsWith("/dashboard/supplier")) {
            redirect(next);
        }
        redirect("/dashboard/supplier");
    }

    if (next === "/dashboard/supplier") {
        redirect("/dashboard");
    }
    redirect(next);
}

export async function portalLogout() {
    const jar = await cookies();
    jar.set(PORTAL_SESSION_COOKIE, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });
    redirect("/auth/login");
}
