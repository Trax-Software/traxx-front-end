import { api, toServiceError, unwrap } from "./api";

// --- Tipos ---

export type AdAccount = {
  account_id: string;
  name: string;
  currency?: string;
  account_status?: number | string;
};

export type FacebookPage = {
  id: string;
  name: string;
  category?: string;
  access_token?: string;
  picture?: { data: { url: string } };
};

export type MetaAuthUrlResponse = {
  url: string;
};

export type MetaIntegrationStatus = {
  connected: boolean;
  selectedAdAccountId?: string | null;
  selectedPageId?: string | null;
};

// --- API Functions ---

async function withServiceError<T>(executor: () => Promise<T>): Promise<T> {
  try {
    return await executor();
  } catch (error) {
    throw toServiceError(error);
  }
}

export const getMetaAuthUrl = async (): Promise<string> => {
  return withServiceError(async () => {
    const response = await api.get("/integrations/meta/auth-url");
    return unwrap<MetaAuthUrlResponse>(response).url;
  });
};

export const connectMeta = async (code: string): Promise<{ message: string }> => {
  return withServiceError(async () => {
    const response = await api.post("/integrations/meta/connect", { code });
    return unwrap<{ message: string }>(response);
  });
};

export const getAdAccounts = async (): Promise<AdAccount[]> => {
  return withServiceError(async () => {
    const response = await api.get("/integrations/meta/ad-accounts");
    return unwrap<AdAccount[]>(response);
  });
};

export const getPages = async (): Promise<FacebookPage[]> => {
  return withServiceError(async () => {
    const response = await api.get("/integrations/meta/pages");
    return unwrap<FacebookPage[]>(response);
  });
};

export const getMetaStatus = async (): Promise<MetaIntegrationStatus> => {
  return withServiceError(async () => {
    const response = await api.get("/integrations/meta/status");
    return unwrap<MetaIntegrationStatus>(response);
  });
};

export const setMetaSelection = async (adAccountId: string, pageId: string): Promise<MetaIntegrationStatus> => {
  return withServiceError(async () => {
    const response = await api.post("/integrations/meta/select", { adAccountId, pageId });
    return unwrap<MetaIntegrationStatus>(response);
  });
};
