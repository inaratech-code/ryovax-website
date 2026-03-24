"use server";

import { setUserRegistrationStatus } from "@/lib/user-registrations-store";

export async function approveUserRegistration(id: string) {
    return setUserRegistrationStatus(id, "approved");
}

export async function rejectUserRegistration(id: string) {
    return setUserRegistrationStatus(id, "rejected");
}
