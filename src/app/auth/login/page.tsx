import BuyerLoginForm from "./login-form";

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ next?: string }>;
}) {
    const sp = await searchParams;
    const nextPath = typeof sp.next === "string" && sp.next.startsWith("/dashboard") ? sp.next : "/dashboard";

    return <BuyerLoginForm nextPath={nextPath} />;
}
