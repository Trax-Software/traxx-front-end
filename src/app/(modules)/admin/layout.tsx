import { AuthGuard } from "@/components/auth/AuthGuard";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <AuthGuard>
            <div className="flex min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] font-sans antialiased selection:bg-[var(--primary-light)]">
                {/* Lateral Esquerda */}
                <Sidebar />
                
                {/* Core Area (Conteúdo e Header) */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                    
                    {/* Barra Superior */}
                    <Header />

                    {/* Conteúdo Principal (Scroll independente do header e sidebar) */}
                    <main className="flex-1 overflow-y-auto px-8 py-8 w-full relative">
                        {children}
                    </main>
                    
                </div>
            </div>
        </AuthGuard>
    );
}
