import { api, toServiceError, unwrap } from "./api";

export type GenerateImageDto = {
  prompt: string;
  campaignId: string;
};

export type GenerateImageResponse = {
  jobId: string;
  status: string;
};

export async function generateCampaignImage(dto: GenerateImageDto): Promise<GenerateImageResponse> {
  try {
    const response = await api.post("/ai/generate-image", dto);
    return unwrap<GenerateImageResponse>(response);
  } catch (error) {
    throw toServiceError(error);
  }
}
