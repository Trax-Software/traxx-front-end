"use client";

import { AdAccount, FacebookPage, connectMeta, getAdAccounts, getMetaAuthUrl, getPages } from "@/app/services/integrations";
import { CheckCircle, ChevronRight, Facebook, Link as LinkIcon, Loader, Users, Zap } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function IntegrationsPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([]);
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (code) handleConnect(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  async function handleConnect(authCode: string) {
    setConnecting(true); setError(null);
    try {
      await connectMeta(authCode);
      setConnected(true);
      loadMetaData();
    } catch { setError("Erro ao conectar com o Meta. O código pode ter expirado."); }
    finally { setConnecting(false); }
  }

  async function loadMetaData() {
    setLoadingData(true);
    try {
      const [accounts, fbPages] = await Promise.all([getAdAccounts(), getPages()]);
      setAdAccounts(accounts);
      setPages(fbPages);
    } catch { /* silent */ }
    finally { setLoadingData(false); }
  }

  async function handleStartOAuth() {
    try {
      const url = await getMetaAuthUrl();
      window.location.href = url;
    } catch { setError("Erro ao obter URL de autenticação."); }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }} className="animate-fade-slide">
        <h1 className="page-title">Integrações</h1>
        <p className="page-subtitle">Conecte suas plataformas de anúncio para publicar campanhas diretamente.</p>
        <div className="gradient-bar" style={{ marginTop: 12, width: 48 }} />
      </div>

      {error && (
        <div className="animate-fade" style={{
          background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
          color: "#ef4444", padding: 14, borderRadius: 12, fontSize: 13, marginBottom: 24,
        }}>
          {error}
        </div>
      )}

      {connecting && (
        <div className="animate-fade" style={{
          background: "var(--primary-light)", border: "1px solid var(--border-strong)",
          color: "var(--primary)", padding: 14, borderRadius: 12, fontSize: 13, marginBottom: 24,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <Loader size={15} className="animate-spin" /> Conectando com o Meta...
        </div>
      )}

      <div style={{ display: "grid", gap: 20, maxWidth: 680 }}>
        {/* Card Meta */}
        <div className="card animate-fade-slide" style={{ overflow: "hidden" }}>
          {/* Card Header com gradiente */}
          <div style={{
            background: "linear-gradient(135deg, #1877F2 0%, #0a4db5 100%)",
            padding: "22px 28px",
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{
              width: 50, height: 50, background: "#fff", borderRadius: 14,
              display: "grid", placeItems: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}>
              <Facebook size={26} color="#1877F2" />
            </div>
            <div style={{ flex: 1, color: "#fff" }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 2 }}>Meta Ads</h2>
              <p style={{ opacity: 0.8, fontSize: 13 }}>Facebook · Instagram · Audience Network</p>
            </div>
            {connected && (
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(52,211,153,0.2)", border: "1px solid rgba(52,211,153,0.4)",
                borderRadius: 20, padding: "4px 12px", color: "#34D399",
                fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
              }}>
                <CheckCircle size={13} /> CONECTADO
              </div>
            )}
          </div>

          {/* Card Body */}
          <div style={{ padding: 28 }}>
            {!connected ? (
              <>
                <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7, marginBottom: 22 }}>
                  Conecte sua conta do Meta para publicar campanhas diretamente no Facebook e Instagram.
                </p>
                <div style={{ display: "grid", gap: 10, marginBottom: 24 }}>
                  {[
                    "Publicar campanhas no Facebook e Instagram",
                    "Acessar suas contas de anúncio",
                    "Selecionar páginas do Facebook",
                    "Monitorar performance em tempo real",
                  ].map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-primary)", fontSize: 14 }}>
                      <CheckCircle size={15} color="var(--primary)" />
                      {item}
                    </div>
                  ))}
                </div>
                <button onClick={handleStartOAuth} disabled={connecting} style={{
                  width: "100%", padding: "13px", border: "none", borderRadius: 12,
                  background: "#1877F2", color: "#fff", fontWeight: 700, fontSize: 15,
                  cursor: connecting ? "not-allowed" : "pointer", opacity: connecting ? 0.7 : 1,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  transition: "opacity 0.2s", fontFamily: "inherit",
                  boxShadow: "0 4px 16px rgba(24,119,242,0.4)",
                }}>
                  <LinkIcon size={17} /> Conectar com o Meta <ChevronRight size={15} />
                </button>
              </>
            ) : (
              <>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
                  background: "var(--status-active-bg)", borderRadius: 10,
                  color: "var(--status-active-text)", fontSize: 14, fontWeight: 600, marginBottom: 24,
                }}>
                  <CheckCircle size={17} /> Integração com Meta ativada com sucesso!
                </div>

                {loadingData ? (
                  <div style={{ padding: 24, textAlign: "center", color: "var(--text-tertiary)" }}>
                    Carregando dados da conta...
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: 20 }}>
                    {adAccounts.length > 0 && (
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-tertiary)", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 }}>
                          Contas de Anúncio ({adAccounts.length})
                        </p>
                        <div style={{ display: "grid", gap: 8 }}>
                          {adAccounts.map((acc) => (
                            <div key={acc.id} className="card" style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div>
                                <p style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>{acc.name}</p>
                                <p style={{ fontSize: 12, color: "var(--text-tertiary)" }}>ID: {acc.id}</p>
                              </div>
                              {acc.currency && <span className="badge badge-draft">{acc.currency}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {pages.length > 0 && (
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-tertiary)", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                          <Users size={12} /> Páginas do Facebook ({pages.length})
                        </p>
                        <div style={{ display: "grid", gap: 8 }}>
                          {pages.map((page) => (
                            <div key={page.id} className="card" style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                              {page.picture?.data?.url && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={page.picture.data.url} alt={page.name} width={36} height={36} style={{ borderRadius: 8, objectFit: "cover" }} />
                              )}
                              <div>
                                <p style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>{page.name}</p>
                                {page.category && <p style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{page.category}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Em Breve */}
        <div className="animate-fade-slide">
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-tertiary)", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 12 }}>
            Em Breve
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {["Google Ads", "LinkedIn Ads", "TikTok Ads"].map((name) => (
              <div key={name} style={{
                padding: "12px 18px", borderRadius: 12, border: "1.5px dashed var(--border)",
                color: "var(--text-tertiary)", fontSize: 13, fontWeight: 600,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <Zap size={14} /> {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
