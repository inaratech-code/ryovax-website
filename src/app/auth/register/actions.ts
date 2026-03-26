"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createPendingRegistration } from "@/lib/user-registrations-store";

export type PortalRegisterState = { error: string } | null;

export async function portalRegister(_prev: PortalRegisterState, formData: FormData): Promise<PortalRegisterState> {
    const role = formData.get("role") === "supplier" ? "supplier" : "buyer";
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const companyName = String(formData.get("companyName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirm = String(formData.get("confirmPassword") ?? "");

    if (!firstName || !lastName || !companyName || !email || !password) {
        return { error: "Please fill in all fields." };
    }
    if (password.length < 8) {
        return { error: "Password must be at least 8 characters." };
    }
    if (password !== confirm) {
        return { error: "Passwords do not match." };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const r = await createPendingRegistration({
        email,
        companyName,
        firstName,
        lastName,
        role,
        passwordHash,
    });

    if (!r.ok) {
        return { error: r.error };
    }

    redirect("/auth/pending-approval");
}
