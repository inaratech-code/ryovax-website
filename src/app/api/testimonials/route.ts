import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { readTestimonials } = await import("@/lib/testimonials-store");
        const data = await readTestimonials();
        const approved = [...data.approved].sort(
            (a, b) => new Date(b.approvedAt).getTime() - new Date(a.approvedAt).getTime(),
        );
        return NextResponse.json({ testimonials: approved });
    } catch {
        // Public site should remain usable even when backend runtime/secrets are unavailable.
        return NextResponse.json({ testimonials: [] });
    }
}

export async function POST(req: Request) {
    let body: Record<string, unknown>;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const reviewType = body.reviewType === "negative" ? "negative" : "positive";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const company = typeof body.company === "string" ? body.company.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !email || !company || !message) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const submission: {
        id: string;
        reviewType: "positive" | "negative";
        name: string;
        email: string;
        company: string;
        message: string;
        submittedAt: string;
        rating?: string;
        issueType?: string;
    } = {
        id: `pov-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        reviewType,
        name,
        email,
        company,
        message,
        submittedAt: new Date().toISOString(),
    };

    if (reviewType === "positive") {
        const rating = typeof body.rating === "string" ? body.rating : "5";
        submission.rating = rating;
    } else {
        const issueType = typeof body.issueType === "string" ? body.issueType : "other";
        submission.issueType = issueType;
    }

    try {
        const { isFirebaseConfigured } = await import("@/lib/firebase-admin");
        if (!isFirebaseConfigured()) {
            return NextResponse.json(
                { error: "Server is not configured for submissions (Firebase)." },
                { status: 503 },
            );
        }
        const { addPendingSubmission } = await import("@/lib/testimonials-store");
        await addPendingSubmission(submission);
    } catch {
        return NextResponse.json({ error: "Could not submit testimonial right now." }, { status: 503 });
    }

    return NextResponse.json({ ok: true, id: submission.id });
}
