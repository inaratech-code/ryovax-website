import { NextResponse } from "next/server";
import {
    newId,
    readTestimonials,
    writeTestimonials,
    type PendingSubmission,
} from "@/lib/testimonials-store";

export async function GET() {
    const data = await readTestimonials();
    const approved = [...data.approved].sort(
        (a, b) => new Date(b.approvedAt).getTime() - new Date(a.approvedAt).getTime(),
    );
    return NextResponse.json({ testimonials: approved });
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

    const submission: PendingSubmission = {
        id: newId(),
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

    const data = await readTestimonials();
    data.pending.push(submission);
    await writeTestimonials(data);

    return NextResponse.json({ ok: true, id: submission.id });
}
