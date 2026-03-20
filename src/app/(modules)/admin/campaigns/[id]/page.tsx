/**
 * Página de Detalhe de Campanha
 * ─────────────────────────────────────────────────────────────────────────────
 * Exibe todos os dados de uma campanha com:
 *   - Breadcrumb + header com status e ações
 *   - Timeline visual do fluxo de status
 *   - Cards de informação editáveis inline
 *   - Seção de IA com brainstorm + seleção de estratégia
 *   - Grid de criativos gerados
 */

"use client";

import {
  Campaign, StrategyOption,
  brainstormStrategy, deleteCampaign, getCampaign, updateCampaign,
} from "@/app/services/campaigns";
import { generateCampaignImage } from "@/app/services/ai";
import {
  ArrowLeft, Calendar, CheckCircle, DollarSign, Edit3, FileText, 
  Image as ImageIcon, Link as LinkIcon, Megaphone, Package,
  RotateCcw, Save, Sparkles, Tag, Target, Trash2, X, Zap
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CampaignStatusBadge, STATUS_META } from "../components/CampaignStatusBadge";
import { StrategySelector } from "../components/StrategySelector";

// ── Timeline de Status ────────────────────────────────────────────────────────
const STATUS_FLOW: Campaign["status"][] = [
  "DRAFT", "GENERATING_STRATEGY", "WAITING_APPROVAL",
  "GENERATING_ASSETS", "COMPLETED", "PUBLISHED",
];

function StatusTimeline({ current }: { current: Campaign["status"] }) {
  const currentIdx = STATUS_FLOW.indexOf(current);

  return (
    <div style={{ marginBottom: 32 }} className="animate-fade-slide">
      <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-tertiary)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>
        Progresso da Campanha
      </p>
      <div style={{
        display: "flex", alignItems: "center",
        overflowX: "auto", gap: 0, paddingBottom: 4,
      }}>
        {STATUS_FLOW.map((status, i) => {
          const meta = STATUS_META[status];
          const Icon = meta.icon;
          const isDone = i < currentIdx;
          const isCurrent = i === currentIdx;

          return (
            <div key={status} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              {/* Passo */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: isDone
                    ? "linear-gradient(135deg, #FD8F06, #990099)"
                    : isCurrent
                    ? "var(--primary-light)"
                    : "var(--bg-surface-2)",
                  border: `2px solid ${isDone ? "#FD8F06" : isCurrent ? "var(--primary)" : "var(--border)"}`,
                  display: "grid", placeItems: "center",
                  transition: "all 0.3s",
                  boxShadow: isCurrent ? "0 0 0 4px var(--primary-light)" : "none",
                }}>
                  {isDone
                    ? <CheckCircle size={15} color="#fff" />
                    : <Icon size={14} color={isCurrent ? "var(--primary)" : "var(--text-tertiary)"} />
                  }
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, textAlign: "center",
                  color: isCurrent ? "var(--primary)" : isDone ? "var(--text-secondary)" : "var(--text-tertiary)",
                  maxWidth: 70, lineHeight: 1.3, whiteSpace: "nowrap",
                }}>
                  {meta.label}
                </span>
              </div>

              {/* Linha conectora */}
              {i < STATUS_FLOW.length - 1 && (
                <div style={{
                  width: 40, height: 2, margin: "-18px 0 0",
                  background: i < currentIdx
                    ? "linear-gradient(90deg, #FD8F06, #990099)"
                    : "var(--border)",
                  transition: "background 0.3s",
                  flexShrink: 0,
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Campo editável inline ─────────────────────────────────────────────────────
function EditableField({
  label, value, placeholder, multiline, icon: Icon,
  onSave,
}: {
  label: string;
  value?: string;
  placeholder: string;
  multiline?: boolean;
  icon: React.ElementType;
  onSave: (val: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(draft);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Icon size={14} color="var(--primary)" />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: "var(--text-tertiary)" }}>
            {label}
          </span>
        </div>
        {!editing && (
          <button
            onClick={() => { setDraft(value ?? ""); setEditing(true); }}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-tertiary)", padding: 4, borderRadius: 6,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-tertiary)")}
            aria-label={`Editar ${label}`}
          >
            <Edit3 size={13} />
          </button>
        )}
      </div>

      {editing ? (
        <div style={{ display: "grid", gap: 8 }}>
          {multiline ? (
            <textarea
              className="field-input"
              style={{ minHeight: 72, resize: "vertical", fontSize: 13 }}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={placeholder}
              autoFocus
            />
          ) : (
            <input
              className="field-input"
              style={{ fontSize: 13 }}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={placeholder}
              autoFocus
            />
          )}
          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
            <button
              onClick={() => setEditing(false)}
              style={{
                background: "none", border: "1px solid var(--border)",
                borderRadius: 8, padding: "5px 12px", fontSize: 12,
                cursor: "pointer", color: "var(--text-secondary)", fontFamily: "inherit",
              }}
            >
              <X size={12} style={{ display: "inline", marginRight: 4 }} />
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                background: "var(--primary)", border: "none",
                borderRadius: 8, padding: "5px 12px", fontSize: 12,
                cursor: saving ? "not-allowed" : "pointer",
                color: "#fff", fontWeight: 700, fontFamily: "inherit",
                opacity: saving ? 0.7 : 1,
              }}
            >
              <Save size={12} style={{ display: "inline", marginRight: 4 }} />
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      ) : (
        <p style={{
          color: value ? "var(--text-primary)" : "var(--text-tertiary)",
          fontSize: 13, lineHeight: 1.6, margin: 0,
          fontStyle: value ? "normal" : "italic",
        }}>
          {value || placeholder}
        </p>
      )}
    </div>
  );
}

// ── Componente Principal ──────────────────────────────────────────────────────
export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [campaign, setCampaign]         = useState<Campaign | null>(null);
  const [loading, setLoading]           = useState(true);
  const [brainstorming, setBrainstorming] = useState(false);
  const [strategies, setStrategies]     = useState<StrategyOption[]>([]);
  const [selectedIdx, setSelectedIdx]   = useState<number | null>(null);
  const [strategySaving, setStrategySaving] = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [imagePrompt, setImagePrompt]   = useState("");

  // ── Carregamento ────────────────────────────────────────────────────────────
  useEffect(() => {
    getCampaign(id)
      .then(setCampaign)
      .catch(() => setError("Campanha não encontrada."))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Salvar campo inline ─────────────────────────────────────────────────────
  async function saveField(field: keyof Campaign, value: string | number | null | undefined) {
    const updated = await updateCampaign(id, { [field]: value });
    setCampaign(updated);
  }

  // ── Brainstorm ──────────────────────────────────────────────────────────────
  async function handleBrainstorm() {
    if (!campaign) return;
    setBrainstorming(true); setError(null);
    try {
      const options = await brainstormStrategy(id);
      setStrategies(options);
      setCampaign((prev) => prev ? { ...prev, status: "WAITING_APPROVAL" } : prev);
    } catch {
      setError("Erro ao gerar estratégia. Verifique sua conexão e tente novamente.");
    } finally { setBrainstorming(false); }
  }

  // ── Selecionar estratégia ───────────────────────────────────────────────────
  async function handleSelectStrategy(index: number) {
    if (!campaign) return;
    setSelectedIdx(index);
    const chosen = strategies[index];
    setStrategySaving(true);
    try {
      const updated = await updateCampaign(id, {
        description:    chosen.description,
        targetAudience: chosen.targetAudience,
        status:         "GENERATING_ASSETS",
      });
      setCampaign(updated);
      setStrategies([]); // Limpa as opções após seleção
    } finally { setStrategySaving(false); }
  }

  // ── Gerar novamente ─────────────────────────────────────────────────────────
  function handleRegenerateBrainstorm() {
    setStrategies([]); setSelectedIdx(null); setError(null);
  }

  // ── Gerar Imagem com IA ─────────────────────────────────────────────────────
  async function handleGenerateImage() {
    if (!campaign || !imagePrompt.trim()) {
      setError("Digite uma descrição para a imagem.");
      return;
    }
    setGeneratingImage(true);
    setError(null);
    try {
      const result = await generateCampaignImage({
        prompt: imagePrompt,
        campaignId: id,
      });
      setImagePrompt("");
      setError(null);
      alert(`Imagem em processamento! Job ID: ${result.jobId}\n\nA imagem será gerada em background e aparecerá nos criativos em alguns segundos.`);
      
      setTimeout(() => {
        getCampaign(id).then(setCampaign);
      }, 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao gerar imagem. Verifique seus créditos.");
    } finally {
      setGeneratingImage(false);
    }
  }

  // ── Delete ──────────────────────────────────────────────────────────────────
  async function handleDelete() {
    if (!confirm("Tem certeza que deseja arquivar esta campanha?")) return;
    await deleteCampaign(id);
    router.push("/admin/campaigns");
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) return (
    <div>
      <div className="skeleton" style={{ height: 16, width: 120, marginBottom: 24 }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <div className="skeleton" style={{ height: 32, width: 280, marginBottom: 12 }} />
          <div className="skeleton" style={{ height: 14, width: 180 }} />
        </div>
        <div className="skeleton" style={{ height: 36, width: 100 }} />
      </div>
      <div style={{ display: "grid", gap: 12, marginBottom: 28 }}>
        <div className="skeleton" style={{ height: 60 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div className="skeleton" style={{ height: 90 }} />
          <div className="skeleton" style={{ height: 90 }} />
          <div className="skeleton" style={{ height: 90 }} />
        </div>
      </div>
      <div className="skeleton" style={{ height: 180 }} />
    </div>
  );

  if (error && !campaign) return (
    <div style={{ padding: "80px 0", textAlign: "center" }}>
      <p style={{ color: "#ef4444", marginBottom: 16, fontSize: 14 }}>{error}</p>
      <Link href="/admin/campaigns" className="btn-ghost">← Voltar para Campanhas</Link>
    </div>
  );

  const c = campaign!;

  return (
    <div>
      {/* ── Breadcrumb ──────────────────────────────────────────────────────── */}
      <Link
        href="/admin/campaigns"
        className="animate-fade-slide"
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          color: "var(--text-tertiary)", fontSize: 13, textDecoration: "none",
          marginBottom: 20, fontWeight: 600, transition: "color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-tertiary)")}
      >
        <ArrowLeft size={14} /> Campanhas
      </Link>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div
        className="animate-fade-slide"
        style={{
          display: "flex", alignItems: "flex-start",
          justifyContent: "space-between", marginBottom: 28, gap: 16, flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
            <h1 className="page-title" style={{ margin: 0 }}>{c.name}</h1>
            <CampaignStatusBadge status={c.status} />
          </div>
          <p className="page-subtitle">
            {c.platform === "META" ? "Meta Ads" : c.platform === "GOOGLE" ? "Google Ads" : "LinkedIn Ads"}
            {" · "}
            {c.objective === "AWARENESS" ? "Reconhecimento" : c.objective === "TRAFFIC" ? "Tráfego" : c.objective === "SALES" ? "Vendas" : "Leads"}
            {" · "}
            Criada em {new Date(c.createdAt).toLocaleDateString("pt-BR")}
          </p>
        </div>
        <button onClick={handleDelete} className="btn-danger">
          <Trash2 size={13} /> Arquivar
        </button>
      </div>

      {/* ── Timeline de Status ───────────────────────────────────────────────── */}
      <StatusTimeline current={c.status} />

      {/* ── Painel de Ação Contextual por Status ───────────────────────────────── */}
      {c.status === "DRAFT" && (
        <div className="animate-fade-slide" style={{
          background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.25)",
          borderRadius: 14, padding: "16px 20px", marginBottom: 24,
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Sparkles size={18} color="#8b5cf6" />
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                Campanha criada com sucesso!
              </p>
              <p style={{ fontSize: 12, color: "var(--text-tertiary)", margin: 0 }}>
                Use a IA para gerar estratégias ou pule direto para concluir a campanha.
              </p>
            </div>
          </div>
          <button
            onClick={async () => {
              const updated = await updateCampaign(id, { status: "COMPLETED" });
              setCampaign(updated);
            }}
            className="btn-ghost"
            style={{ fontSize: 13 }}
          >
            <CheckCircle size={14} /> Pular para Concluída
          </button>
        </div>
      )}

      {c.status === "GENERATING_ASSETS" && (
        <div className="animate-fade-slide" style={{ marginBottom: 24 }}>
          <div style={{
            background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.25)",
            borderRadius: 14, padding: "16px 20px", marginBottom: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Zap size={18} color="#3b82f6" />
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                  Estratégia aplicada! Próximo passo: Criativos
                </p>
                <p style={{ fontSize: 12, color: "var(--text-tertiary)", margin: 0 }}>
                  Gere imagens com IA ou adicione manualmente. Quando estiver pronto, marque como concluída.
                </p>
              </div>
            </div>

            <div style={{ 
              background: "var(--bg-surface)", 
              borderRadius: 10, 
              padding: 14,
              border: "1px solid var(--border)",
            }}>
              <label style={{ 
                fontSize: 12, 
                fontWeight: 600, 
                color: "var(--text-secondary)", 
                display: "block",
                marginBottom: 8,
              }}>
                <ImageIcon size={13} style={{ display: "inline", marginRight: 4 }} />
                Descreva a imagem que deseja gerar
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="Ex: Produto em fundo minimalista, iluminação profissional, alta qualidade..."
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--bg-surface-2)",
                    color: "var(--text-primary)",
                    fontSize: 13,
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerateImage()}
                />
                <button
                  onClick={handleGenerateImage}
                  disabled={generatingImage || !imagePrompt.trim()}
                  className="btn-primary"
                  style={{ 
                    whiteSpace: "nowrap",
                    opacity: generatingImage || !imagePrompt.trim() ? 0.6 : 1,
                  }}
                >
                  {generatingImage ? (
                    <>
                      <div style={{ 
                        width: 14, 
                        height: 14, 
                        border: "2px solid #fff", 
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                      }} />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} /> Gerar com IA
                    </>
                  )}
                </button>
              </div>
              <p style={{ 
                fontSize: 11, 
                color: "var(--text-tertiary)", 
                margin: "6px 0 0",
                fontStyle: "italic",
              }}>
                💡 Dica: Seja específico sobre estilo, iluminação e composição para melhores resultados.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={async () => {
                const updated = await updateCampaign(id, { status: "COMPLETED" });
                setCampaign(updated);
              }}
              className="btn-ghost"
              style={{ fontSize: 13 }}
            >
              <CheckCircle size={14} /> Marcar como Concluída
            </button>
          </div>
        </div>
      )}

      {c.status === "COMPLETED" && (
        <div className="animate-fade-slide" style={{
          background: "linear-gradient(135deg, rgba(253,143,6,0.10), rgba(153,0,153,0.10))",
          border: "1px solid rgba(253,143,6,0.30)",
          borderRadius: 14, padding: "16px 20px", marginBottom: 24,
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Megaphone size={18} color="var(--primary)" />
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                Campanha concluída!
              </p>
              <p style={{ fontSize: 12, color: "var(--text-tertiary)", margin: 0 }}>
                Tudo revisado? Publique agora na plataforma escolhida.
              </p>
            </div>
          </div>
          <button
            onClick={async () => {
              const updated = await updateCampaign(id, { status: "PUBLISHED" });
              setCampaign(updated);
            }}
            className="btn-primary"
            style={{ background: "linear-gradient(135deg, #FD8F06, #990099)" }}
          >
            <Megaphone size={14} /> Publicar Campanha
          </button>
        </div>
      )}

      {c.status === "PUBLISHED" && (
        <div className="animate-fade-slide" style={{
          background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)",
          borderRadius: 14, padding: "14px 20px", marginBottom: 24,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <CheckCircle size={18} color="#16a34a" />
          <p style={{ fontSize: 14, fontWeight: 700, color: "#16a34a", margin: 0 }}>
            Campanha publicada e no ar! 🚀
          </p>
        </div>
      )}

      {/* ── Informações da Campanha (editáveis inline) ──────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <p style={{
          fontSize: 11, fontWeight: 700, color: "var(--text-tertiary)",
          letterSpacing: 1, textTransform: "uppercase", marginBottom: 14,
        }}>
          Dados da Campanha
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}
          className="stagger-children">
          <EditableField
            label="Descrição / Estratégia"
            value={c.description}
            placeholder="Clique em editar para adicionar uma descrição ou estratégia..."
            multiline
            icon={FileText}
            onSave={(v) => saveField("description", v)}
          />
          <EditableField
            label="Público-Alvo"
            value={c.targetAudience}
            placeholder="Descreva o público-alvo desta campanha..."
            multiline
            icon={Target}
            onSave={(v) => saveField("targetAudience", v)}
          />
          <EditableField
            label="Principais Benefícios"
            value={c.keyBenefits}
            placeholder="Liste os principais benefícios e diferenciais..."
            multiline
            icon={Zap}
            onSave={(v) => saveField("keyBenefits", v)}
          />
        </div>
      </div>

      {/* ── Seção: O Produto ─────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <p style={{
          fontSize: 11, fontWeight: 700, color: "var(--text-tertiary)",
          letterSpacing: 1, textTransform: "uppercase", marginBottom: 14,
        }}>
          O Produto
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}
          className="stagger-children">
          <EditableField
            label="Nome do Produto"
            value={c.productName}
            placeholder="Nome do produto principal..."
            icon={Package}
            onSave={(v) => saveField("productName", v)}
          />
          <EditableField
            label="Categoria"
            value={c.productCategory}
            placeholder="Ex: Calçados, Eletrônicos..."
            icon={Tag}
            onSave={(v) => saveField("productCategory", v)}
          />
          <EditableField
            label="Preço Original (R$)"
            value={c.productOriginalPrice?.toString()}
            placeholder="0,00"
            icon={DollarSign}
            onSave={(v) => saveField("productOriginalPrice", v ? parseFloat(v) : null)}
          />
          <EditableField
            label="Preço Oferta (R$)"
            value={c.productPrice?.toString()}
            placeholder="0,00"
            icon={Zap}
            onSave={(v) => saveField("productPrice", v ? parseFloat(v) : null)}
          />
          <EditableField
            label="URL da Loja / LP"
            value={c.productUrl}
            placeholder="https://sua-loja.com/produto"
            icon={LinkIcon}
            onSave={(v) => saveField("productUrl", v)}
          />
          <EditableField
            label="Diferencial (USP)"
            value={c.productUsp}
            placeholder="O que torna este produto único?"
            multiline
            icon={Sparkles}
            onSave={(v) => saveField("productUsp", v)}
          />
        </div>
      </div>

      {/* ── Seção: Oferta & Orçamento ────────────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <p style={{
          fontSize: 11, fontWeight: 700, color: "var(--text-tertiary)",
          letterSpacing: 1, textTransform: "uppercase", marginBottom: 14,
        }}>
          Oferta & Orçamento
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}
          className="stagger-children">
          <EditableField
            label="Tipo de Oferta"
            value={c.offerType}
            placeholder="Ex: DISCOUNT, FREE_SHIPPING..."
            icon={Tag}
            onSave={(v) => saveField("offerType", v)}
          />
          <EditableField
            label="Prazo (Deadline)"
            value={c.offerDeadline}
            placeholder="YYYY-MM-DD"
            icon={Calendar}
            onSave={(v) => saveField("offerDeadline", v)}
          />
          <EditableField
            label="CTA (Chamada)"
            value={c.ctaText}
            placeholder="Ex: Compre Agora, Saiba Mais..."
            icon={Megaphone}
            onSave={(v) => saveField("ctaText", v)}
          />
          <EditableField
            label="Orçamento Diário (R$)"
            value={c.budgetDaily?.toString()}
            placeholder="50,00"
            icon={DollarSign}
            onSave={(v) => saveField("budgetDaily", v ? parseFloat(v) : null)}
          />
        </div>
      </div>

      {/* ── Seção de IA ─────────────────────────────────────────────────────── */}
      <div
        className="animate-fade-slide"
        style={{
          borderRadius: 20, overflow: "hidden", position: "relative",
          background: "linear-gradient(135deg, #2a0050 0%, #5a0070 40%, #8b0080 70%, #b33000 100%)",
          boxShadow: "0 16px 48px rgba(153,0,153,0.30)",
          marginBottom: 28,
        }}
      >
        {/* Orbs decorativos */}
        <div style={{
          position: "absolute", top: -80, right: -80, width: 280, height: 280,
          borderRadius: "50%", background: "rgba(253,143,6,0.18)", filter: "blur(60px)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -60, left: -60, width: 200, height: 200,
          borderRadius: "50%", background: "rgba(255,255,255,0.06)", filter: "blur(40px)",
          pointerEvents: "none",
        }} />

        <div style={{ padding: 28, position: "relative" }}>
          {/* Header da seção IA */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "rgba(253,143,6,0.25)", display: "grid", placeItems: "center",
              }}>
                <Sparkles size={18} color="#FD8F06" />
              </div>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: "#fff", margin: 0 }}>
                  Estratégia com IA
                </h2>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", margin: 0 }}>
                  Powered by TRAX AI
                </p>
              </div>
            </div>

            {strategies.length > 0 && (
              <button
                onClick={handleRegenerateBrainstorm}
                style={{
                  background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 8, padding: "7px 12px", cursor: "pointer",
                  color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: 600,
                  display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.16)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.10)")}
              >
                <RotateCcw size={12} /> Gerar novamente
              </button>
            )}
          </div>

          <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>
            A IA analisa o público-alvo, benefícios e tom de voz para criar estratégias personalizadas para a sua campanha.
          </p>

          {error && (
            <div style={{
              background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#ffcdd2", marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          {/* Estado: sem estratégias geradas */}
          {strategies.length === 0 && c.status !== "GENERATING_ASSETS" && c.status !== "COMPLETED" && c.status !== "PUBLISHED" && (
            <button
              onClick={handleBrainstorm}
              disabled={brainstorming}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "12px 24px", borderRadius: 12, border: "none",
                background: brainstorming
                  ? "rgba(255,255,255,0.12)"
                  : "linear-gradient(135deg, #FD8F06, #cc4400)",
                color: "#fff", fontWeight: 700, fontSize: 14,
                cursor: brainstorming ? "not-allowed" : "pointer",
                transition: "all 0.2s", fontFamily: "inherit",
                boxShadow: brainstorming ? "none" : "0 4px 16px rgba(253,143,6,0.40)",
                opacity: brainstorming ? 0.8 : 1,
              }}
            >
              <Sparkles size={16} style={brainstorming ? { animation: "spin 1.5s linear infinite" } : undefined} />
              {brainstorming ? "Gerando estratégias com IA..." : "Gerar Estratégias com IA"}
            </button>
          )}

          {/* Estado: estratégias geradas → seletor */}
          {strategies.length > 0 && (
            <StrategySelector
              strategies={strategies}
              selectedIndex={selectedIdx}
              onSelect={handleSelectStrategy}
              saving={strategySaving}
            />
          )}

          {/* Estado: estratégia já selecionada anteriormente */}
          {strategies.length === 0 && (c.status === "GENERATING_ASSETS" || c.status === "COMPLETED" || c.status === "PUBLISHED") && (
            <div style={{
              background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)",
              borderRadius: 12, padding: "14px 18px",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <CheckCircle size={18} color="#22c55e" />
              <div>
                <p style={{ color: "#22c55e", fontWeight: 700, fontSize: 14, margin: 0 }}>
                  Estratégia aplicada com sucesso!
                </p>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, margin: 0 }}>
                  Você pode gerar novas opções usando o botão abaixo.
                </p>
              </div>
            </div>
          )}

          {/* Botão de re-brainstorm quando estratégia já aplicada */}
          {strategies.length === 0 && (c.status === "GENERATING_ASSETS" || c.status === "COMPLETED" || c.status === "PUBLISHED") && (
            <button
              onClick={handleBrainstorm}
              disabled={brainstorming}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8, marginTop: 14,
                padding: "9px 18px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.20)",
                background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.80)",
                fontSize: 13, fontWeight: 600, cursor: brainstorming ? "not-allowed" : "pointer",
                transition: "background 0.2s", fontFamily: "inherit",
              }}
            >
              <RotateCcw size={13} /> Gerar novas opções de estratégia
            </button>
          )}
        </div>
      </div>

      {/* ── Criativos ────────────────────────────────────────────────────────── */}
      {c.adCreatives && c.adCreatives.length > 0 && (
        <div className="animate-fade-slide">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <ImageIcon size={17} color="var(--primary)" />
            <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
              Criativos Gerados
            </h2>
            <span style={{
              background: "var(--primary-light)", color: "var(--primary)",
              borderRadius: 9999, padding: "2px 8px", fontSize: 11, fontWeight: 700,
            }}>
              {c.adCreatives.length}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {c.adCreatives.map((creative) => (
              <div
                key={creative.id}
                className="card card-lift"
                style={{
                  overflow: "hidden",
                  border: creative.isSelected
                    ? "2px solid var(--primary)"
                    : "1px solid var(--border)",
                }}
              >
                {/* Preview */}
                {creative.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={creative.imageUrl}
                    alt={creative.name}
                    style={{ width: "100%", height: 160, objectFit: "cover" }}
                  />
                ) : (
                  <div style={{
                    height: 160, background: "var(--bg-surface-2)",
                    display: "grid", placeItems: "center",
                  }}>
                    <ImageIcon size={28} color="var(--border-strong)" />
                  </div>
                )}

                {/* Info */}
                <div style={{ padding: 14 }}>
                  {creative.isSelected && (
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                      <CheckCircle size={12} color="#FD8F06" />
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#FD8F06" }}>
                        Selecionado
                      </span>
                    </div>
                  )}
                  <p style={{
                    fontWeight: 700, fontSize: 13, color: "var(--text-primary)",
                    marginBottom: 4, lineHeight: 1.3,
                  }}>
                    {creative.headline ?? creative.name}
                  </p>
                  {creative.primaryText && (
                    <p style={{
                      fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5,
                      display: "-webkit-box", WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                      {creative.primaryText}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
