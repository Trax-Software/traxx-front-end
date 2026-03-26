import { api, toServiceError, unwrap } from "./api";

export type SignInPayload = {
    email: string;
    password: string;
};

export type AuthUser = {
    name: string;
    email: string;
    role: string;
};

export type AuthMembership = {
    id?: string;
    role?: string;
    [key: string]: unknown;
} | null;

export type AuthWorkspace = {
    id?: string;
    name?: string;
    [key: string]: unknown;
} | null;

export type SignInResponse = {
    accessToken: string;
    user?: AuthUser;
};

export const isMockAuthEnabled =
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true";

export type AuthMeResponse = {
    user: AuthUser;
    membership?: AuthMembership;
    workspace?: AuthWorkspace;
};

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

    try {
        const response = await api.post("/auth/sign-in", payload);
        return unwrap<SignInResponse>(response);
    } catch (error) {
        throw toServiceError(error);
    }
}

export async function me(): Promise<AuthMeResponse> {
    if (isMockAuthEnabled) {
        return {
            user: buildMockUser("mock@trax.local"),
            membership: { role: "admin" },
            workspace: { id: "mock-workspace", name: "Workspace Mock" },
        };
    }

    try {
        const response = await api.get("/auth/me");
        return unwrap<AuthMeResponse>(response);
    } catch (error) {
        throw toServiceError(error);
    }
}
