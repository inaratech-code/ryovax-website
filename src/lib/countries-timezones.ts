/** Common countries with a representative IANA timezone (user can override timezone in UI). */
export type CountryOption = {
    code: string;
    name: string;
    timezone: string;
};

export const COUNTRY_OPTIONS: CountryOption[] = [
    { code: "US", name: "United States", timezone: "America/New_York" },
    { code: "CA", name: "Canada", timezone: "America/Toronto" },
    { code: "MX", name: "Mexico", timezone: "America/Mexico_City" },
    { code: "GB", name: "United Kingdom", timezone: "Europe/London" },
    { code: "DE", name: "Germany", timezone: "Europe/Berlin" },
    { code: "FR", name: "France", timezone: "Europe/Paris" },
    { code: "IN", name: "India", timezone: "Asia/Kolkata" },
    { code: "CN", name: "China", timezone: "Asia/Shanghai" },
    { code: "JP", name: "Japan", timezone: "Asia/Tokyo" },
    { code: "AU", name: "Australia", timezone: "Australia/Sydney" },
    { code: "AE", name: "United Arab Emirates", timezone: "Asia/Dubai" },
    { code: "SG", name: "Singapore", timezone: "Asia/Singapore" },
    { code: "BR", name: "Brazil", timezone: "America/Sao_Paulo" },
    { code: "ZA", name: "South Africa", timezone: "Africa/Johannesburg" },
    { code: "NG", name: "Nigeria", timezone: "Africa/Lagos" },
    { code: "KE", name: "Kenya", timezone: "Africa/Nairobi" },
    { code: "OTHER", name: "Other / not listed", timezone: "UTC" },
];

/** Frequently used IANA zones for manual override */
export const COMMON_TIMEZONES: { value: string; label: string }[] = [
    { value: "UTC", label: "UTC" },
    { value: "America/New_York", label: "Eastern (US)" },
    { value: "America/Chicago", label: "Central (US)" },
    { value: "America/Denver", label: "Mountain (US)" },
    { value: "America/Los_Angeles", label: "Pacific (US)" },
    { value: "Europe/London", label: "London" },
    { value: "Europe/Paris", label: "Paris" },
    { value: "Asia/Dubai", label: "Dubai" },
    { value: "Asia/Kolkata", label: "India" },
    { value: "Asia/Singapore", label: "Singapore" },
    { value: "Asia/Tokyo", label: "Tokyo" },
    { value: "Australia/Sydney", label: "Sydney" },
];
