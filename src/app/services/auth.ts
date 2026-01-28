import { api } from "./api";

export type SignInPayload = {
    email: string;
    password: string;
};

export type SignInResponse = {
    accessToken: string;
};

export async function signIn(payload: SignInPayload) {
    const { data } = await api.post<SignInResponse>("/v1/auth/sign-in", payload);
    return data;
}
