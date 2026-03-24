import { listBuyingRequests } from "@/lib/buying-requests-store";
import { listUserRegistrations } from "@/lib/user-registrations-store";

export type BuyerDashboardCounts = {
    openBuyingRequests: number;
    awaitingQuotes: number;
    verifiedSuppliers: number;
    completedOrders: number;
};

export async function getBuyerDashboardCounts(): Promise<BuyerDashboardCounts> {
    const requests = await listBuyingRequests(2000);
    const openBuyingRequests = requests.filter((r) =>
        ["Active", "Pending"].includes(String(r.status)),
    ).length;
    const awaitingQuotes = requests.filter((r) => String(r.status).toLowerCase().includes("quote")).length;
    const completedOrders = requests.filter((r) => ["Completed", "Closed"].includes(String(r.status))).length;
    const users = await listUserRegistrations();
    const verifiedSuppliers = users.filter((u) => u.role === "supplier" && u.status === "approved").length;
    return {
        openBuyingRequests,
        awaitingQuotes,
        verifiedSuppliers,
        completedOrders,
    };
}
