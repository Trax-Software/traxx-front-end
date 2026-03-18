import { api } from "./api";

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
  description: string;
  targetAudience?: string;
  keyMessage?: string;
};

// --- API Functions ---

export async function listCampaigns(): Promise<Campaign[]> {
  const { data } = await api.get<Campaign[]>("/v1/campaigns");
  return data;
}

export async function getCampaign(id: string): Promise<Campaign> {
  const { data } = await api.get<Campaign>(`/v1/campaigns/${id}`);
  return data;
}

export async function createCampaign(dto: CreateCampaignDto): Promise<Campaign> {
  const { data } = await api.post<Campaign>("/v1/campaigns", dto);
  return data;
}

export async function updateCampaign(id: string, dto: UpdateCampaignDto): Promise<Campaign> {
  const { data } = await api.patch<Campaign>(`/v1/campaigns/${id}`, dto);
  return data;
}

export async function deleteCampaign(id: string): Promise<void> {
  await api.delete(`/v1/campaigns/${id}`);
}

export async function brainstormStrategy(id: string): Promise<StrategyOption[]> {
  const { data } = await api.post<StrategyOption[]>(`/v1/campaigns/${id}/brainstorm`);
  return data;
}
