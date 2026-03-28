"use client";

import {
  Campaign,
  CopyGenerationFallback,
  CopyOption,
  StrategyOption,
  brainstormStrategy,
  deleteCampaign,
  generateCopyOptions,
  getCampaign,
  publishCampaignToMeta,
  updateCampaign,
} from "@/app/services/campaigns";
import { generateCampaignImage } from "@/app/services/ai";
import { normalizeApiError } from "@/app/services/api";
import { getMetaStatus, MetaIntegrationStatus } from "@/app/services/integrations";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FeedbackDialog } from "@/components/ui/FeedbackDialog";
import {
  ArrowLeft,
  CheckCircle,
  Image as ImageIcon,
  Megaphone,
  RotateCcw,
  Sparkles,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import { CampaignStatusBadge, STATUS_META } from "../components/CampaignStatusBadge";
import { CopyOptionsSelector } from "../components/CopyOptionsSelector";
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

function isStrategyApplied(campaign?: Campaign | null) {
  if (!campaign) return false;
  return Boolean(campaign.description?.trim()) && Boolean(campaign.targetAudience?.trim());
}

function toStrategyDescription(strategy: StrategyOption) {
  const title = strategy.title?.trim() ?? "";
  const reasoning = strategy.reasoning?.trim() ?? strategy.description?.trim() ?? "";

  if (title && reasoning) {
    return `${title}\n\n${reasoning}`;
  }

  return reasoning || title;
}

type SelectedCopyStorage = {
  headline: string;
  primaryText: string;
  cta: string;
  framework?: string;
};

function getCopySelectionStorageKey(campaignId: string) {
  return `trax_copy_selected_${campaignId}`;
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
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [publishingToMeta, setPublishingToMeta] = useState(false);
  const [metaStatus, setMetaStatus] = useState<MetaIntegrationStatus | null>(null);
  const [copyOptions, setCopyOptions] = useState<CopyOption[]>([]);
  const [copyLoading, setCopyLoading] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [copyFallback, setCopyFallback] = useState<CopyGenerationFallback | null>(null);
  const [selectedCopy, setSelectedCopy] = useState<SelectedCopyStorage | null>(null);
  const [selectedCopyIndex, setSelectedCopyIndex] = useState<number | null>(null);
  const [copySelectionHydrated, setCopySelectionHydrated] = useState(false);
  const [isChoosingCopy, setIsChoosingCopy] = useState(false);
  const [missingSections, setMissingSections] = useState({
    strategy: false,
    copy: false,
    assets: false,
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [feedbackDialog, setFeedbackDialog] = useState<{
    open: boolean;
    tone: "success" | "danger" | "info";
    title: string;
    description: string;
    autoCloseMs?: number;
  }>({
    open: false,
    tone: "info",
    title: "",
    description: "",
  });
  const [imagePrompt, setImagePrompt] = useState("");
  const imagePollingIntervalRef = useRef<number | null>(null);
  const imagePollingTimeoutRef = useRef<number | null>(null);
  const strategySectionRef = useRef<HTMLDivElement | null>(null);
  const strategySelectorRef = useRef<HTMLDivElement | null>(null);
  const copySectionRef = useRef<HTMLElement | null>(null);
  const copyOptionsListRef = useRef<HTMLDivElement | null>(null);
  const assetsSectionRef = useRef<HTMLElement | null>(null);

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

  useEffect(() => {
    getMetaStatus()
      .then(setMetaStatus)
      .catch(() =>
        setMetaStatus({
          connected: false,
          selectedAdAccountId: null,
          selectedPageId: null,
        })
      );
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storageKey = getCopySelectionStorageKey(id);
    const rawValue = window.localStorage.getItem(storageKey);

    if (!rawValue) {
      setSelectedCopy(null);
      setSelectedCopyIndex(null);
      setCopySelectionHydrated(true);
      return;
    }

    try {
      const parsed = JSON.parse(rawValue) as Partial<SelectedCopyStorage>;
      if (!parsed.headline || !parsed.primaryText || !parsed.cta) {
        window.localStorage.removeItem(storageKey);
        setSelectedCopy(null);
        setSelectedCopyIndex(null);
        setCopySelectionHydrated(true);
        return;
      }

      setSelectedCopy({
        headline: parsed.headline,
        primaryText: parsed.primaryText,
        cta: parsed.cta,
        framework: parsed.framework,
      });
      setCopySelectionHydrated(true);
    } catch {
      window.localStorage.removeItem(storageKey);
      setSelectedCopy(null);
      setSelectedCopyIndex(null);
      setCopySelectionHydrated(true);
    }
  }, [id]);

  useEffect(() => {
    if (!selectedCopy) {
      setSelectedCopyIndex(null);
      return;
    }

    const index = copyOptions.findIndex(
      (option) =>
        option.headline === selectedCopy.headline &&
        option.primaryText === selectedCopy.primaryText &&
        option.cta === selectedCopy.cta
    );

    setSelectedCopyIndex(index >= 0 ? index : null);
  }, [copyOptions, selectedCopy]);

  useEffect(() => {
    if (!missingSections.strategy && !missingSections.copy && !missingSections.assets) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setMissingSections({ strategy: false, copy: false, assets: false });
    }, 2500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [missingSections]);

  useEffect(() => {
    const strategyMet = isStrategyApplied(campaign);
    const copyMet = !strategyMet || Boolean(selectedCopy);
    const requiresAssets = campaign?.status === "GENERATING_ASSETS";
    const assetsMet =
      !requiresAssets ||
      (campaign?.adCreatives?.length ?? 0) > 0 ||
      (campaign?.adCreatives ?? []).some((creative) => Boolean(creative.imageUrl));

    setMissingSections((prev) => {
      const next = {
        strategy: prev.strategy && !strategyMet,
        copy: prev.copy && !copyMet,
        assets: prev.assets && !assetsMet,
      };

      if (
        next.strategy === prev.strategy &&
        next.copy === prev.copy &&
        next.assets === prev.assets
      ) {
        return prev;
      }

      return next;
    });
  }, [campaign, selectedCopy]);

  async function runBrainstormAndReveal() {
    if (!campaign) return;
    setBrainstorming(true);
    setError(null);
    try {
      const options = await brainstormStrategy(id);
      setStrategies(options);
      setSelectedIdx(null);
      setCampaign((prev) => (prev ? { ...prev, status: "WAITING_APPROVAL" } : prev));
      if (options.length > 0) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            handleScrollToStrategies();
          });
        });
      }
    } catch {
      setError("Erro ao gerar estratégia. Verifique sua conexão e tente novamente.");
    } finally {
      setBrainstorming(false);
    }
  }

  async function handleBrainstorm() {
    await runBrainstormAndReveal();
  }

  async function handleSelectStrategy(index: number) {
    if (!campaign) return;
    setSelectedIdx(index);
    const chosen = strategies[index];
    setStrategySaving(true);
    try {
      const updated = await updateCampaign(id, {
        description: toStrategyDescription(chosen),
        targetAudience: chosen.targetAudience,
        keyBenefits: chosen.keyBenefits,
        brandTone: chosen.brandTone,
      });
      setCampaign(updated);
      setStrategies([]);
    } finally {
      setStrategySaving(false);
    }
  }

  async function handleRegenerateBrainstorm() {
    await runBrainstormAndReveal();
  }

  function handleScrollToStrategies() {
    strategySelectorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleScrollToCopyOptions() {
    copyOptionsListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleStartChoosingCopy() {
    if (copyOptions.length === 0) return;
    setIsChoosingCopy(true);
    requestAnimationFrame(() => {
      handleScrollToCopyOptions();
    });
  }

  async function handleGenerateCopy() {
    setCopyLoading(true);
    setCopyError(null);
    setCopyFallback(null);

    try {
      const response = await generateCopyOptions(id);

      if (Array.isArray(response)) {
        setCopyOptions(response);
        if (response.length > 0) {
          setIsChoosingCopy(true);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              handleScrollToCopyOptions();
            });
          });
        }
      } else {
        setCopyOptions([]);
        setSelectedCopyIndex(null);
        setCopyFallback(response);
      }
    } catch (err) {
      const parsedError = normalizeApiError(err);
      if (parsedError.statusCode === 402) {
        setCopyError(parsedError.message || "Você não possui créditos suficientes para gerar copy.");
      } else {
        setCopyError(parsedError.message || "Erro ao gerar variações de copy com IA.");
      }
    } finally {
      setCopyLoading(false);
    }
  }

  function handleSelectCopyOption(index: number) {
    const option = copyOptions[index];
    if (!option) return;

    const selected: SelectedCopyStorage = {
      headline: option.headline,
      primaryText: option.primaryText,
      cta: option.cta,
      framework: option.framework,
    };

    setSelectedCopy(selected);
    setSelectedCopyIndex(index);
    setIsChoosingCopy(false);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(getCopySelectionStorageKey(id), JSON.stringify(selected));
    }
  }

  function handleClearSelectedCopy() {
    setSelectedCopy(null);
    setSelectedCopyIndex(null);

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(getCopySelectionStorageKey(id));
    }
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

  async function handlePublishToMeta() {
    setPublishDialogOpen(false);
    setPublishingToMeta(true);

    try {
      await publishCampaignToMeta(id);
      const latestCampaign = await getCampaign(id);
      setCampaign(latestCampaign);
      setFeedbackDialog({
        open: true,
        tone: "success",
        title: "Campanha publicada na Meta",
        description: "A campanha foi publicada com sucesso.",
        autoCloseMs: 1500,
      });
    } catch (err) {
      const parsedError = normalizeApiError(err);
      setFeedbackDialog({
        open: true,
        tone: "danger",
        title: "Não foi possível publicar na Meta",
        description: parsedError.message || "Tente novamente em instantes.",
      });
    } finally {
      setPublishingToMeta(false);
    }
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

  function scrollToSection(element: HTMLElement | null) {
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
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

  const strategyApplied = isStrategyApplied(c);
  const strategiesLoaded = strategies.length > 0;
  const strategyGenerationAvailable = true;
  const copySelected = Boolean(selectedCopy);
  const strategyRequiredMet = isStrategyApplied(c);
  const assetsRequiredMet =
    (c.adCreatives?.length ?? 0) > 0 || (c.adCreatives ?? []).some((creative) => Boolean(creative.imageUrl));
  const shouldShowCopyOptionsList = !selectedCopy || isChoosingCopy;
  const hasCreativeForPublish =
    (c.adCreatives?.length ?? 0) > 0 || (c.adCreatives ?? []).some((creative) => Boolean(creative.imageUrl));
  const publishRequirements: string[] = [];

  if (!metaStatus?.connected) {
    publishRequirements.push("Meta não conectada.");
  }
  if (metaStatus?.connected && (!metaStatus.selectedAdAccountId || !metaStatus.selectedPageId)) {
    publishRequirements.push("Conta e página da Meta não selecionadas.");
  }
  if (!hasCreativeForPublish) {
    publishRequirements.push("Adicione pelo menos 1 criativo antes de publicar.");
  }
  if (!copySelected) {
    publishRequirements.push("Selecione um copy antes de publicar.");
  }

  const canPublishToMeta = publishRequirements.length === 0;
  const saveButtonLabel =
    c.status === "GENERATING_ASSETS" || c.status === "COMPLETED" || c.status === "PUBLISHED"
      ? "Salvar campanha"
      : !strategyApplied
        ? "Salvar e continuar"
      : !copySelected
        ? "Salvar e avançar para Copy"
          : c.status === "WAITING_APPROVAL"
            ? "Salvar e avançar para Criativos"
            : "Salvar campanha";

  async function handleSave() {
    let hasCopySelection = copySelected;

    if (!hasCopySelection && typeof window !== "undefined") {
      hasCopySelection = Boolean(window.localStorage.getItem(getCopySelectionStorageKey(id)));
    }

    const copyRequired = strategyRequiredMet;
    const assetsRequired = c.status === "GENERATING_ASSETS";
    const nextMissing = {
      strategy: !strategyRequiredMet,
      copy: copyRequired && !hasCopySelection,
      assets: assetsRequired && !assetsRequiredMet,
    };

    if (nextMissing.strategy || nextMissing.copy || nextMissing.assets) {
      setMissingSections(nextMissing);

      requestAnimationFrame(() => {
        if (nextMissing.strategy) {
          scrollToSection(strategySectionRef.current);
          return;
        }
        if (nextMissing.copy) {
          scrollToSection(copySectionRef.current);
          return;
        }
        if (nextMissing.assets) {
          scrollToSection(assetsSectionRef.current);
        }
      });
      return;
    }

    try {
      setSaveLoading(true);
      setError(null);
      setMissingSections({ strategy: false, copy: false, assets: false });

      let latestCampaign = c;
      let feedbackMessage = "Suas alterações foram salvas.";

      if (strategyRequiredMet && (latestCampaign.status === "DRAFT" || latestCampaign.status === "GENERATING_STRATEGY")) {
        latestCampaign = await updateCampaign(id, { status: "WAITING_APPROVAL" });
        setCampaign(latestCampaign);
        feedbackMessage = "Suas alterações foram salvas.";
      }

      if (hasCopySelection && latestCampaign.status === "WAITING_APPROVAL") {
        latestCampaign = await updateCampaign(id, { status: "GENERATING_ASSETS" });
        setCampaign(latestCampaign);
        feedbackMessage = "Suas alterações foram salvas.";
      }

      setFeedbackDialog({
        open: true,
        tone: "success",
        title: "Campanha salva com sucesso",
        description: feedbackMessage,
        autoCloseMs: 1500,
      });
    } catch (err) {
      const parsedError = normalizeApiError(err);
      setFeedbackDialog({
        open: true,
        tone: "danger",
        title: "Não foi possível salvar",
        description: parsedError.message || "Tente novamente em instantes.",
      });
    } finally {
      setSaveLoading(false);
    }
  }

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

      <div
        ref={strategySectionRef}
        className={`rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-sm)] ${
          missingSections.strategy
            ? "border-2 border-[var(--danger-text)]"
            : "border border-[var(--border)]"
        }`}
        style={{
          background: "var(--brand-gradient)",
        }}
      >
        <div
          className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] p-4 text-[var(--text-main)] shadow-[var(--shadow-sm)] backdrop-blur-[2px] sm:p-5"
          style={{
            background: "color-mix(in srgb, var(--bg-surface) 86%, transparent)",
          }}
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-[10px] border border-[var(--border)] bg-[var(--bg-body)]">
                <Sparkles size={17} className="text-[var(--brand-orange)]" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[var(--text-main)]">Estratégia com IA</h2>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">Análise e recomendação de estratégia</p>
                {missingSections.strategy ? (
                  <p className="mt-1 text-sm font-semibold text-[var(--danger-text)]">
                    Selecione uma estratégia para continuar.
                  </p>
                ) : null}
              </div>
            </div>

            {(strategiesLoaded || strategyApplied) && strategyGenerationAvailable ? (
              <button
                onClick={() => {
                  void handleRegenerateBrainstorm();
                }}
                className="inline-flex items-center gap-2 rounded-[8px] border border-[var(--border)] bg-[var(--bg-body)] px-3 py-1.5 text-sm font-semibold text-[var(--text-main)] transition hover:border-[var(--brand-orange)]"
              >
                <RotateCcw size={12} /> Gerar novamente
              </button>
            ) : null}
          </div>

          {error ? (
            <div className="mb-4 rounded-[10px] border border-[var(--danger-text)] bg-[var(--danger-bg)] px-3 py-2 text-sm text-[var(--danger-text)]">
              {error}
            </div>
          ) : null}

          {!strategiesLoaded && !strategyApplied && strategyGenerationAvailable ? (
            <button
              onClick={() => {
                void handleBrainstorm();
              }}
              disabled={brainstorming}
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: "var(--brand-gradient)" }}
            >
              <Sparkles size={14} />
              {brainstorming ? "Gerando estratégias com IA..." : "Gerar Estratégias com IA"}
            </button>
          ) : null}

          {strategiesLoaded ? (
            <button
              type="button"
              onClick={handleScrollToStrategies}
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-body)] px-3 py-1.5 text-sm font-semibold text-[var(--text-main)] transition hover:border-[var(--brand-orange)]"
            >
              Ver estratégias geradas
            </button>
          ) : null}

          {strategiesLoaded ? (
            <div ref={strategySelectorRef} className="mt-3">
              <StrategySelector
                strategies={strategies}
                selectedIndex={selectedIdx}
                onSelect={handleSelectStrategy}
                saving={strategySaving}
              />
            </div>
          ) : null}

          {!strategiesLoaded && strategyApplied ? (
            <div className="mt-2 rounded-[var(--radius-md)] border border-[var(--success-text)] bg-[var(--success-bg)] px-4 py-3 text-sm leading-relaxed text-[var(--success-text)]">
              Estratégia aplicada com sucesso. Use “Gerar novamente” se quiser comparar alternativas.
            </div>
          ) : null}
        </div>
      </div>

      <section
        ref={copySectionRef}
        className={`rounded-[var(--radius-lg)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-sm)] ${
          missingSections.copy
            ? "border-2 border-[var(--danger-text)]"
            : "border border-[var(--border)]"
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--border)] pb-3">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-main)]">Copy do Anúncio</h2>
            <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
              Gere variações de texto e selecione a melhor opção.
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
              Copy é o texto do anúncio (headline + texto principal + CTA).
            </p>
            {missingSections.copy ? (
              <p className="mt-1 text-xs font-semibold text-[var(--danger-text)]">
                Selecione um texto do anúncio (headline + texto + CTA).
              </p>
            ) : null}
          </div>

          {strategyApplied ? (
            <button
              type="button"
              onClick={handleGenerateCopy}
              disabled={copyLoading}
              className="inline-flex h-10 items-center justify-center rounded-[var(--radius-md)] px-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: "var(--brand-gradient)" }}
            >
              {copyLoading ? "Gerando..." : "Gerar variações com IA"}
            </button>
          ) : null}
        </div>

        {!strategyApplied ? (
          <div className="mt-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-body)] px-3 py-2 text-sm text-[var(--text-secondary)]">
            Primeiro selecione uma estratégia para gerar o copy do anúncio.
          </div>
        ) : null}

        {selectedCopy ? (
          <div className="mt-3 rounded-[var(--radius-md)] border border-[var(--success-text)] bg-[var(--success-bg)] p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-[var(--success-text)]">✅ Copy selecionado</p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerateCopy}
                  disabled={copyLoading || !strategyApplied}
                  className="inline-flex rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-surface)] px-2.5 py-1 text-xs font-semibold text-[var(--text-main)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Gerar outras variações
                </button>
                <button
                  type="button"
                  onClick={handleStartChoosingCopy}
                  disabled={copyOptions.length === 0}
                  className="inline-flex rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-surface)] px-2.5 py-1 text-xs font-semibold text-[var(--text-main)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Trocar seleção
                </button>
                <button
                  type="button"
                  onClick={handleClearSelectedCopy}
                  className="inline-flex rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-surface)] px-2.5 py-1 text-xs font-semibold text-[var(--text-main)]"
                >
                  Limpar seleção
                </button>
              </div>
            </div>

            <div className="mt-3 space-y-2 text-sm">
              <p className="text-[var(--text-main)]">
                <span className="font-semibold">Headline:</span> {selectedCopy.headline}
              </p>
              <p className="text-[var(--text-main)]">
                <span className="font-semibold">Texto:</span> {selectedCopy.primaryText}
              </p>
              <p className="text-[var(--text-main)]">
                <span className="font-semibold">CTA:</span> {selectedCopy.cta}
              </p>
            </div>
            <p className="mt-2 text-xs font-medium text-[var(--text-secondary)]">
              Você pode trocar a seleção quando quiser.
            </p>
          </div>
        ) : copySelectionHydrated ? (
          <p className="mt-3 break-words text-sm text-[var(--text-secondary)]">Nenhuma variação selecionada</p>
        ) : null}

        {copyError ? (
          <div className="mt-3 rounded-[var(--radius-md)] border border-[var(--danger-text)] bg-[var(--danger-bg)] px-3 py-2 text-sm text-[var(--danger-text)]">
            {copyError}
          </div>
        ) : null}

        {copyFallback ? (
          <div className="mt-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-body)] p-3">
            <p className="text-sm font-semibold text-[var(--danger-text)]">
              {copyFallback.error || "Não foi possível gerar variações estruturadas no momento."}
            </p>
            {copyFallback.rawContent ? (
              <details className="mt-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-surface)] p-2">
                <summary className="cursor-pointer text-xs font-semibold text-[var(--text-secondary)]">
                  Ver conteúdo retornado
                </summary>
                <pre className="mt-2 whitespace-pre-wrap break-words text-xs leading-relaxed text-[var(--text-secondary)]">
                  {copyFallback.rawContent}
                </pre>
              </details>
            ) : null}
          </div>
        ) : null}

        {shouldShowCopyOptionsList && copyOptions.length > 0 ? (
          <div ref={copyOptionsListRef} className="mt-4">
            {selectedCopy && isChoosingCopy ? (
              <div className="mb-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsChoosingCopy(false)}
                  className="inline-flex rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-body)] px-2.5 py-1 text-xs font-semibold text-[var(--text-main)]"
                >
                  Cancelar troca
                </button>
              </div>
            ) : null}
            <CopyOptionsSelector
              options={copyOptions}
              selectedIndex={selectedCopyIndex}
              onSelect={handleSelectCopyOption}
              loading={copyLoading}
            />
          </div>
        ) : null}

        {shouldShowCopyOptionsList &&
        !copyLoading &&
        !copyFallback &&
        copyOptions.length === 0 &&
        !selectedCopy &&
        copySelectionHydrated ? (
          <div className="mt-4 rounded-[var(--radius-md)] border border-dashed border-[var(--border)] bg-[var(--bg-body)] p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-surface)]">
                <Sparkles size={14} className="text-[var(--brand-orange)]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-main)]">Nenhuma variação ainda</h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Gere variações com IA e selecione a melhor opção para usar no anúncio.
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </section>

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

      <section
        ref={assetsSectionRef}
        className={`rounded-[var(--radius-lg)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-sm)] ${
          missingSections.assets
            ? "border-2 border-[var(--danger-text)]"
            : "border border-[var(--border)]"
        }`}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2">
            <ImageIcon size={16} className="text-[var(--brand-orange)]" />
            <h2 className="text-lg font-bold text-[var(--text-main)]">Assets e Criativos</h2>
            <span className="rounded-full border border-[var(--border)] bg-[var(--bg-body)] px-2 py-0.5 text-sm font-semibold text-[var(--text-secondary)]">
              {c.adCreatives?.length ?? 0}
            </span>
          </div>
          {missingSections.assets ? (
            <p className="text-xs font-semibold text-[var(--danger-text)]">Gere ou envie pelo menos 1 criativo.</p>
          ) : null}
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
            onClick={() => setPublishDialogOpen(true)}
            disabled={!canPublishToMeta || publishingToMeta}
            className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-md)] px-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] disabled:cursor-not-allowed disabled:opacity-60"
            style={{ background: "var(--brand-gradient)" }}
          >
            <Megaphone size={14} /> {publishingToMeta ? "Publicando..." : "Publicar na Meta"}
          </button>
          {publishRequirements.length > 0 ? (
            <div className="mt-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-body)] px-3 py-2">
              {publishRequirements.map((message) => (
                <p key={message} className="text-sm text-[var(--text-secondary)]">
                  {message}
                </p>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <section className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-[var(--text-secondary)]">Revise os blocos acima e finalize o fluxo da campanha.</div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saveLoading}
            className="inline-flex h-10 w-full items-center justify-center rounded-[var(--radius-md)] px-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] sm:w-auto"
            style={{ background: "var(--brand-gradient)" }}
          >
            {saveLoading ? "Salvando..." : saveButtonLabel}
          </button>
        </div>
      </section>

      <ConfirmDialog
        open={publishDialogOpen}
        title="Confirmar ação"
        description="Publicar campanha na Meta agora?"
        confirmText={publishingToMeta ? "Publicando..." : "Publicar"}
        cancelText="Cancelar"
        tone="primary"
        onCancel={() => {
          if (!publishingToMeta) {
            setPublishDialogOpen(false);
          }
        }}
        onConfirm={() => {
          if (!publishingToMeta) {
            void handlePublishToMeta();
          }
        }}
        confirmDisabled={publishingToMeta}
      />
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
      <FeedbackDialog
        open={feedbackDialog.open}
        tone={feedbackDialog.tone}
        title={feedbackDialog.title}
        description={feedbackDialog.description}
        autoCloseMs={feedbackDialog.autoCloseMs}
        onClose={() => {
          setFeedbackDialog((prev) => ({ ...prev, open: false }));
        }}
      />
    </div>
  );
}
