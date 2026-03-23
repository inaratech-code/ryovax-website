import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type PendingSubmission = {
    id: string;
    reviewType: "positive" | "negative";
    name: string;
    email: string;
    company: string;
    message: string;
    rating?: string;
    issueType?: string;
    submittedAt: string;
};

export type ApprovedTestimonial = {
    id: string;
    text: string;
    author: string;
    role: string;
    company: string;
    approvedAt: string;
};

export type TestimonialsData = {
    pending: PendingSubmission[];
    approved: ApprovedTestimonial[];
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "testimonials.json");

const defaultData: TestimonialsData = {
    pending: [],
    approved: [
        {
            id: "seed-1",
            text: "Ryovax changed how we buy in Asia. We cut wait times by about 30% and kept quality where we needed it—our margins look better too.",
            author: "Sarah Jenkins",
            role: "Supply Chain Director",
            company: "Nordic Manufacturing Solutions",
            approvedAt: new Date(0).toISOString(),
        },
        {
            id: "seed-2",
            text: "Finally we can see where our shipments are, and we trust who they connect us with. That alone saved us a ton of stress.",
            author: "David Chen",
            role: "Head of Buying",
            company: "Global Builders Inc.",
            approvedAt: new Date(0).toISOString(),
        },
        {
            id: "seed-3",
            text: "We couldn’t find solid suppliers in India until Ryovax. They know the ground there and still held everything to the standard we expect.",
            author: "Elena Rodriguez",
            role: "Operations Manager",
            company: "HealthCore Pharma",
            approvedAt: new Date(0).toISOString(),
        },
    ],
};

async function ensureFile(): Promise<TestimonialsData> {
    try {
        const raw = await readFile(DATA_FILE, "utf-8");
        const parsed = JSON.parse(raw) as TestimonialsData;
        if (!Array.isArray(parsed.pending) || !Array.isArray(parsed.approved)) {
            return { ...defaultData };
        }
        return parsed;
    } catch {
        return { ...defaultData, pending: [], approved: [...defaultData.approved] };
    }
}

export async function readTestimonials(): Promise<TestimonialsData> {
    return ensureFile();
}

export async function writeTestimonials(data: TestimonialsData): Promise<void> {
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export function newId(): string {
    return `pov-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function pendingToApproved(p: PendingSubmission): ApprovedTestimonial {
    const role =
        p.reviewType === "negative"
            ? p.issueType
                ? `${p.issueType.replace(/^\w/, (c) => c.toUpperCase())} feedback`
                : "Feedback"
            : "Customer";
    return {
        id: p.id,
        text: p.message,
        author: p.name,
        role,
        company: p.company,
        approvedAt: new Date().toISOString(),
    };
}
