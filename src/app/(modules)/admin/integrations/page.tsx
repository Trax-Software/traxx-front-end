"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AdAccount,
  FacebookPage,
  getAdAccounts,
  getMetaAuthUrl,
  getMetaStatus,
  getPages,
  MetaIntegrationStatus,
  setMetaSelection,
} from "@/app/services/integrations";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FeedbackDialog } from "@/components/ui/FeedbackDialog";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

function formatAccountStatus(status: AdAccount["account_status"]) {
  if (status === undefined || status === null) {
    return "-";
  }

  const normalized = String(status).toUpperCase();

  if (normalized === "1" || normalized === "ACTIVE") {
    return "Ativa";
  }

  if (normalized === "2" || normalized === "DISABLED") {
    return "Desativada";
  }

  return String(status);
}

export default function IntegrationsPage() {
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([]);
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [metaStatus, setMetaStatus] = useState<MetaIntegrationStatus | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isSavingSelection, setIsSavingSelection] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [selectedAdAccountId, setSelectedAdAccountId] = useState<string | null>(null);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [adCopyFeedback, setAdCopyFeedback] = useState<string | null>(null);
  const [pageCopyFeedback, setPageCopyFeedback] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<"connect" | "reconnect" | null>(null);
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
  const adCopyTimerRef = useRef<number | null>(null);
  const pageCopyTimerRef = useRef<number | null>(null);

  const loadMetaData = useCallback(async (showError: boolean) => {
    setIsLoadingData(true);

    if (showError) {
      setLoadError(null);
    }

    try {
      const statusResponse = await getMetaStatus();
      setMetaStatus(statusResponse);
      setSelectedAdAccountId(statusResponse.selectedAdAccountId ?? null);
      setSelectedPageId(statusResponse.selectedPageId ?? null);

      if (statusResponse.connected) {
        const [accountsResponse, pagesResponse] = await Promise.all([getAdAccounts(), getPages()]);
        setAdAccounts(accountsResponse);
        setPages(pagesResponse);
      } else {
        setAdAccounts([]);
        setPages([]);
      }

      setLoadError(null);
    } catch (error) {
      setAdAccounts([]);
      setPages([]);
      setMetaStatus({
        connected: false,
        selectedAdAccountId: null,
        selectedPageId: null,
      });
      setSelectedAdAccountId(null);
      setSelectedPageId(null);

      if (showError) {
        setLoadError(getErrorMessage(error, "Não foi possível carregar dados da Meta."));
      }
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    void loadMetaData(false);
  }, [loadMetaData]);

  useEffect(() => {
    return () => {
      if (adCopyTimerRef.current) {
        window.clearTimeout(adCopyTimerRef.current);
      }

      if (pageCopyTimerRef.current) {
        window.clearTimeout(pageCopyTimerRef.current);
      }
    };
  }, []);

  async function copyTextWithFallback(value: string) {
    if (typeof window === "undefined") {
      throw new Error("Clipboard indisponível.");
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }

    const textArea = document.createElement("textarea");
    textArea.value = value;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    textArea.style.pointerEvents = "none";
    document.body.appendChild(textArea);
    textArea.select();

    const didCopy = document.execCommand("copy");
    document.body.removeChild(textArea);

    if (!didCopy) {
      throw new Error("Falha ao copiar.");
    }
  }

  async function handleConfirmConnectMeta() {
    setPendingAction(null);
    setConnectionError(null);
    setIsRedirecting(true);

    try {
      const authUrl = await getMetaAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      setConnectionError(getErrorMessage(error, "Não foi possível iniciar a conexão com a Meta."));
      setIsRedirecting(false);
    }
  }

  async function handleCopyAdAccountId() {
    if (!selectedAdAccountId) {
      return;
    }

    try {
      await copyTextWithFallback(selectedAdAccountId);
      setAdCopyFeedback("Copiado!");
      if (adCopyTimerRef.current) {
        window.clearTimeout(adCopyTimerRef.current);
      }
      adCopyTimerRef.current = window.setTimeout(() => {
        setAdCopyFeedback(null);
      }, 1500);
    } catch {
      setAdCopyFeedback("Não foi possível copiar");
      if (adCopyTimerRef.current) {
        window.clearTimeout(adCopyTimerRef.current);
      }
      adCopyTimerRef.current = window.setTimeout(() => {
        setAdCopyFeedback(null);
      }, 2000);
    }
  }

  async function handleCopyPageId() {
    if (!selectedPageId) {
      return;
    }

    try {
      await copyTextWithFallback(selectedPageId);
      setPageCopyFeedback("Copiado!");
      if (pageCopyTimerRef.current) {
        window.clearTimeout(pageCopyTimerRef.current);
      }
      pageCopyTimerRef.current = window.setTimeout(() => {
        setPageCopyFeedback(null);
      }, 1500);
    } catch {
      setPageCopyFeedback("Não foi possível copiar");
      if (pageCopyTimerRef.current) {
        window.clearTimeout(pageCopyTimerRef.current);
      }
      pageCopyTimerRef.current = window.setTimeout(() => {
        setPageCopyFeedback(null);
      }, 2000);
    }
  }

  async function persistMetaSelection(adAccountId: string, pageId: string) {
    try {
      setIsSavingSelection(true);
      await setMetaSelection(adAccountId, pageId);
      setFeedbackDialog({
        open: true,
        tone: "success",
        title: "Seleção salva",
        description: "Conta de anúncio e página vinculadas com sucesso.",
        autoCloseMs: 1500,
      });
      await loadMetaData(false);
    } catch (error) {
      setFeedbackDialog({
        open: true,
        tone: "danger",
        title: "Não foi possível salvar seleção",
        description: getErrorMessage(error, "Tente novamente em instantes."),
      });
    } finally {
      setIsSavingSelection(false);
    }
  }

  function handleSelectAdAccount(account: AdAccount) {
    const nextAdAccountId = account.account_id;
    setSelectedAdAccountId(nextAdAccountId);

    if (selectedPageId) {
      void persistMetaSelection(nextAdAccountId, selectedPageId);
    }
  }

  function handleSelectPage(page: FacebookPage) {
    const nextPageId = page.id;
    setSelectedPageId(nextPageId);

    if (selectedAdAccountId) {
      void persistMetaSelection(selectedAdAccountId, nextPageId);
    }
  }

  const isConnected = Boolean(metaStatus?.connected);
  const selectedAdAccount = adAccounts.find((account) => account.account_id === selectedAdAccountId) ?? null;
  const selectedPage = pages.find((page) => page.id === selectedPageId) ?? null;

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-md)] sm:p-6">
        <h2 className="text-xl font-bold text-[var(--text-main)]">Integrações</h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Conecte suas contas para publicar campanhas automaticamente.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] p-4 shadow-[var(--shadow-sm)] sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-[var(--text-main)]">Meta Ads</h3>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-sm text-[var(--text-secondary)]">
                  {isConnected ? "Conectado" : "Não conectado"}
                </p>
                {isConnected ? (
                  <span className="inline-flex rounded-full bg-[var(--success-bg)] px-2 py-0.5 text-xs font-semibold text-[var(--success-text)]">
                    Conectado
                  </span>
                ) : null}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPendingAction(isConnected ? "reconnect" : "connect")}
              disabled={isRedirecting}
              className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand-orange)] px-4 py-2 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isRedirecting ? "Redirecionando..." : isConnected ? "Reconectar" : "Conectar Meta"}
            </button>
          </div>

          {connectionError ? (
            <p className="mt-3 text-sm text-[var(--danger-text)]">{connectionError}</p>
          ) : null}

          <div className="mt-3 flex flex-col gap-2 text-xs text-[var(--text-secondary)]">
            <div className="flex flex-wrap items-center gap-2">
              <p className="break-words">
                {selectedAdAccountId
                  ? `Conta selecionada: ${selectedAdAccount?.name ?? selectedAdAccountId} (${selectedAdAccountId})`
                  : "Nenhuma conta selecionada"}
              </p>
              {selectedAdAccountId ? (
                <button
                  type="button"
                  onClick={handleCopyAdAccountId}
                  className="inline-flex rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-body)] px-2 py-0.5 text-[11px] font-semibold text-[var(--text-secondary)] transition-colors hover:text-[var(--text-main)]"
                >
                  Copiar ID
                </button>
              ) : null}
              {adCopyFeedback ? (
                <span className="text-[11px] text-[var(--text-secondary)]">{adCopyFeedback}</span>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="break-words">
                {selectedPageId
                  ? `Página selecionada: ${selectedPage?.name ?? selectedPageId} (${selectedPageId})`
                  : "Nenhuma página selecionada"}
              </p>
              {selectedPageId ? (
                <button
                  type="button"
                  onClick={handleCopyPageId}
                  className="inline-flex rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-body)] px-2 py-0.5 text-[11px] font-semibold text-[var(--text-secondary)] transition-colors hover:text-[var(--text-main)]"
                >
                  Copiar ID
                </button>
              ) : null}
              {pageCopyFeedback ? (
                <span className="text-[11px] text-[var(--text-secondary)]">{pageCopyFeedback}</span>
              ) : null}
            </div>
          </div>

          {loadError ? <p className="mt-3 text-sm text-[var(--danger-text)]">{loadError}</p> : null}

          {isLoadingData ? (
            <p className="mt-4 text-sm text-[var(--text-secondary)]">Carregando dados da integração...</p>
          ) : null}

          {!isLoadingData && isConnected ? (
            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
              <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-body)] p-3">
                <h4 className="text-sm font-semibold text-[var(--text-main)]">Contas de anúncio</h4>
                <ul className="mt-3 flex flex-col gap-2">
                  {adAccounts.length === 0 ? (
                    <li className="text-sm text-[var(--text-secondary)]">Nenhuma conta encontrada.</li>
                  ) : (
                    adAccounts.map((account) => (
                      <li key={account.account_id} className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-surface)] p-3">
                        <p className="text-sm font-semibold text-[var(--text-main)]">{account.name}</p>
                        <p className="mt-1 break-all text-xs text-[var(--text-secondary)]">
                          ID: {account.account_id}
                        </p>
                        <p className="mt-1 text-xs text-[var(--text-secondary)]">
                          {account.currency ?? "-"} • {formatAccountStatus(account.account_status)}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSelectAdAccount(account)}
                            disabled={isSavingSelection}
                            className="inline-flex rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-body)] px-2.5 py-1 text-xs font-semibold text-[var(--text-main)] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isSavingSelection && selectedAdAccountId === account.account_id ? "Salvando..." : "Selecionar"}
                          </button>
                          {selectedAdAccountId === account.account_id ? (
                            <span className="inline-flex rounded-full bg-[var(--orange-light)] px-2 py-1 text-xs font-semibold text-[var(--brand-orange)]">
                              Selecionado
                            </span>
                          ) : null}
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-body)] p-3">
                <h4 className="text-sm font-semibold text-[var(--text-main)]">Páginas</h4>
                <ul className="mt-3 flex flex-col gap-2">
                  {pages.length === 0 ? (
                    <li className="text-sm text-[var(--text-secondary)]">Nenhuma página encontrada.</li>
                  ) : (
                    pages.map((page) => (
                      <li key={page.id} className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-surface)] p-3">
                        <p className="text-sm font-semibold text-[var(--text-main)]">{page.name}</p>
                        <p className="mt-1 break-all text-xs text-[var(--text-secondary)]">ID: {page.id}</p>
                        {page.category ? (
                          <p className="mt-1 text-xs text-[var(--text-secondary)]">{page.category}</p>
                        ) : null}
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSelectPage(page)}
                            disabled={isSavingSelection}
                            className="inline-flex rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-body)] px-2.5 py-1 text-xs font-semibold text-[var(--text-main)] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isSavingSelection && selectedPageId === page.id ? "Salvando..." : "Selecionar"}
                          </button>
                          {selectedPageId === page.id ? (
                            <span className="inline-flex rounded-full bg-[var(--orange-light)] px-2 py-1 text-xs font-semibold text-[var(--brand-orange)]">
                              Selecionado
                            </span>
                          ) : null}
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          ) : null}
        </article>

        <article className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] p-4 shadow-[var(--shadow-sm)] sm:p-5">
          <h3 className="text-base font-semibold text-[var(--text-main)]">Próximas integrações</h3>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Em breve: Google Ads e outras plataformas.
          </p>
        </article>
      </section>

      <ConfirmDialog
        open={pendingAction !== null}
        title="Confirmar ação"
        description="Você será redirecionado para a Meta para autorizar a integração. Continuar?"
        confirmText="Continuar"
        cancelText="Cancelar"
        tone="primary"
        onCancel={() => setPendingAction(null)}
        onConfirm={() => {
          void handleConfirmConnectMeta();
        }}
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
