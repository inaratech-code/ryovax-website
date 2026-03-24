import { countBuyingRequests, countCompletedDeals } from "@/lib/buying-requests-store";
import { countPendingUserRegistrations, countUserRegistrations } from "@/lib/user-registrations-store";

export type AdminDashboardStats = {
    totalUsers: number;
    totalBuyingRequests: number;
    pendingApprovals: number;
    completedDeals: number;
};

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
    const [totalUsers, totalBuyingRequests, pendingApprovals, completedDeals] = await Promise.all([
        countUserRegistrations(),
        countBuyingRequests(),
        countPendingUserRegistrations(),
        countCompletedDeals(),
    ]);
    return {
        totalUsers,
        totalBuyingRequests,
        pendingApprovals,
        completedDeals,
    };
}
