/**
 * Página de Listagem de Campanhas
 * ─────────────────────────────────────────────────────────────────────────────
 * Exibe todas as campanhas do workspace com:
 *   - Stats bar (Total, Rascunhos, Aguardando, Publicadas)
 *   - Busca por nome em tempo real
 *   - Filtros por status em tabs
 *   - Grid de cards ricos com progresso visual
 *   - Estado vazio com CTA claro
 *   - Skeleton loading durante carregamento
 */

"use client";

import { Campaign, deleteCampaign, listCampaigns } from "@/app/services/campaigns";
import { BarChart3, Megaphone, Plus, RefreshCw, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CampaignCard } from "./components/CampaignCard";
import { CreateCampaignModal } from "./components/CreateCampaignModal";

// ── Filtros disponíveis ────────────────────────────────────────────────────────
const FILTERS = [
  { value: "ALL",              label: "Todas" },
  { value: "DRAFT",            label: "Rascunhos" },
  { value: "WAITING_APPROVAL", label: "Para Aprovar" },
  { value: "GENERATING_ASSETS",label: "Em Produção" },
  { value: "COMPLETED",        label: "Concluídas" },
  { value: "PUBLISHED",        label: "Publicadas" },
];

// ── Componente ─────────────────────────────────────────────────────────────────
export default function CampaignsPage() {
  const [campaigns, setCampaigns]   = useState<Campaign[]>([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal]   = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter]         = useState("ALL");
  const [search, setSearch]         = useState("");

  // ── Carga de dados ────────────────────────────────────────────────────────
  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      setCampaigns(await listCampaigns());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Delete ────────────────────────────────────────────────────────────────
  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja arquivar esta campanha?")) return;
    setDeletingId(id);
    try {
      await deleteCampaign(id);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:     campaigns.length,
    drafts:    campaigns.filter((c) => c.status === "DRAFT").length,
    pending:   campaigns.filter((c) => c.status === "WAITING_APPROVAL").length,
    published: campaigns.filter((c) => c.status === "PUBLISHED").length,
  }), [campaigns]);

  // ── Filtros + busca ───────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = filter === "ALL" ? campaigns : campaigns.filter((c) => c.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.objective.toLowerCase().includes(q)
      );
    }
    return list;
  }, [campaigns, filter, search]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div>
      {showModal && (
        <CreateCampaignModal
          onClose={() => setShowModal(false)}
          onCreated={(c) => setCampaigns((prev) => [c, ...prev])}
        />
      )}

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div
        style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, gap: 16 }}
        className="animate-fade-slide"
      >
        <div>
          <h1 className="page-title">Campanhas</h1>
          <p className="page-subtitle">Gerencie e acompanhe suas campanhas de marketing com IA.</p>
          <div className="gradient-bar" style={{ marginTop: 12, width: 48 }} />
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => load(true)}
            className="btn-ghost"
            style={{ padding: "9px 12px" }}
            aria-label="Recarregar campanhas"
            title="Recarregar"
          >
            <RefreshCw size={15} style={refreshing ? { animation: "spin 1s linear infinite" } : undefined} />
          </button>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus size={15} /> Nova Campanha
          </button>
        </div>
      </div>

      {/* ── Stats Bar ───────────────────────────────────────────────────────── */}
      <div
        className="stagger-children"
        style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}
      >
        {[
          { label: "Total",         value: stats.total,     color: "var(--primary)" },
          { label: "Rascunhos",     value: stats.drafts,    color: "#888" },
          { label: "Para Aprovar",  value: stats.pending,   color: "#990099" },
          { label: "Publicadas",    value: stats.published, color: "#16a34a" },
        ].map(({ label, value, color }) => (
          <div key={label} className="card animate-fade-slide" style={{ padding: "16px 18px" }}>
            {loading ? (
              <>
                <div className="skeleton" style={{ height: 28, width: 48, marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 12, width: 72 }} />
              </>
            ) : (
              <>
                <div style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 4, fontWeight: 600 }}>{label}</div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* ── Busca + Filtros ──────────────────────────────────────────────────── */}
      <div
        style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}
        className="animate-fade-slide"
      >
        {/* Campo de busca */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <Search size={14} style={{
            position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
            color: "var(--text-tertiary)", pointerEvents: "none",
          }} />
          <input
            className="field-input"
            style={{ paddingLeft: 34, width: 220, height: 38 }}
            placeholder="Buscar campanha..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Separador */}
        <div style={{ width: 1, height: 24, background: "var(--border)", flexShrink: 0 }} />

        {/* Tabs de status */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {FILTERS.map(({ value, label }) => {
            const active = filter === value;
            const count = value === "ALL"
              ? campaigns.length
              : campaigns.filter((c) => c.status === value).length;
            return (
              <button
                key={value}
                onClick={() => setFilter(value)}
                style={{
                  padding: "7px 14px", borderRadius: 8, border: "1.5px solid",
                  borderColor: active ? "var(--primary)" : "var(--border)",
                  background: active ? "var(--primary)" : "transparent",
                  color: active ? "#fff" : "var(--text-secondary)",
                  fontWeight: 600, fontSize: 13, cursor: "pointer",
                  transition: "all 0.15s", fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                {label}
                {count > 0 && (
                  <span style={{
                    background: active ? "rgba(255,255,255,0.25)" : "var(--bg-surface-2)",
                    borderRadius: 9999, padding: "1px 7px", fontSize: 11, fontWeight: 700,
                  }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Grid de Campanhas ────────────────────────────────────────────────── */}
      {loading ? (
        // Skeleton
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card" style={{ padding: 22 }}>
              <div className="skeleton" style={{ height: 24, width: 100, borderRadius: 12, marginBottom: 14 }} />
              <div className="skeleton" style={{ height: 16, width: "80%", marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 14, width: "55%", marginBottom: 20 }} />
              <div className="skeleton" style={{ height: 4, borderRadius: 9999, marginBottom: 20 }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="skeleton" style={{ height: 12, width: 80 }} />
                <div className="skeleton" style={{ height: 12, width: 90 }} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        // Estado vazio
        <div className="card animate-fade" style={{ padding: "72px 32px", textAlign: "center" }}>
          {search ? (
            <>
              <Search size={36} color="var(--border-strong)" style={{ margin: "0 auto 16px" }} />
              <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 8 }}>
                Nenhuma campanha encontrada para <strong>&ldquo;{search}&rdquo;</strong>
              </p>
              <button onClick={() => setSearch("")} className="btn-ghost" style={{ fontSize: 13 }}>
                Limpar busca
              </button>
            </>
          ) : campaigns.length === 0 ? (
            <>
              <div style={{
                width: 64, height: 64, borderRadius: 20, margin: "0 auto 20px",
                background: "linear-gradient(135deg, rgba(253,143,6,0.15), rgba(153,0,153,0.15))",
                display: "grid", placeItems: "center",
              }}>
                <Megaphone size={28} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
                Nenhuma campanha ainda
              </h3>
              <p style={{ color: "var(--text-tertiary)", fontSize: 14, marginBottom: 24, maxWidth: 340, margin: "0 auto 24px" }}>
                Crie sua primeira campanha e deixe a IA gerar a estratégia ideal para você.
              </p>
              <button onClick={() => setShowModal(true)} className="btn-primary">
                <Plus size={15} /> Criar primeira campanha
              </button>
            </>
          ) : (
            <>
              <BarChart3 size={36} color="var(--border-strong)" style={{ margin: "0 auto 16px" }} />
              <p style={{ color: "var(--text-tertiary)", fontSize: 14 }}>
                Nenhuma campanha neste filtro.
              </p>
            </>
          )}
        </div>
      ) : (
        <div
          className="stagger-children"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}
        >
          {filtered.map((c) => (
            <CampaignCard
              key={c.id}
              campaign={c}
              onDelete={handleDelete}
              deleting={deletingId === c.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
