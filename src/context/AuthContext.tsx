"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { signIn, SignInPayload } from "@/app/services/auth";

type AuthContextValue = {
    token: string | null;
    loading: boolean;
    signInWithEmail: (payload: SignInPayload) => Promise<void>;
    signOut: () => void;
};

const AUTH_COOKIE = "trax_token";

const AuthContext = createContext<AuthContextValue | null>(null);

function setCookie(name: string, value: string, days = 7) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; samesite=lax`;
}

function deleteCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; samesite=lax`;
}

function getRawCookie(name: string): string | undefined {
    if (typeof document === "undefined") return undefined;
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : undefined;
}

/**
 * Valida se o token parece um JWT real (3 segmentos base64 separados por ponto).
 * Evita que cookies corrompidos (ex: "undefined") sejam usados como token.
 */
function isValidJwt(value: string | undefined): value is string {
    if (!value || value === "undefined" || value === "null") return false;
    const parts = value.split(".");
    return parts.length === 3 && parts.every((p) => p.length > 0);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const raw = getRawCookie(AUTH_COOKIE);

        if (isValidJwt(raw)) {
            setToken(raw);
        } else if (raw) {
            // Cookie existe mas é inválido (ex: "undefined") → limpa automaticamente
            const preview = String(raw).substring(0, 20);
            console.warn("[Auth] Cookie inválido detectado e removido:", preview);
            deleteCookie(AUTH_COOKIE);
        }

        setLoading(false);
    }, []);

    async function signInWithEmail(payload: SignInPayload) {
        const data = await signIn(payload);

        if (!data?.accessToken) {
            throw new Error("Resposta da API inválida: token não recebido.");
        }

        setCookie(AUTH_COOKIE, data.accessToken);
        setToken(data.accessToken);
    }

    function signOut() {
        deleteCookie(AUTH_COOKIE);
        setToken(null);
    }

    const value = useMemo(
        () => ({ token, loading, signInWithEmail, signOut }),
        [token, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
