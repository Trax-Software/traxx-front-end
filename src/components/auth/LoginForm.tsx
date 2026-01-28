"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";

import axios from "axios";
import {useAuth} from "@/context/AuthContext";
import {Input} from "@/components/ui/Inputs";

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function LoginForm() {
    const router = useRouter();
    const { signInWithEmail } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [errorTop, setErrorTop] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorTop(null);

        const nextErrors: typeof errors = {};
        if (!email) nextErrors.email = "Informe seu e-mail.";
        else if (!isValidEmail(email)) nextErrors.email = "Informe um e-mail válido.";

        if (!password) nextErrors.password = "Informe sua senha.";

        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) return;

        try {
            setLoading(true);
            await signInWithEmail({ email, password });

            router.push("/admin");
        } catch (err) {
            // Substituímos 'any' por tipagem rigorosa do Axios
            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError<NestApiError>;
                const data = axiosError.response?.data;
                
                if (data?.message) {
                    const msg = data.message;
                    setErrorTop(Array.isArray(msg) ? msg.join(" • ") : msg);
                } else {
                    setErrorTop("Falha ao entrar. Verifique suas credenciais.");
                }
            } else {
                setErrorTop("Ocorreu um erro inesperado.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 16 }}>
            {errorTop ? (
                <div
                    style={{
                        background: "#FEF2F1",
                        border: "1px solid #D93025",
                        color: "#D93025",
                        padding: 12,
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 600,
                    }}
                >
                    {errorTop}
                </div>
            ) : null}

            <Input
                label="E-mail"
                placeholder="nome@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                autoComplete="email"
            />

            <Input
                label="Senha"
                placeholder="Digite sua senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                autoComplete="current-password"
            />

            <Button type="submit" loading={loading}>
                Entrar
            </Button>

            <div style={{ textAlign: "center", fontSize: 13, opacity: 0.8 }}>
                Precisa de acesso? <a href="#" style={{ fontWeight: 700 }}>Fale com o suporte</a>
            </div>
        </form>
    );
}
