"use client";

import { Campaign, listCampaigns } from "@/app/services/campaigns";
import { useCallback, useEffect, useState } from "react";

export type UICampaign = {
  id: string;
  title: string;
  subtitle: string;
  status: "success" | "warning" | "danger";
  statusLabel: string;
  timeLabel: string;
  platformLabel: string;
  platformColor: string;
  platformBg: string;
};

function formatTimeLabel(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Data indisponível";
  }

  const datePart = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });

  const timePart = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${datePart}, ${timePart}`;
}

function mapStatus(status: Campaign["status"]): Pick<UICampaign, "status" | "statusLabel"> {
  switch (status) {
    case "COMPLETED":
      return { status: "success", statusLabel: "Concluída" };
    case "PUBLISHED":
      return { status: "success", statusLabel: "Publicada" };
    case "GENERATING_STRATEGY":
      return { status: "warning", statusLabel: "Gerando estratégia" };
    case "WAITING_APPROVAL":
      return { status: "warning", statusLabel: "Aguardando aprovação" };
    case "GENERATING_ASSETS":
      return { status: "warning", statusLabel: "Gerando assets" };
    case "DRAFT":
      return { status: "warning", statusLabel: "Rascunho" };
    default:
      return { status: "danger", statusLabel: "Status desconhecido" };
  }
}

function mapPlatform(platform: Campaign["platform"]): Pick<UICampaign, "platformLabel" | "platformColor" | "platformBg"> {
  switch (platform) {
    case "GOOGLE":
      return {
        platformLabel: "G",
        platformColor: "#F85149",
        platformBg: "rgba(248, 81, 73, 0.12)",
      };
    case "LINKEDIN":
      return {
        platformLabel: "L",
        platformColor: "#0A66C2",
        platformBg: "rgba(10, 102, 194, 0.12)",
      };
    case "META":
    default:
      return {
        platformLabel: "M",
        platformColor: "#58A6FF",
        platformBg: "rgba(88, 166, 255, 0.12)",
      };
  }
}

function mapObjectiveLabel(objective: Campaign["objective"]) {
  switch (objective) {
    case "AWARENESS":
      return "Reconhecimento";
    case "TRAFFIC":
      return "Tráfego";
    case "SALES":
      return "Vendas";
    case "LEADS":
      return "Leads";
    default:
      return objective;
  }
}

export function mapApiCampaignToUi(campaign: Campaign): UICampaign {
  const mappedStatus = mapStatus(campaign.status);
  const mappedPlatform = mapPlatform(campaign.platform);

  return {
    id: campaign.id,
    title: campaign.name,
    subtitle: campaign.targetAudience
      ? `Público: ${campaign.targetAudience}`
      : `Objetivo: ${mapObjectiveLabel(campaign.objective)}`,
    status: mappedStatus.status,
    statusLabel: mappedStatus.statusLabel,
    timeLabel: formatTimeLabel(campaign.createdAt),
    platformLabel: mappedPlatform.platformLabel,
    platformColor: mappedPlatform.platformColor,
    platformBg: mappedPlatform.platformBg,
  };
}

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await listCampaigns();
      setCampaigns(data);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar as campanhas.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    campaigns,
    isLoading,
    error,
    refetch,
  };
}
