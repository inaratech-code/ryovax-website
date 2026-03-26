"use server";

import { setUserRegistrationStatus } from "@/lib/user-registrations-store";

export async function setBuyerActive(id: string, active: boolean) {
    return setUserRegistrationStatus(id, active ? "approved" : "rejected");
}
