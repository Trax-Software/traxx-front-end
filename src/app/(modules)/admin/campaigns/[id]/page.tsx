"use client";

import {
  Campaign,
  StrategyOption,
  brainstormStrategy,
  deleteCampaign,
  getCampaign,
  updateCampaign,
} from "@/app/services/campaigns";
import { generateCampaignImage } from "@/app/services/ai";
import { normalizeApiError } from "@/app/services/api";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  ArrowLeft,
  CheckCircle,
  Image as ImageIcon,
  Megaphone,
  RotateCcw,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import { CampaignStatusBadge, STATUS_META } from "../components/CampaignStatusBadge";
import { StrategySelector } from "../components/StrategySelector";

const STATUS_FLOW: Campaign["status"][] = [
  "DRAFT",
  "GENERATING_STRATEGY",
  "WAITING_APPROVAL",
  "GENERATING_ASSETS",
  "COMPLETED",
  "PUBLISHED",
];

function formatPlatform(platform: Campaign["platform"]) {
  switch (platform) {
    case "META":
      return "Meta Ads";
    case "GOOGLE":
      return "Google Ads";
    case "LINKEDIN":
      return "LinkedIn";
    default:
      return platform;
  }
}

function formatObjective(objective: Campaign["objective"]) {
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

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("pt-BR");
}

function toNumber(value?: number | string | null) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const normalized = value.replace(",", ".").trim();
    if (!normalized) return null;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function formatCurrency(value?: number | string | null) {
  const parsedValue = toNumber(value);
  if (parsedValue === null) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(parsedValue);
}

function formatDateOrText(value?: string | null) {
  if (!value) return "—";
  const parsed = value.trim();
  if (!parsed) return "—";
  const date = new Date(parsed);
  if (Number.isNaN(date.getTime())) return parsed;
  return date.toLocaleDateString("pt-BR");
}

function displayText(value?: string | number | null) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") return String(value);
  const parsed = value.trim();
  return parsed.length ? parsed : "—";
}

function StatusTimeline({ current }: { current: Campaign["status"] }) {
  const currentIdx = STATUS_FLOW.indexOf(current);

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] p-4 shadow-[var(--shadow-sm)]">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
        Progresso
      </p>
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {STATUS_FLOW.map((status, index) => {
          const meta = STATUS_META[status];
          const Icon = meta.icon;
          const isDone = index < currentIdx;
          const isCurrent = index === currentIdx;

          return (
            <div key={status} className="flex flex-shrink-0 items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div
                  className="grid h-8 w-8 place-items-center rounded-full border"
                  style={{
                    background: isDone
                      ? "var(--brand-gradient)"
                      : isCurrent
                        ? "var(--orange-light)"
                        : "var(--bg-body)",
                    borderColor: isCurrent || isDone ? "var(--brand-orange)" : "var(--border)",
                  }}
                >
                  {isDone ? (
                    <CheckCircle size={14} className="text-white" />
                  ) : (
                    <Icon
                      size={13}
                      color={isCurrent ? "var(--brand-orange)" : "var(--text-secondary)"}
                    />
                  )}
                </div>
                <span className="max-w-[78px] text-center text-xs font-semibold text-[var(--text-secondary)]">
                  {meta.label}
                </span>
              </div>
              {index < STATUS_FLOW.length - 1 ? (
                <div
                  className="h-[2px] w-7"
                  style={{ background: index < currentIdx ? "var(--brand-gradient)" : "var(--border)" }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

type DefinitionItem = {
  label: string;
  value: ReactNode;
};

function DefinitionSectionCard({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle?: string;
  items: DefinitionItem[];
}) {
  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-sm)]">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-main)]">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">{subtitle}</p> : null}
        </div>
        <button
          type="button"
          disabled
          title="Em breve"
          className="inline-flex h-9 items-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-body)] px-3 text-sm font-semibold text-[var(--text-secondary)] opacity-70"
        >
          Editar (Em breve)
        </button>
      </div>

      <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-body)] px-3 py-2"
          >
            <dt className="text-sm font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)]">
              {item.label}
            </dt>
            <dd className="mt-1 whitespace-pre-wrap text-base font-semibold leading-relaxed text-[var(--text-main)]">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

type NextStepConfig = {
  description: string;
  actionLabel?: string;
  action?: () => Promise<void> | void;
  disabled?: boolean;
};

function NextStepCard({
  config,
}: {
  config: NextStepConfig;
}) {
  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--brand-orange)] bg-[var(--orange-light)] p-6 shadow-[var(--shadow-sm)]">
      <div className="mb-2 flex items-center gap-2">
        <Zap size={16} className="text-[var(--brand-orange)]" />
        <h2 className="text-lg font-bold text-[var(--text-main)]">Próximo passo</h2>
      </div>
      <p className="text-base leading-relaxed text-[var(--text-main)]">{config.description}</p>

      {config.action && config.actionLabel ? (
        <button
          type="button"
          onClick={() => void config.action?.()}
          disabled={config.disabled}
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-[var(--radius-md)] px-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          style={{ background: "var(--brand-gradient)" }}
        >
          <Sparkles size={14} />
          {config.actionLabel}
        </button>
      ) : null}
    </section>
  );
}

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [brainstorming, setBrainstorming] = useState(false);
  const [strategies, setStrategies] = useState<StrategyOption[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [strategySaving, setStrategySaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [isImagePolling, setIsImagePolling] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const imagePollingIntervalRef = useRef<number | null>(null);
  const imagePollingTimeoutRef = useRef<number | null>(null);

  function stopImagePolling() {
    if (imagePollingIntervalRef.current !== null) {
      window.clearInterval(imagePollingIntervalRef.current);
      imagePollingIntervalRef.current = null;
    }
    if (imagePollingTimeoutRef.current !== null) {
      window.clearTimeout(imagePollingTimeoutRef.current);
      imagePollingTimeoutRef.current = null;
    }
    setIsImagePolling(false);
  }

  async function pollCampaignForGeneratedImage(params: {
    baselineImageCreativeIds: Set<string>;
    baselineImageCount: number;
  }) {
    try {
      const latest = await getCampaign(id);
      setCampaign(latest);

      const imageCreatives = (latest.adCreatives ?? []).filter((creative) => Boolean(creative.imageUrl));
      const hasNewImageCreative =
        imageCreatives.length > params.baselineImageCount ||
        imageCreatives.some((creative) => !params.baselineImageCreativeIds.has(creative.id));
      const reachedFinalStatus = latest.status === "COMPLETED" || latest.status === "PUBLISHED";

      if (hasNewImageCreative || reachedFinalStatus) {
        stopImagePolling();
      }
    } catch (err) {
      const parsedError = normalizeApiError(err);
      setError(parsedError.message || "Erro ao atualizar os criativos.");
      stopImagePolling();
    }
  }

  function startImagePolling(params: {
    baselineImageCreativeIds: Set<string>;
    baselineImageCount: number;
  }) {
    stopImagePolling();
    setIsImagePolling(true);

    imagePollingIntervalRef.current = window.setInterval(() => {
      void pollCampaignForGeneratedImage(params);
    }, 4000);

    imagePollingTimeoutRef.current = window.setTimeout(() => {
      setError("A geração da imagem está demorando mais que o esperado. Atualize em instantes.");
      stopImagePolling();
    }, 90_000);
  }

  useEffect(() => {
    getCampaign(id)
      .then(setCampaign)
      .catch(() => setError("Campanha não encontrada."))
      .finally(() => setLoading(false));

    return () => {
      stopImagePolling();
    };
  }, [id]);

  async function handleBrainstorm() {
    if (!campaign) return;
    setBrainstorming(true);
    setError(null);
    try {
      const options = await brainstormStrategy(id);
      setStrategies(options);
      setCampaign((prev) => (prev ? { ...prev, status: "WAITING_APPROVAL" } : prev));
    } catch {
      setError("Erro ao gerar estratégia. Verifique sua conexão e tente novamente.");
    } finally {
      setBrainstorming(false);
    }
  }

  async function handleSelectStrategy(index: number) {
    if (!campaign) return;
    setSelectedIdx(index);
    const chosen = strategies[index];
    setStrategySaving(true);
    try {
      const updated = await updateCampaign(id, {
        description: chosen.description,
        targetAudience: chosen.targetAudience,
        status: "GENERATING_ASSETS",
      });
      setCampaign(updated);
      setStrategies([]);
    } finally {
      setStrategySaving(false);
    }
  }

  function handleRegenerateBrainstorm() {
    setStrategies([]);
    setSelectedIdx(null);
    setError(null);
  }

  async function handleGenerateImage() {
    if (!campaign || !imagePrompt.trim()) {
      setError("Digite uma descrição para a imagem.");
      return;
    }

    setGeneratingImage(true);
    setError(null);

    try {
      const baselineImageCreativeIds = new Set(
        (campaign.adCreatives ?? [])
          .filter((creative) => Boolean(creative.imageUrl))
          .map((creative) => creative.id)
      );
      const baselineImageCount = baselineImageCreativeIds.size;

      const result = await generateCampaignImage({
        prompt: imagePrompt,
        campaignId: id,
      });

      setImagePrompt("");
      setError(null);

      if (result.status === "queued") {
        startImagePolling({ baselineImageCreativeIds, baselineImageCount });
      } else {
        const latest = await getCampaign(id);
        setCampaign(latest);
      }
    } catch (err) {
      const parsedError = normalizeApiError(err);
      setError(parsedError.message || "Erro ao gerar imagem. Verifique seus créditos.");
    } finally {
      setGeneratingImage(false);
    }
  }

  async function handleMarkCompleted() {
    const updated = await updateCampaign(id, { status: "COMPLETED" });
    setCampaign(updated);
  }

  async function handlePublish() {
    const updated = await updateCampaign(id, { status: "PUBLISHED" });
    setCampaign(updated);
  }

  async function handleDelete() {
    setArchiveDialogOpen(false);
    setArchiving(true);
    try {
      await deleteCampaign(id);
      router.push("/admin");
    } catch (err) {
      const parsedError = normalizeApiError(err);
      setError(parsedError.message || "Erro ao arquivar campanha.");
    } finally {
      setArchiving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-5 w-40" />
        <div className="skeleton h-24 w-full" />
        <div className="skeleton h-56 w-full" />
      </div>
    );
  }

  if (error && !campaign) {
    return (
      <div className="py-16 text-center">
        <p className="mb-4 text-sm text-[var(--danger-text)]">{error}</p>
        <Link href="/admin" className="btn-ghost">
          ← Voltar para Campanhas
        </Link>
      </div>
    );
  }

  const c = campaign!;

  const nextStepConfig: NextStepConfig = (() => {
    switch (c.status) {
      case "DRAFT":
      case "GENERATING_STRATEGY":
        return {
          description: "Gere estratégias com IA para avançar para a fase de aprovação.",
          actionLabel: brainstorming ? "Gerando estratégias..." : "Gerar Estratégias com IA",
          action: handleBrainstorm,
          disabled: brainstorming,
        };
      case "WAITING_APPROVAL":
        if (strategies.length > 0) {
          return {
            description: "Revise as estratégias geradas abaixo e selecione a melhor opção.",
          };
        }
        return {
          description: "Nenhuma estratégia carregada no momento. Gere novamente para revisar opções.",
          actionLabel: brainstorming ? "Gerando estratégias..." : "Gerar Estratégias com IA",
          action: handleBrainstorm,
          disabled: brainstorming,
        };
      case "GENERATING_ASSETS":
        return {
          description: "Aguarde a geração dos assets ou finalize manualmente quando estiver tudo pronto.",
          actionLabel: "Marcar como Concluída",
          action: handleMarkCompleted,
        };
      case "COMPLETED":
        return {
          description: "Campanha concluída. Publique para colocar no ar.",
          actionLabel: "Publicar Campanha",
          action: handlePublish,
        };
      case "PUBLISHED":
        return {
          description: "Campanha publicada com sucesso. Agora acompanhe desempenho e ajuste criativos.",
        };
      default:
        return {
          description: "Siga para a próxima etapa da campanha.",
        };
    }
  })();

  const strategyItems: DefinitionItem[] = [
    { label: "Descrição", value: displayText(c.description) },
    { label: "Público-alvo", value: displayText(c.targetAudience) },
    { label: "Benefícios", value: displayText(c.keyBenefits) },
    { label: "Tom da Marca", value: displayText(c.brandTone) },
    { label: "Plataforma", value: formatPlatform(c.platform) },
    { label: "Objetivo", value: formatObjective(c.objective) },
  ];

  const productItems: DefinitionItem[] = [
    { label: "Nome do Produto", value: displayText(c.productName) },
    { label: "Categoria", value: displayText(c.productCategory) },
    { label: "Preço de Oferta", value: formatCurrency(c.productPrice) },
    { label: "Preço Original", value: formatCurrency(c.productOriginalPrice) },
    { label: "URL", value: displayText(c.productUrl) },
    { label: "Diferencial (USP)", value: displayText(c.productUsp) },
  ];

  const offerItems: DefinitionItem[] = [
    { label: "Tipo de Oferta", value: displayText(c.offerType) },
    { label: "Prazo", value: formatDateOrText(c.offerDeadline) },
    { label: "CTA", value: displayText(c.ctaText) },
    { label: "Orçamento Diário", value: formatCurrency(c.budgetDaily) },
    { label: "Orçamento Total", value: formatCurrency(c.budgetTotal) },
    { label: "Criada em", value: formatDate(c.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)] transition hover:text-[var(--text-main)]">
        <ArrowLeft size={14} /> Campanhas
      </Link>

      <header className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-sm)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold leading-tight text-[var(--text-main)]">{c.name}</h1>
              <CampaignStatusBadge status={c.status} />
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--text-secondary)] sm:text-base">
              <span>{formatPlatform(c.platform)}</span>
              <span>•</span>
              <span>{formatObjective(c.objective)}</span>
              <span>•</span>
              <span>Criada em {formatDate(c.createdAt)}</span>
            </div>
          </div>

          <button
            onClick={() => setArchiveDialogOpen(true)}
            disabled={archiving}
            className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-body)] px-4 text-sm font-semibold text-[var(--text-main)] transition hover:border-[var(--danger-text)] hover:text-[var(--danger-text)]"
          >
            <Trash2 size={14} /> Arquivar
          </button>
        </div>
      </header>

      <StatusTimeline current={c.status} />

      <NextStepCard config={nextStepConfig} />

      <div
        className="rounded-[var(--radius-lg)] border border-[var(--border)] p-5 shadow-[var(--shadow-sm)]"
        style={{
          background: "var(--brand-gradient)",
        }}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-[10px] bg-white/15">
              <Sparkles size={17} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Estratégia com IA</h2>
              <p className="text-sm leading-relaxed text-white/80">Análise e recomendação de estratégia</p>
            </div>
          </div>

          {strategies.length > 0 ? (
            <button
              onClick={handleRegenerateBrainstorm}
              className="inline-flex items-center gap-2 rounded-[8px] border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white/90 transition hover:bg-white/15"
            >
              <RotateCcw size={12} /> Gerar novamente
            </button>
          ) : null}
        </div>

        {error ? (
          <div className="mb-4 rounded-[10px] border border-white/20 bg-white/10 px-3 py-2 text-sm text-white">
            {error}
          </div>
        ) : null}

        {strategies.length === 0 && c.status !== "GENERATING_ASSETS" && c.status !== "COMPLETED" && c.status !== "PUBLISHED" ? (
          <button
            onClick={handleBrainstorm}
            disabled={brainstorming}
            className="inline-flex items-center gap-2 rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition disabled:cursor-not-allowed disabled:opacity-60"
            style={{ background: "var(--brand-gradient)" }}
          >
            <Sparkles size={14} />
            {brainstorming ? "Gerando estratégias com IA..." : "Gerar Estratégias com IA"}
          </button>
        ) : null}

        {strategies.length > 0 ? (
          <div className="mt-3">
            <StrategySelector
              strategies={strategies}
              selectedIndex={selectedIdx}
              onSelect={handleSelectStrategy}
              saving={strategySaving}
            />
          </div>
        ) : null}

        {strategies.length === 0 && (c.status === "GENERATING_ASSETS" || c.status === "COMPLETED" || c.status === "PUBLISHED") ? (
          <div className="mt-2 rounded-[var(--radius-md)] border border-white/20 bg-white/10 px-4 py-3 text-sm leading-relaxed text-white/90">
            Estratégia aplicada com sucesso. Você pode gerar novas opções se quiser comparar alternativas.
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DefinitionSectionCard
          title="Estratégia"
          subtitle="Resumo dos dados estratégicos da campanha."
          items={strategyItems}
        />
        <DefinitionSectionCard
          title="Produto"
          subtitle="Informações do produto e oferta principal."
          items={productItems}
        />
      </div>

      <DefinitionSectionCard
        title="Oferta e Orçamento"
        subtitle="Condições comerciais e investimento planejado."
        items={offerItems}
      />

      <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-sm)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2">
            <ImageIcon size={16} className="text-[var(--brand-orange)]" />
            <h2 className="text-lg font-bold text-[var(--text-main)]">Assets e Criativos</h2>
            <span className="rounded-full border border-[var(--border)] bg-[var(--bg-body)] px-2 py-0.5 text-sm font-semibold text-[var(--text-secondary)]">
              {c.adCreatives?.length ?? 0}
            </span>
          </div>
        </div>

        {c.status === "GENERATING_ASSETS" ? (
          <div className="mb-5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-body)] p-4">
            <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)]">
              Descreva a imagem que deseja gerar
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Ex: Produto em fundo minimalista, iluminação profissional..."
                className="h-10 flex-1 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] px-3 text-sm text-[var(--text-main)] outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleGenerateImage()}
              />
              <button
                onClick={handleGenerateImage}
                disabled={generatingImage || isImagePolling || !imagePrompt.trim()}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-[var(--radius-md)] px-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: "var(--brand-gradient)" }}
              >
                <Sparkles size={14} />
                {generatingImage ? "Gerando..." : isImagePolling ? "Processando..." : "Gerar com IA"}
              </button>
            </div>
            {isImagePolling ? (
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                Gerando imagem... vamos atualizar automaticamente quando o criativo ficar pronto.
              </p>
            ) : null}
          </div>
        ) : (
          <p className="mb-4 text-sm leading-relaxed text-[var(--text-secondary)]">
            A geração de imagem fica disponível quando a campanha estiver em <strong>Gerando Assets</strong>.
          </p>
        )}

        {c.adCreatives && c.adCreatives.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {c.adCreatives.map((creative) => (
              <article
                key={creative.id}
                className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-body)]"
              >
                {creative.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={creative.imageUrl}
                    alt={creative.name}
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="grid h-44 place-items-center border-b border-[var(--border)] bg-[var(--bg-surface)]">
                    <ImageIcon size={24} className="text-[var(--text-secondary)]" />
                  </div>
                )}

                <div className="space-y-1 p-3">
                  {creative.isSelected ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--orange-light)] px-2 py-0.5 text-xs font-semibold text-[var(--brand-orange)]">
                      <CheckCircle size={11} /> Selecionado
                    </span>
                  ) : null}
                  <p className="text-base font-semibold text-[var(--text-main)]">
                    {creative.headline ?? creative.name}
                  </p>
                  {creative.primaryText ? (
                    <p className="line-clamp-3 text-sm leading-relaxed text-[var(--text-secondary)]">{creative.primaryText}</p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--border)] bg-[var(--bg-body)] px-4 py-8 text-center text-sm text-[var(--text-secondary)]">
            Ainda não há criativos para esta campanha.
          </div>
        )}
      </section>

      {c.status === "COMPLETED" ? (
        <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] p-4">
          <button
            onClick={handlePublish}
            className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-md)] px-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)]"
            style={{ background: "var(--brand-gradient)" }}
          >
            <Megaphone size={14} /> Publicar Campanha
          </button>
        </div>
      ) : null}

      <ConfirmDialog
        open={archiveDialogOpen}
        title="Confirmar ação"
        description="Tem certeza que deseja arquivar esta campanha?"
        confirmText={archiving ? "Arquivando..." : "Arquivar"}
        cancelText="Cancelar"
        tone="danger"
        onCancel={() => {
          if (!archiving) {
            setArchiveDialogOpen(false);
          }
        }}
        onConfirm={() => {
          if (!archiving) {
            void handleDelete();
          }
        }}
        confirmDisabled={archiving}
      />
    </div>
  );
}
