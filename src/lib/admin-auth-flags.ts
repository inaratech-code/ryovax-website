/**
 * Env-only flags for admin auth (no Node crypto). Safe to import from Edge/server components.
 */
export function isAdminPasswordAuthEnabled(): boolean {
    return !!process.env.ADMIN_PASSWORD?.trim();
}
