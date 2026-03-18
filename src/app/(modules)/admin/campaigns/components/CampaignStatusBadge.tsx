/**
 * CampaignStatusBadge
 * Badge reutilizável que exibe o status de uma campanha.
 * Inclui ícone animado para estados de processamento.
 */

import { Campaign } from "@/app/services/campaigns";
import { CheckCircle, Clock, FileText, Megaphone, Sparkles, Zap } from "lucide-react";

type Props = {
  status: Campaign["status"];
  size?: "sm" | "md";
};

export const STATUS_META: Record<Campaign["status"], {
  label: string;
  icon: React.ElementType;
  style: React.CSSProperties;
  pulse?: boolean;
}> = {
  DRAFT: {
    label: "Rascunho",
    icon: FileText,
    style: {
      background: "rgba(120,120,140,0.12)",
      color: "#888",
      border: "1px solid rgba(120,120,140,0.25)",
    },
  },
  GENERATING_STRATEGY: {
    label: "Gerando Estratégia",
    icon: Sparkles,
    style: {
      background: "rgba(253,143,6,0.12)",
      color: "#FD8F06",
      border: "1px solid rgba(253,143,6,0.30)",
    },
    pulse: true,
  },
  WAITING_APPROVAL: {
    label: "Aguardando Aprovação",
    icon: Clock,
    style: {
      background: "rgba(153,0,153,0.10)",
      color: "#990099",
      border: "1px solid rgba(153,0,153,0.25)",
    },
    pulse: true,
  },
  GENERATING_ASSETS: {
    label: "Gerando Criativos",
    icon: Zap,
    style: {
      background: "rgba(59,130,246,0.10)",
      color: "#3b82f6",
      border: "1px solid rgba(59,130,246,0.25)",
    },
    pulse: true,
  },
  COMPLETED: {
    label: "Concluída",
    icon: CheckCircle,
    style: {
      background: "rgba(34,197,94,0.10)",
      color: "#16a34a",
      border: "1px solid rgba(34,197,94,0.25)",
    },
  },
  PUBLISHED: {
    label: "Publicada",
    icon: Megaphone,
    style: {
      background: "linear-gradient(135deg, rgba(253,143,6,0.15), rgba(153,0,153,0.15))",
      color: "#FD8F06",
      border: "1px solid rgba(253,143,6,0.35)",
    },
  },
};

export function CampaignStatusBadge({ status, size = "md" }: Props) {
  const meta = STATUS_META[status];
  if (!meta) return null;
  const Icon = meta.icon;
  const isSmall = size === "sm";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: isSmall ? 4 : 6,
        padding: isSmall ? "3px 8px" : "5px 10px",
        borderRadius: 20,
        fontSize: isSmall ? 11 : 12,
        fontWeight: 700,
        letterSpacing: 0.2,
        whiteSpace: "nowrap",
        ...meta.style,
      }}
    >
      <Icon
        size={isSmall ? 11 : 13}
        style={meta.pulse ? { animation: "spin 2s linear infinite" } : undefined}
      />
      {meta.label}
    </span>
  );
}
