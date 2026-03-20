/**
 * CampaignCard
 * Card rico para listagem de campanhas.
 * Exibe status, plataforma, objetivo, e uma barra de progresso
 * visual do ciclo de vida da campanha.
 */

"use client";

import { Campaign } from "@/app/services/campaigns";
import { ArrowRight, Facebook, Globe, Linkedin, MoreVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CampaignStatusBadge } from "./CampaignStatusBadge";

// ── Constantes ─────────────────────────────────────────────────────────────────

const PLATFORM_ICON: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  META:     { icon: Facebook, color: "#1877F2", label: "Meta Ads" },
  GOOGLE:   { icon: Globe,    color: "#EA4335", label: "Google Ads" },
  LINKEDIN: { icon: Linkedin, color: "#0A66C2", label: "LinkedIn Ads" },
};

const OBJECTIVE_LABEL: Record<string, string> = {
  AWARENESS: "Reconhecimento",
  TRAFFIC:   "Tráfego",
  SALES:     "Vendas",
  LEADS:     "Leads",
};

// Progresso percentual de cada status no ciclo de vida
const STATUS_PROGRESS: Record<string, number> = {
  DRAFT:               10,
  GENERATING_STRATEGY: 30,
  WAITING_APPROVAL:    50,
  GENERATING_ASSETS:   70,
  COMPLETED:           90,
  PUBLISHED:          100,
};

// ── Props ───────────────────────────────────────────────────────────────────────
type Props = {
  campaign: Campaign;
  onDelete: (id: string) => void;
  deleting: boolean;
};

// ── Componente ──────────────────────────────────────────────────────────────────
export function CampaignCard({ campaign: c, onDelete, deleting }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const platform = PLATFORM_ICON[c.platform] ?? PLATFORM_ICON.META;
  const PlatformIcon = platform.icon;
  const progress = STATUS_PROGRESS[c.status] ?? 10;
  const createdAt = new Date(c.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric"
  });

  return (
    <div
      className="card card-lift animate-fade-slide"
      style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14, position: "relative" }}
    >
      {/* Header: status + menu */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <CampaignStatusBadge status={c.status} />

        <div style={{ position: "relative" }}>
          <button
            onClick={() => setMenuOpen((p) => !p)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-tertiary)", padding: "4px 6px", borderRadius: 6,
              transition: "color 0.2s, background 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.background = "var(--bg-surface-2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-tertiary)";
              e.currentTarget.style.background = "none";
            }}
            aria-label="Opções da campanha"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <div
              style={{
                position: "absolute", right: 0, top: "110%", zIndex: 50,
                background: "var(--bg-surface)", border: "1px solid var(--border)",
                borderRadius: 10, boxShadow: "var(--shadow-md)", minWidth: 150,
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => { setMenuOpen(false); onDelete(c.id); }}
                disabled={deleting}
                style={{
                  width: "100%", padding: "10px 14px",
                  display: "flex", alignItems: "center", gap: 8,
                  background: "none", border: "none", cursor: "pointer",
                  color: "#ef4444", fontSize: 13, fontWeight: 600,
                  transition: "background 0.15s", fontFamily: "inherit",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                <Trash2 size={14} /> Arquivar campanha
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Plataforma + Objetivo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: `${platform.color}18`,
          display: "grid", placeItems: "center", flexShrink: 0,
        }}>
          <PlatformIcon size={14} color={platform.color} />
        </div>
        <span style={{ fontSize: 12, color: "var(--text-tertiary)", fontWeight: 500 }}>
          {platform.label} · {OBJECTIVE_LABEL[c.objective] ?? c.objective}
        </span>
      </div>

      {/* Título */}
      <div>
        <h3 style={{
          fontSize: 16, fontWeight: 700, color: "var(--text-primary)",
          marginBottom: 4, lineHeight: 1.3,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {c.name}
        </h3>
        {c.description && (
          <p style={{
            fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5,
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {c.description}
          </p>
        )}
      </div>

      {/* Progresso do ciclo de vida */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 600 }}>Progresso</span>
          <span style={{ fontSize: 11, color: "var(--primary)", fontWeight: 700 }}>{progress}%</span>
        </div>
        <div style={{
          height: 4, background: "var(--bg-surface-2)", borderRadius: 9999, overflow: "hidden",
        }}>
          <div style={{
            height: "100%", width: `${progress}%`,
            background: progress === 100
              ? "linear-gradient(90deg, #16a34a, #22c55e)"
              : "linear-gradient(90deg, #FD8F06, #990099)",
            borderRadius: 9999,
            transition: "width 0.6s ease",
          }} />
        </div>
      </div>

      {/* Footer: data + link */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingTop: 12, borderTop: "1px solid var(--border)",
        marginTop: "auto",
      }}>
        <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{createdAt}</span>
        <Link
          href={`/admin/campaigns/${c.id}`}
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: 13, fontWeight: 700, color: "var(--primary)",
            textDecoration: "none", transition: "gap 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.gap = "8px")}
          onMouseLeave={(e) => (e.currentTarget.style.gap = "4px")}
        >
          Ver detalhes <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
