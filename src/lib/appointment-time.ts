export function getAdminDisplayTimezone(): string {
    const t = process.env.ADMIN_PANEL_TIMEZONE?.trim();
    return t && t.length > 0 ? t : "UTC";
}
