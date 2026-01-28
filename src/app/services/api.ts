import axios, { InternalAxiosRequestConfig } from "axios";
import { getClientCookie } from "@/utils/cookies";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
        const token = getClientCookie("trax_token");

        if (token && config.headers) {
            // Removemos o 'as any' e usamos a interface correta do Axios
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});