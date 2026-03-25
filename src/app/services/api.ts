import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getClientCookie } from "@/utils/cookies";

type ApiEnvelope<T> = {
    data: T;
    meta: {
        timestamp: string;
        path: string;
    };
};

type ApiErrorPayload = {
    statusCode?: number;
    message?: string | string[];
    error?: string;
    timestamp?: string;
    path?: string;
};

export type NormalizedApiError = {
    statusCode?: number;
    message: string;
};

export type ServiceError = Error & {
    statusCode?: number;
    response?: {
        data: {
            statusCode?: number;
            message: string;
        };
    };
};

function resolveApiBaseUrl() {
    const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim() ?? "";
    const sanitizedBase = rawBaseUrl.replace(/\/+$/, "");

    if (!sanitizedBase) {
        return "/v1";
    }

    return sanitizedBase.endsWith("/v1") ? sanitizedBase : `${sanitizedBase}/v1`;
}

export const api = axios.create({
    baseURL: resolveApiBaseUrl(),
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

export function unwrap<T>(response: AxiosResponse<ApiEnvelope<T>>): T {
    return response.data.data;
}

export function normalizeApiError(error: unknown): NormalizedApiError {
    if (axios.isAxiosError<ApiErrorPayload>(error)) {
        const payload = error.response?.data;
        const statusCode = payload?.statusCode ?? error.response?.status;
        const rawMessage = payload?.message ?? error.message;

        if (Array.isArray(rawMessage)) {
            return {
                statusCode,
                message: rawMessage.join("\n"),
            };
        }

        if (typeof rawMessage === "string" && rawMessage.trim()) {
            return {
                statusCode,
                message: rawMessage,
            };
        }

        return {
            statusCode,
            message: "Erro inesperado ao comunicar com a API.",
        };
    }

    if (error instanceof Error && error.message.trim()) {
        return {
            message: error.message,
        };
    }

    return {
        message: "Erro inesperado ao comunicar com a API.",
    };
}

export function toServiceError(error: unknown): ServiceError {
    const normalized = normalizeApiError(error);
    const serviceError = new Error(normalized.message) as ServiceError;

    serviceError.name = "ServiceError";
    serviceError.statusCode = normalized.statusCode;
    serviceError.response = {
        data: {
            statusCode: normalized.statusCode,
            message: normalized.message,
        },
    };

    return serviceError;
}
