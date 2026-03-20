import { api } from "./api";

export type GenerateImageDto = {
  prompt: string;
  campaignId: string;
};

export type GenerateImageResponse = {
  jobId: string;
  status: string;
};

export async function generateCampaignImage(dto: GenerateImageDto): Promise<GenerateImageResponse> {
  const { data } = await api.post<GenerateImageResponse>("/v1/ai/generate-image", dto);
  return data;
}
