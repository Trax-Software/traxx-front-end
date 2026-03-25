import CampaignCard from "@/components/campaigns/CampaignCard";

export type CampaignListItem = {
  id?: string;
  title: string;
  subtitle: string;
  status: "success" | "warning" | "danger";
  statusLabel: string;
  timeLabel: string;
  platformLabel: string;
  platformColor: string;
  platformBg: string;
};

const fallbackCampaigns: CampaignListItem[] = [
  {
    title: "Pipeline Q1 — Retargeting",
    subtitle: "Público: Leads quentes",
    status: "success" as const,
    statusLabel: "Concluída",
    timeLabel: "Hoje, 09:12",
    platformLabel: "M",
    platformColor: "#58A6FF",
    platformBg: "rgba(88, 166, 255, 0.12)",
  },
  {
    title: "Lançamento — Intro ao TR",
    subtitle: "Objetivo: Awareness",
    status: "warning" as const,
    statusLabel: "Gerando...",
    timeLabel: "Hoje, 08:47",
    platformLabel: "G",
    platformColor: "#F85149",
    platformBg: "rgba(248, 81, 73, 0.12)",
  },
];

type CampaignListProps = {
  campaigns?: CampaignListItem[];
};

export default function CampaignList({ campaigns = fallbackCampaigns }: CampaignListProps) {
  return (
    <div className="flex flex-col gap-4">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id ?? campaign.title} {...campaign} />
      ))}
    </div>
  );
}
