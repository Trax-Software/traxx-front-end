/**
 * CreateCampaignModal
 * Modal wizard de 4 passos para criar uma nova campanha.
 * Passo 1: Básico (Nome, Objetivo, Plataforma)
 * Passo 2: Produto (Nome, Categoria, Preços, USP, URL)
 * Passo 3: Público & Oferta (Público, Tipo, Prazo, CTA)
 * Passo 4: Orçamento & IA (Orçamento, Tom, Benefícios)
 */

"use client";

import { Campaign, CampaignObjective, CreateCampaignDto, createCampaign } from "@/app/services/campaigns";
import {
  Calendar, ChevronRight, DollarSign, Facebook, Globe, Link as LinkIcon, 
  Linkedin, Megaphone, Package, ShoppingCart, Sparkles, Tag, Target, TrendingUp, X, Zap
} from "lucide-react";
import { useState } from "react";

// ── Opções ──────────────────────────────────────────────────────────────────────

const OBJECTIVES: { value: CampaignObjective; label: string; desc: string; icon: React.ElementType; color: string }[] = [
  { value: "AWARENESS", label: "Reconhecimento",  desc: "Ampliar o alcance da marca",       icon: Megaphone,     color: "#8b5cf6" },
  { value: "TRAFFIC",   label: "Tráfego",          desc: "Levar pessoas ao seu site",        icon: TrendingUp,    color: "#3b82f6" },
  { value: "SALES",     label: "Vendas",            desc: "Gerar conversões e receita",       icon: ShoppingCart,  color: "#16a34a" },
  { value: "LEADS",     label: "Leads",             desc: "Captar contatos qualificados",     icon: Target,        color: "#FD8F06" },
];

const PLATFORMS: { value: "META" | "GOOGLE" | "LINKEDIN"; label: string; desc: string; icon: React.ElementType; color: string }[] = [
  { value: "META",     label: "Meta Ads",     desc: "Facebook & Instagram",   icon: Facebook, color: "#1877F2" },
  { value: "GOOGLE",   label: "Google Ads",   desc: "Search, Display, YouTube", icon: Globe,   color: "#EA4335" },
  { value: "LINKEDIN", label: "LinkedIn Ads", desc: "B2B & Profissionais",    icon: Linkedin, color: "#0A66C2" },
];

const OFFER_TYPES = [
  { value: "DISCOUNT", label: "Desconto %" },
  { value: "FREE_SHIPPING", label: "Frete Grátis" },
  { value: "BONUS", label: "Bônus / Brinde" },
  { value: "GUARANTEE", label: "Garantia Estendida" },
  { value: "OTHER", label: "Outro" },
];

// ── Tipos ───────────────────────────────────────────────────────────────────────

type Props = {
  onClose: () => void;
  onCreated: (c: Campaign) => void;
};

const INITIAL_FORM: CreateCampaignDto = {
  name: "",
  objective: "SALES",
  platform: "META",
  productName: "",
  productCategory: "",
  productPrice: undefined,
  productOriginalPrice: undefined,
  productUrl: "",
  productUsp: "",
  targetAudience: "",
  offerType: "DISCOUNT",
  offerDeadline: "",
  ctaText: "Compre Agora",
  budgetDaily: undefined,
  brandTone: "",
  keyBenefits: "",
};

// ── Componente ──────────────────────────────────────────────────────────────────

export function CreateCampaignModal({ onClose, onCreated }: Props) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CreateCampaignDto>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof CreateCampaignDto>(key: K, val: CreateCampaignDto[K]) {
    setForm((f) => ({ ...f, [key]: val }));
    setError(null);
  }

  function validateStep(s: number) {
    if (s === 1) {
      if (!form.name.trim()) { setError("O nome da campanha é obrigatório."); return false; }
      if (form.name.trim().length < 3) { setError("O nome deve ter pelo menos 3 caracteres."); return false; }
    }
    if (s === 2) {
      // Opcional, mas avisar IA
    }
    return true;
  }

  function nextStep() {
    if (validateStep(step)) setStep(s => s + 1);
  }

  function prevStep() {
    setStep(s => s - 1);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      // Converte strings de preço para número se necessário (o input type="number" já faz isso parcialmente)
      const payload = { ...form };
      const created = await createCampaign(payload);
      onCreated(created);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Erro ao criar campanha. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="animate-fade"
      style={{
        position: "fixed", inset: 0, zIndex: 1000, padding: "24px 16px",
        background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="animate-scale"
        style={{
          background: "var(--bg-surface)", borderRadius: 20, padding: 32,
          width: "100%", maxWidth: 580,
          boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)",
          maxHeight: "90vh", overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: "linear-gradient(135deg, rgba(253,143,6,0.15), rgba(153,0,153,0.15))",
                display: "grid", placeItems: "center",
              }}>
                <Sparkles size={16} color="var(--primary)" />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)" }}>
                Nova Campanha
              </h2>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-tertiary)", paddingLeft: 44 }}>
              {step === 1 && "Defina o objetivo principal"}
              {step === 2 && "Diga-nos o que você está vendendo"}
              {step === 3 && "Público-alvo e Oferta irresistível"}
              {step === 4 && "Investimento e Tom de Voz"}
            </p>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: 8, width: 34, height: 34, borderRadius: 8, flexShrink: 0 }}>
            <X size={16} />
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            {["Básico", "Produto", "Oferta", "Finalizar"].map((label, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: step > i + 1 ? "var(--primary)" : step === i + 1 ? "var(--primary)" : "var(--bg-surface-2)",
                  border: `2px solid ${step === i + 1 || step > i + 1 ? "var(--primary)" : "var(--border)"}`,
                  display: "grid", placeItems: "center",
                  fontSize: 11, fontWeight: 700,
                  color: step > i + 1 || step === i + 1 ? "#fff" : "var(--text-tertiary)",
                  transition: "all 0.3s",
                }}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span style={{
                  fontSize: 12, fontWeight: 600,
                  color: step === i + 1 ? "var(--primary)" : "var(--text-tertiary)",
                  transition: "color 0.3s",
                }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div style={{ height: 3, background: "var(--bg-surface-2)", borderRadius: 9999 }}>
            <div style={{
              height: "100%", width: `${(step / 4) * 100}%`,
              background: "linear-gradient(90deg, var(--primary), var(--secondary))",
              borderRadius: 9999, transition: "width 0.4s ease",
            }} />
          </div>
        </div>

        {/* Erro global */}
        {error && (
          <div style={{
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)",
            color: "#ef4444", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 20,
          }}>
            {error}
          </div>
        )}

        {/* ── PASSO 1: BÁSICO ─────────────────────────────────────────────────────────── */}
        {step === 1 && (
          <div style={{ display: "grid", gap: 20 }}>
            <div>
              <label className="field-label">Nome da Campanha *</label>
              <input
                className="field-input"
                placeholder="Ex: Lançamento Coleção Outono 2026"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                autoFocus
              />
            </div>

            <div>
              <label className="field-label">Objetivo da Campanha *</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {OBJECTIVES.map(({ value, label, desc, icon: Icon, color }) => {
                  const sel = form.objective === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => update("objective", value)}
                      style={{
                        padding: 14, borderRadius: 12, textAlign: "left",
                        border: `2px solid ${sel ? color : "var(--border)"}`,
                        background: sel ? `${color}12` : "transparent",
                        cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <Icon size={14} color={sel ? color : "var(--text-tertiary)"} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: sel ? color : "var(--text-primary)" }}>
                          {label}
                        </span>
                      </div>
                      <p style={{ fontSize: 11, color: "var(--text-tertiary)", margin: 0 }}>{desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="field-label">Plataforma *</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {PLATFORMS.map(({ value, label, icon: Icon, color }) => {
                  const sel = form.platform === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => update("platform", value)}
                      style={{
                        padding: "12px 10px", borderRadius: 12, textAlign: "center",
                        border: `2px solid ${sel ? color : "var(--border)"}`,
                        background: sel ? `${color}12` : "transparent",
                        cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
                      }}
                    >
                      <Icon size={20} color={sel ? color : "var(--text-tertiary)"} style={{ display: "block", margin: "0 auto 6px" }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: sel ? color : "var(--text-primary)", display: "block" }}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button type="button" onClick={onClose} className="btn-ghost" style={{ flex: 1 }}>Sair</button>
              <button type="button" onClick={nextStep} className="btn-primary" style={{ flex: 2 }}>
                Próximo <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* ── PASSO 2: PRODUTO ────────────────────────────────────────────────────────── */}
        {step === 2 && (
          <div style={{ display: "grid", gap: 20 }}>
            <div>
              <label className="field-label">Nome do Produto</label>
              <div style={{ position: "relative" }}>
                <Package size={14} style={{ position: "absolute", left: 12, top: 12, color: "var(--text-tertiary)" }} />
                <input
                  className="field-input"
                  style={{ paddingLeft: 36 }}
                  placeholder="Ex: Smartwatch TRAX Pro"
                  value={form.productName}
                  onChange={(e) => update("productName", e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label className="field-label">Preço Original</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 12, top: 11, fontSize: 13, color: "var(--text-tertiary)" }}>R$</span>
                  <input
                    type="number"
                    className="field-input"
                    style={{ paddingLeft: 40 }}
                    placeholder="0,00"
                    value={form.productOriginalPrice || ""}
                    onChange={(e) => update("productOriginalPrice", parseFloat(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <label className="field-label">Preço c/ Desconto</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 12, top: 11, fontSize: 13, color: "var(--text-tertiary)" }}>R$</span>
                  <input
                    type="number"
                    className="field-input"
                    style={{ paddingLeft: 40 }}
                    placeholder="0,00"
                    value={form.productPrice || ""}
                    onChange={(e) => update("productPrice", parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="field-label">Diferencial Único (USP)</label>
              <textarea
                className="field-input"
                style={{ minHeight: 60 }}
                placeholder="O que torna este produto único? Ex: Resistente à água até 50m, 15 dias de bateria..."
                value={form.productUsp}
                onChange={(e) => update("productUsp", e.target.value)}
              />
            </div>

            <div>
              <label className="field-label">URL do Produto / Landing Page</label>
              <div style={{ position: "relative" }}>
                <LinkIcon size={14} style={{ position: "absolute", left: 12, top: 12, color: "var(--text-tertiary)" }} />
                <input
                  className="field-input"
                  style={{ paddingLeft: 36 }}
                  placeholder="https://sualoja.com/produto"
                  value={form.productUrl}
                  onChange={(e) => update("productUrl", e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button type="button" onClick={prevStep} className="btn-ghost" style={{ flex: 1 }}>Voltar</button>
              <button type="button" onClick={nextStep} className="btn-primary" style={{ flex: 2 }}>
                Público & Oferta <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* ── PASSO 3: PÚBLICO & OFERTA ───────────────────────────────────────────────── */}
        {step === 3 && (
          <div style={{ display: "grid", gap: 20 }}>
            <div>
              <label className="field-label">Público-Alvo</label>
              <textarea
                className="field-input"
                style={{ minHeight: 60 }}
                placeholder="Ex: Jovens de 18-35 anos interessados em tecnologia e lifestyle saudável"
                value={form.targetAudience}
                onChange={(e) => update("targetAudience", e.target.value)}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label className="field-label">Tipo de Oferta</label>
                <select 
                  className="field-input" 
                  value={form.offerType} 
                  onChange={(e) => update("offerType", e.target.value)}
                >
                  {OFFER_TYPES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Prazo da Oferta</label>
                <div style={{ position: "relative" }}>
                  <Calendar size={14} style={{ position: "absolute", left: 12, top: 12, color: "var(--text-tertiary)" }} />
                  <input
                    type="date"
                    className="field-input"
                    style={{ paddingLeft: 36 }}
                    value={form.offerDeadline}
                    onChange={(e) => update("offerDeadline", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="field-label">Call to Action (Botão)</label>
              <div style={{ position: "relative" }}>
                <Tag size={14} style={{ position: "absolute", left: 12, top: 12, color: "var(--text-tertiary)" }} />
                <input
                  className="field-input"
                  style={{ paddingLeft: 36 }}
                  placeholder="Ex: Garanta o Seu, Quero Aproveitar, Compre Agora"
                  value={form.ctaText}
                  onChange={(e) => update("ctaText", e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button type="button" onClick={prevStep} className="btn-ghost" style={{ flex: 1 }}>Voltar</button>
              <button type="button" onClick={nextStep} className="btn-primary" style={{ flex: 2 }}>
                Finalizar Estratégia <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* ── PASSO 4: FINALIZAR ─────────────────────────────────────────────────────── */}
        {step === 4 && (
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label className="field-label">Orçamento Diário</label>
                <div style={{ position: "relative" }}>
                  <DollarSign size={14} style={{ position: "absolute", left: 12, top: 12, color: "var(--text-tertiary)" }} />
                  <input
                    type="number"
                    className="field-input"
                    style={{ paddingLeft: 36 }}
                    placeholder="50,00"
                    value={form.budgetDaily || ""}
                    onChange={(e) => update("budgetDaily", parseFloat(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <label className="field-label">Tom de Voz</label>
                <input
                  className="field-input"
                  placeholder="Ex: Motivador, Direto..."
                  value={form.brandTone}
                  onChange={(e) => update("brandTone", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="field-label">Principais Benefícios (IA usará no texto)</label>
              <textarea
                className="field-input"
                style={{ minHeight: 80 }}
                placeholder="Descreva 3-5 benefícios em tópicos..."
                value={form.keyBenefits}
                onChange={(e) => update("keyBenefits", e.target.value)}
              />
            </div>

            <div style={{
              background: "rgba(139,92,246,0.05)", padding: 16, borderRadius: 12,
              border: "1px dashed rgba(139,92,246,0.2)", display: "flex", gap: 12
            }}>
              <Zap size={20} color="#8b5cf6" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                Tudo pronto! Nossa IA usará todos os detalhes acima para estruturar sua estratégia de vendas e sugerir os melhores criativos.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button type="button" onClick={prevStep} className="btn-ghost" style={{ flex: 1 }}>Voltar</button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ flex: 2, background: "linear-gradient(135deg, #FD8F06, #990099)" }}
              >
                {loading ? "Criando..." : <><Sparkles size={16} /> Criar Campanha</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
