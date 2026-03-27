"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AdAccount,
  FacebookPage,
  getAdAccounts,
  getMetaAuthUrl,
  getPages,
} from "@/app/services/integrations";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

type SelectedAdAccount = {
  account_id: string;
  name: string;
  currency?: string | null;
};

type SelectedPage = {
  id: string;
  name: string;
  category?: string | null;
};

const AD_ACCOUNT_STORAGE_KEY = "trax_meta_selected_ad_account";
const PAGE_STORAGE_KEY = "trax_meta_selected_page";

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
  const [isConnected, setIsConnected] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [selectedAdAccount, setSelectedAdAccount] = useState<SelectedAdAccount | null>(null);
  const [selectedPage, setSelectedPage] = useState<SelectedPage | null>(null);
  const [adCopyFeedback, setAdCopyFeedback] = useState<string | null>(null);
  const [pageCopyFeedback, setPageCopyFeedback] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<"connect" | "reconnect" | null>(null);
  const adCopyTimerRef = useRef<number | null>(null);
  const pageCopyTimerRef = useRef<number | null>(null);

  const loadMetaData = useCallback(async (showError: boolean) => {
    setIsLoadingData(true);

    if (showError) {
      setLoadError(null);
    }

    try {
      const [accountsResponse, pagesResponse] = await Promise.all([getAdAccounts(), getPages()]);
      setAdAccounts(accountsResponse);
      setPages(pagesResponse);
      setIsConnected(true);
      setLoadError(null);
    } catch (error) {
      setAdAccounts([]);
      setPages([]);
      setIsConnected(false);

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
    if (typeof window === "undefined") {
      return;
    }

    function readStorageValue<T>(key: string): T | null {
      const rawValue = window.localStorage.getItem(key);
      if (!rawValue) {
        return null;
      }

      try {
        return JSON.parse(rawValue) as T;
      } catch {
        window.localStorage.removeItem(key);
        return null;
      }
    }

    setSelectedAdAccount(readStorageValue<SelectedAdAccount>(AD_ACCOUNT_STORAGE_KEY));
    setSelectedPage(readStorageValue<SelectedPage>(PAGE_STORAGE_KEY));
  }, []);

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
    if (!selectedAdAccount) {
      return;
    }

    try {
      await copyTextWithFallback(selectedAdAccount.account_id);
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
    if (!selectedPage) {
      return;
    }

    try {
      await copyTextWithFallback(selectedPage.id);
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

  function handleSelectAdAccount(account: AdAccount) {
    const nextSelection: SelectedAdAccount = {
      account_id: account.account_id,
      name: account.name,
      currency: account.currency ?? null,
    };
    setSelectedAdAccount(nextSelection);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(AD_ACCOUNT_STORAGE_KEY, JSON.stringify(nextSelection));
    }
  }

  function handleSelectPage(page: FacebookPage) {
    const nextSelection: SelectedPage = {
      id: page.id,
      name: page.name,
      category: page.category ?? null,
    };
    setSelectedPage(nextSelection);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(PAGE_STORAGE_KEY, JSON.stringify(nextSelection));
    }
  }

  function handleClearSelection() {
    setSelectedAdAccount(null);
    setSelectedPage(null);

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(AD_ACCOUNT_STORAGE_KEY);
      window.localStorage.removeItem(PAGE_STORAGE_KEY);
    }
  }

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

          {selectedAdAccount || selectedPage ? (
            <button
              type="button"
              onClick={handleClearSelection}
              className="mt-3 inline-flex rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-body)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:text-[var(--text-main)]"
            >
              Limpar seleção
            </button>
          ) : null}

          <div className="mt-3 flex flex-col gap-2 text-xs text-[var(--text-secondary)]">
            <div className="flex flex-wrap items-center gap-2">
              <p className="break-words">
                {selectedAdAccount
                  ? `Conta selecionada: ${selectedAdAccount.name} (${selectedAdAccount.account_id})`
                  : "Nenhuma conta selecionada"}
              </p>
              {selectedAdAccount ? (
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
                {selectedPage
                  ? `Página selecionada: ${selectedPage.name} (${selectedPage.id})`
                  : "Nenhuma página selecionada"}
              </p>
              {selectedPage ? (
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
                            className="inline-flex rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-body)] px-2.5 py-1 text-xs font-semibold text-[var(--text-main)]"
                          >
                            Selecionar
                          </button>
                          {selectedAdAccount?.account_id === account.account_id ? (
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
                            className="inline-flex rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-body)] px-2.5 py-1 text-xs font-semibold text-[var(--text-main)]"
                          >
                            Selecionar
                          </button>
                          {selectedPage?.id === page.id ? (
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
    </div>
  );
}
