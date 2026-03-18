"use client";

import { Campaign, listCampaigns } from "@/app/services/campaigns";
import { ArrowRight, Megaphone, Plug, Plus, TrendingUp, BarChart, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Rascunho",
  GENERATING_STRATEGY: "Gerando Estratégia",
  WAITING_APPROVAL: "Aguardando Aprovação",
  GENERATING_ASSETS: "Gerando Assets",
  COMPLETED: "Concluída",
  PUBLISHED: "Publicada",
};

const STATUS_CLASS: Record<string, string> = {
  DRAFT: "badge badge-draft",
  GENERATING_STRATEGY: "badge badge-pending",
  WAITING_APPROVAL: "badge badge-pending",
  GENERATING_ASSETS: "badge badge-active",
  COMPLETED: "badge badge-active",
  PUBLISHED: "badge badge-pub",
};

const OBJECTIVE_LABELS: Record<string, string> = {
  AWARENESS: "Reconhecimento",
  TRAFFIC: "Tráfego",
  SALES: "Vendas",
  LEADS: "Leads",
};

export default function AdminDashboardPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  // Aqui deveríamos pegar o usuário logado via Contexto (ex: useAuth), mas usaremos um fallback
  const userName = "Thiago"; 

  useEffect(() => {
    listCampaigns()
      .then(setCampaigns)
      .catch(() => setCampaigns([]))
      .finally(() => setLoading(false));
  }, []);

  const total = campaigns.length;
  const published = campaigns.filter((c) => c.status === "PUBLISHED").length;
  const active = campaigns.filter((c) => c.status === "GENERATING_STRATEGY" || c.status === "GENERATING_ASSETS").length;

  const metrics = [
    { label: "Total de Campanhas", value: total, icon: Megaphone, color: "var(--brand-orange)", bg: "var(--primary-light)", trend: "+12%" },
    { label: "Campanhas Ativas", value: active, icon: BarChart, color: "var(--brand-magenta)", bg: "var(--secondary-light)", trend: "+4%" },
    { label: "Publicadas", value: published, icon: CheckCircle2, color: "#059669", bg: "var(--status-active-bg)", trend: "Estável" },
  ];

  return (
    <div className="animate-fade-slide space-y-8">
      
      {/* Welcome Banner */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-title text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            Olá, {userName}.
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Aqui está o resumo do desempenho das suas campanhas.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/integrations" className="btn-ghost">
            <Plug size={16} /> Integrações
          </Link>
          <Link href="/admin/campaigns" className="btn-primary">
            <Plus size={16} /> Nova Campanha
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
        {metrics.map(({ label, value, icon: Icon, color, bg, trend }) => (
          <div key={label} className="card card-lift p-6 flex items-center gap-5 justify-between">
            <div className="flex items-center gap-5">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: bg }}
              >
                {loading ? (
                  <div className="skeleton w-6 h-6 rounded-md" />
                ) : (
                  <Icon size={26} color={color} strokeWidth={2} />
                )}
              </div>
              <div>
                {loading ? (
                  <div className="space-y-2">
                    <div className="skeleton w-12 h-6" />
                    <div className="skeleton w-24 h-3" />
                  </div>
                ) : (
                  <>
                    <h3 className="font-title text-3xl font-bold text-[var(--text-primary)] leading-none mb-1">
                      {value}
                    </h3>
                    <p className="text-[13px] font-medium text-[var(--text-secondary)]">
                      {label}
                    </p>
                  </>
                )}
              </div>
            </div>
            
            {!loading && (
               <div className="text-xs font-bold px-2 py-1 rounded-full bg-green-500/10 text-green-600">
                 {trend}
               </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent Activity Table Container */}
      <div className="card overflow-hidden">
        
        {/* Card Header */}
        <div className="px-6 py-5 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-1.5 rounded-lg bg-[var(--primary-light)]">
              <TrendingUp size={18} color="var(--brand-orange)" />
            </span>
            <h2 className="font-title text-lg font-bold text-[var(--text-primary)]">
              Atividade Recente
            </h2>
          </div>
          <Link href="/admin/campaigns" className="text-sm font-semibold flex items-center gap-1.5 text-[var(--brand-orange)] hover:text-[#e07d00] transition-colors">
            Ver todas <ArrowRight size={14} />
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="skeleton flex-2 h-4" />
                <div className="skeleton flex-1 h-4" />
                <div className="skeleton w-20 h-6 rounded-md" />
              </div>
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="py-16 px-6 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[var(--bg-surface-2)] flex items-center justify-center mb-4">
             <Megaphone size={28} className="text-[var(--text-tertiary)]" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">Nenhuma campanha encontrada</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-sm">
              Você ainda não criou nenhuma campanha. Clique abaixo para iniciar sua primeira estratégia de marketing com IA.
            </p>
            <Link href="/admin/campaigns" className="btn-primary">
              <Plus size={16} /> Criar Primeira Campanha
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-[var(--bg-surface-3)]">
                  {["Nome da Campanha", "Objetivo", "Plataforma", "Status atual"].map((h) => (
                    <th key={h} className="py-3 px-6 text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {campaigns.slice(0, 5).map((c) => (
                  <tr key={c.id} className="hover:bg-[var(--bg-surface-2)] transition-colors group">
                    <td className="py-3.5 px-6">
                      <Link href={`/admin/campaigns/${c.id}`} className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand-orange)] transition-colors">
                        {c.name}
                      </Link>
                    </td>
                    <td className="py-3.5 px-6 text-[var(--text-secondary)]">
                      {OBJECTIVE_LABELS[c.objective] ?? c.objective}
                    </td>
                    <td className="py-3.5 px-6 text-[var(--text-secondary)]">
                      {c.platform}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={STATUS_CLASS[c.status] ?? "badge"}>
                        {STATUS_LABELS[c.status] ?? c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
