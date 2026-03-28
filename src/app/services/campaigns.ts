import { api, toServiceError, unwrap } from "./api";

// --- Tipos ---

export type CampaignObjective = "AWARENESS" | "TRAFFIC" | "SALES" | "LEADS";
export type CampaignStatus =
  | "DRAFT"
  | "GENERATING_STRATEGY"
  | "WAITING_APPROVAL"
  | "GENERATING_ASSETS"
  | "COMPLETED"
  | "PUBLISHED";
export type AdPlatform = "META" | "GOOGLE" | "LINKEDIN";

export type AdCreative = {
  id: string;
  name: string;
  imageUrl?: string;
  videoUrl?: string;
  headline?: string;
  primaryText?: string;
  aiModel?: string;
  isSelected: boolean;
  createdAt: string;
};

export type Campaign = {
  id: string;
  name: string;
  objective: CampaignObjective;
  platform: AdPlatform;
  targetAudience?: string;
  keyBenefits?: string;
  brandTone?: string;
  status: CampaignStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    adCreatives?: number;
  };
  adCreatives?: AdCreative[];

  // Novos campos de Produto
  productName?: string;
  productCategory?: string;
  productPrice?: number;
  productOriginalPrice?: number;
  productUrl?: string;
  productUsp?: string;

  // Oferta
  offerType?: string;
  offerDeadline?: string;
  ctaText?: string;

  // Orçamento
  budgetDaily?: number;
  budgetTotal?: number;
};

export type CreateCampaignDto = {
  name: string;
  objective: CampaignObjective;
  platform?: AdPlatform;
  targetAudience?: string;
  keyBenefits?: string;
  brandTone?: string;
  description?: string;

  // Novos campos
  productName?: string;
  productCategory?: string;
  productPrice?: number;
  productOriginalPrice?: number;
  productUrl?: string;
  productUsp?: string;
  offerType?: string;
  offerDeadline?: string;
  ctaText?: string;
  budgetDaily?: number;
  budgetTotal?: number;
};

export type UpdateCampaignDto = Partial<CreateCampaignDto> & {
  status?: CampaignStatus;
};

export type StrategyOption = {
  title: string;
  description?: string;
  targetAudience?: string;
  keyBenefits?: string;
  brandTone?: string;
  reasoning?: string;
  keyMessage?: string;
};

// --- API Functions ---

async function withServiceError<T>(executor: () => Promise<T>): Promise<T> {
  try {
    return await executor();
  } catch (error) {
    throw toServiceError(error);
  }
}

export async function listCampaigns(): Promise<Campaign[]> {
  return withServiceError(async () => {
    const response = await api.get("/campaigns");
    return unwrap<Campaign[]>(response);
  });
}

export async function getCampaign(id: string): Promise<Campaign> {
  return withServiceError(async () => {
    const response = await api.get(`/campaigns/${id}`);
    return unwrap<Campaign>(response);
  });
}

export async function createCampaign(dto: CreateCampaignDto): Promise<Campaign> {
  return withServiceError(async () => {
    const response = await api.post("/campaigns", dto);
    return unwrap<Campaign>(response);
  });
}

export async function updateCampaign(id: string, dto: UpdateCampaignDto): Promise<Campaign> {
  return withServiceError(async () => {
    const response = await api.patch(`/campaigns/${id}`, dto);
    return unwrap<Campaign>(response);
  });
}

export async function deleteCampaign(id: string): Promise<void> {
  return withServiceError(async () => {
    await api.delete(`/campaigns/${id}`);
  });
}

export async function publishCampaignToMeta(id: string): Promise<Campaign> {
  return withServiceError(async () => {
    const response = await api.post(`/campaigns/${id}/publish/meta`);
    return unwrap<Campaign>(response);
  });
}

export async function brainstormStrategy(id: string): Promise<StrategyOption[]> {
  return withServiceError(async () => {
    const response = await api.post(`/campaigns/${id}/brainstorm`);
    return unwrap<StrategyOption[]>(response);
  });
}

export type CopyOption = {
  headline: string;
  primaryText: string;
  cta: string;
  framework?: string;
  reasoning?: string;
};

export type CopyGenerationFallback = {
  error?: string;
  rawContent?: string;
};

export async function generateCopyOptions(
  id: string
): Promise<CopyOption[] | CopyGenerationFallback> {
  return withServiceError(async () => {
    const response = await api.post(`/campaigns/${id}/generate-copy`);
    return unwrap<CopyOption[] | CopyGenerationFallback>(response);
  });
}
