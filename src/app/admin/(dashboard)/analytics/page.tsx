import { redirect } from "next/navigation";

/** Legacy URL after removing the demo analytics page; keep route so builds and bookmarks stay valid. */
export default function AdminAnalyticsRedirectPage() {
    redirect("/admin");
}
