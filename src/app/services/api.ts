import axios, { InternalAxiosRequestConfig } from "axios";
import { getClientCookie } from "@/utils/cookies";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// ── Interceptor de REQUEST: injeta o JWT ──────────────────────────────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
        const token = getClientCookie("trax_token");
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// ── Interceptor de RESPONSE: desembrulha o envelope do TransformInterceptor ──
// O NestJS globalInterceptor envolve todas as respostas em:
// { data: T, meta: { timestamp, path } }
// Com este interceptor, todos os services recebem T diretamente (transparente).
api.interceptors.response.use((response) => {
    if (
        response.data &&
        typeof response.data === "object" &&
        "data" in response.data &&
        "meta" in response.data
    ) {
        response.data = response.data.data;
    }
    return response;
});