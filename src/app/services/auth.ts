import { api } from "./api";

export type SignInPayload = {
    email: string;
    password: string;
};

export type AuthUser = {
    name: string;
    email: string;
    role: string;
};

export type SignInResponse = {
    accessToken: string;
    user?: AuthUser;
};

const isMockAuthEnabled =
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true";

function buildMockUser(email: string): AuthUser {
    const localPart = email.split("@")[0] || "mock";
    return {
        name: localPart,
        email,
        role: "admin",
    };
}

export async function signIn(payload: SignInPayload) {
    if (isMockAuthEnabled) {
        const email = payload.email?.trim() || "mock@trax.local";
        return {
            accessToken: "mock-token",
            user: buildMockUser(email),
        };
    }

    const { data } = await api.post<SignInResponse>("/v1/auth/sign-in", payload);
    return data;
}
