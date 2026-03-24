"use client";

import { fromZonedTime } from "date-fns-tz";

/** Build UTC ISO from wall-clock date + time in the given IANA timezone. */
export function localWallTimeToUtcIso(dateStr: string, timeStr: string, timeZone: string): string {
    const t = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
    const wall = `${dateStr}T${t}`;
    return fromZonedTime(wall, timeZone).toISOString();
}
