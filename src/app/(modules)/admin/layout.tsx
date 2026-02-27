import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AppShell from "@/components/shell/AppShell";

const AUTH_COOKIE = "trax_token";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;

    if (!token) {
        redirect("/login");
    }

    return (
        <div data-theme="dashboard" data-mode="dark">
            <AppShell title="Campanhas">{children}</AppShell>
        </div>
    );
}
