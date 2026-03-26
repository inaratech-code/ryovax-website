import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
    const jar = await cookies();
    jar.set(ADMIN_SESSION_COOKIE, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });

    const url = new URL(request.url);
    return NextResponse.redirect(new URL("/admin/login", url), 303);
}

