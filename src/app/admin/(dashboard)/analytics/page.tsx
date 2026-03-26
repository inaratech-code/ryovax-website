export const metadata = {
    title: "Web analytics - Admin - Ryovax",
    description: "Site traffic, sessions, and top pages.",
};

export default async function AdminAnalyticsPage() {
    try {
        const { default: Section } = await import("@/components/admin/WebAnalyticsSection");
        return <Section />;
    } catch {
        return (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900 text-sm">
                Analytics could not be loaded.
            </div>
        );
    }
}
