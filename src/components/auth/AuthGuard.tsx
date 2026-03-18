/**
 * AuthGuard — Client-side fallback
 * 
 * O middleware.ts já protege as rotas server-side.
 * Este componente apenas exibe um spinner durante a hidratação
 * inicial do AuthProvider (quando loading=true), evitando
 * flashes de conteúdo não autenticado.
 */
"use client";

import { useAuth } from "@/context/AuthContext";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
                background: "var(--bg-base)",
            }}>
                <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    border: "3px solid var(--border)",
                    borderTopColor: "var(--primary)",
                    animation: "spin 0.7s linear infinite",
                }} />
            </div>
        );
    }

    return <>{children}</>;
}
