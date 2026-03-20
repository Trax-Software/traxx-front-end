import { api } from "./api";

// --- Tipos ---

export type AdAccount = {
  id: string;
  name: string;
  currency?: string;
  status?: number;
};

export type FacebookPage = {
  id: string;
  name: string;
  category?: string;
  picture?: { data: { url: string } };
};

export type MetaAuthUrlResponse = {
  url: string;
};

// --- API Functions ---

export const getMetaAuthUrl = async (): Promise<string> => {
  const { data } = await api.get<MetaAuthUrlResponse>("/v1/integrations/meta/auth-url");
  return data.url;
};

export const connectMeta = async (code: string): Promise<{ success: boolean }> => {
  const { data } = await api.post("/v1/integrations/meta/connect", { code });
  return data;
};

export const getAdAccounts = async (): Promise<AdAccount[]> => {
  const { data } = await api.get<AdAccount[]>("/v1/integrations/meta/ad-accounts");
  return data;
};

export const getPages = async (): Promise<FacebookPage[]> => {
  const { data } = await api.get<FacebookPage[]>("/v1/integrations/meta/pages");
  return data;
};
