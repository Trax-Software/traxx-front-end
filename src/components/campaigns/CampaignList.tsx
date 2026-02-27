import CampaignCard from "@/components/campaigns/CampaignCard";

const campaigns = [
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

export default function CampaignList() {
  return (
    <div className="flex flex-col gap-4">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.title} {...campaign} />
      ))}
    </div>
  );
}
