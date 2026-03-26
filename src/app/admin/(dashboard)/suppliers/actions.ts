"use server";

import { setUserRegistrationStatus } from "@/lib/user-registrations-store";

export async function setSupplierActive(id: string, active: boolean) {
    return setUserRegistrationStatus(id, active ? "approved" : "rejected");
}
