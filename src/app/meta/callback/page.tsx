"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { connectMeta } from "@/app/services/integrations";

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Não foi possível concluir a conexão com a Meta.";
}

export default function MetaCallbackPage() {
  const router = useRouter();
  const hasStartedRef = useRef(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;

    const search = typeof window !== "undefined" ? window.location.search : "";
    const code = new URLSearchParams(search).get("code");

    if (!code) {
      setError("Código de autorização não encontrado na URL.");
      return;
    }
    const authCode: string = code;

    let active = true;

    async function exchangeCode() {
      try {
        await connectMeta(authCode);

        if (!active) {
          return;
        }

        router.replace("/admin/integrations");
      } catch (exchangeError) {
        if (!active) {
          return;
        }

        setError(getErrorMessage(exchangeError));
      }
    }

    void exchangeCode();

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg-body)] px-4 py-8">
      <section className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-md)]">
        <h1 className="text-lg font-bold text-[var(--text-main)]">Conexão Meta</h1>

        {!error ? (
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            Conectando sua conta... você será redirecionado em instantes.
          </p>
        ) : (
          <>
            <p className="mt-3 text-sm text-[var(--danger-text)]">{error}</p>
            <Link
              href="/admin/integrations"
              className="mt-4 inline-flex rounded-[var(--radius-md)] border border-[var(--border)] px-3 py-2 text-sm font-semibold text-[var(--text-main)]"
            >
              Voltar
            </Link>
          </>
        )}
      </section>
    </main>
  );
}
