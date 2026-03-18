"use client";

import { useAuth } from "@/context/AuthContext";
import axios, { AxiosError } from "axios";
import { AlertCircle, Eye, EyeOff, Loader2, LogIn, Wifi } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Tipagem da resposta de erro do NestJS
type NestApiError = {
  message: string | string[];
  statusCode?: number;
  error?: string;
};

function parseError(err: unknown): string {
  if (!axios.isAxiosError(err)) {
    return "Ocorreu um erro inesperado. Tente novamente.";
  }

  const axiosErr = err as AxiosError<NestApiError>;

  // Sem resposta = problema de rede/API offline
  if (!axiosErr.response) {
    return "Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente.";
  }

  const { statusCode, message } = axiosErr.response.data ?? {};

  if (statusCode === 401 || statusCode === 403) {
    return "E-mail ou senha incorretos. Verifique suas credenciais.";
  }
  if (statusCode === 429) {
    return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
  }
  if (typeof message === "string" && message) return message;
  if (Array.isArray(message) && message.length) return message.join(" • ");

  return "Falha ao entrar. Tente novamente.";
}

type NestApiError = {
    message?: string;
    error?: string;
    statusCode?: number;
    [k: string]: unknown;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function LoginForm() {
  const router = useRouter();
  const { signInWithEmail } = useAuth();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  function validate() {
    const errs: typeof fieldErrors = {};
    if (!email.trim()) errs.email = "Informe seu e-mail.";
    else if (!isValidEmail(email)) errs.email = "Informe um e-mail válido.";
    if (!password) errs.password = "Informe sua senha.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      await signInWithEmail({ email, password });
      router.push("/admin");
    } catch (err) {
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>

      {/* ── Erro global ─────────────────────────────────────────────── */}
      {error && (
        <div
          role="alert"
          className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-start gap-2.5 animate-fade text-red-400"
        >
          {error.includes("servidor") || error.includes("conexão")
            ? <Wifi size={16} className="shrink-0 mt-0.5" />
            : <AlertCircle size={16} className="shrink-0 mt-0.5" />
          }
          <p className="text-[13px] leading-relaxed m-0 text-red-300">
            {error}
          </p>
        </div>
      )}

      {/* ── E-mail ──────────────────────────────────────────────────── */}
      <div>
        <label htmlFor="login-email" className="block text-[12px] font-bold text-white/70 mb-1.5 tracking-wide">
          E-MAIL
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="nome@empresa.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: undefined })); setError(null); }}
          disabled={loading}
          className={`w-full px-4 py-3 rounded-xl text-sm bg-white/5 border ${fieldErrors.email ? 'border-red-400/60' : 'border-white/10 focus:border-[#FD8F06] hover:border-white/20'} text-white outline-none transition-colors placeholder:text-white/30`}
        />
        {fieldErrors.email && (
          <span className="text-[12px] text-red-400 mt-1.5 flex items-center gap-1">
            <AlertCircle size={11} /> {fieldErrors.email}
          </span>
        )}
      </div>

      {/* ── Senha ───────────────────────────────────────────────────── */}
      <div>
        <label htmlFor="login-password" className="block text-[12px] font-bold text-white/70 mb-1.5 tracking-wide">
          SENHA
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={showPass ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: undefined })); setError(null); }}
            disabled={loading}
            className={`w-full pl-4 pr-11 py-3 rounded-xl text-sm bg-white/5 border ${fieldErrors.password ? 'border-red-400/60' : 'border-white/10 focus:border-[#FD8F06] hover:border-white/20'} text-white outline-none transition-colors placeholder:text-white/30`}
          />
          <button
            type="button"
            onClick={() => setShowPass((p) => !p)}
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-white/40 p-1 flex items-center hover:text-white/70 transition-colors"
            aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {fieldErrors.password && (
          <span className="text-[12px] text-red-400 mt-1.5 flex items-center gap-1">
            <AlertCircle size={11} /> {fieldErrors.password}
          </span>
        )}
      </div>

      {/* ── Botão Entrar ─────────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full mt-2 py-3.5 rounded-xl border-none text-[15px] font-bold flex items-center justify-center gap-2 transition-all ${loading ? 'bg-white/10 text-white/50 cursor-not-allowed' : 'bg-brand-gradient text-white hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(253,143,6,0.35)] cursor-pointer'}`}
      >
        {loading
          ? <><Loader2 size={16} className="animate-spin" /> Entrando...</>
          : <><LogIn size={16} /> Entrar no sistema</>
        }
      </button>

      {/* ── Link de suporte ──────────────────────────────────────────── */}
      <p className="text-center text-[13px] text-white/40 m-0 mt-3">
        Dúvidas sobre o acesso?{" "}
        <a href="mailto:suporte@trax.com.br" className="text-[#FD8F06] font-bold no-underline hover:text-[#e58105] hover:underline transition-all">
          Fale com o suporte
        </a>
      </p>
    </form>
  );
}
