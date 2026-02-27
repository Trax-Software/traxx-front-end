"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {AuthUser, signIn, SignInPayload} from "@/app/services/auth";


type AuthContextValue = {
    token: string | null;
    user: AuthUser | null;
    loading: boolean;
    signInWithEmail: (payload: SignInPayload) => Promise<void>;
    signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function setCookie(name: string, value: string, days = 7) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; samesite=lax`;
}

function deleteCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; samesite=lax`;
}

function getCookie(name: string) {
    if (typeof document === "undefined") return undefined;
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? match[1] : undefined;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = getCookie("trax_token");
        if (t) setToken(decodeURIComponent(t));
        setLoading(false);
    }, []);

    async function signInWithEmail(payload: SignInPayload) {
        const data = await signIn(payload);

        setCookie("trax_token", data.accessToken);
        setToken(data.accessToken);
        setUser(data.user ?? null);
    }

    function signOut() {
        deleteCookie("trax_token");
        setToken(null);
        setUser(null);
    }

    const value = useMemo(
        () => ({ token, user, loading, signInWithEmail, signOut }),
        [token, user, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
