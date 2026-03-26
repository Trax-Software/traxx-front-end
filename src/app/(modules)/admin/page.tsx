"use client";

import AIWidget from "@/components/campaigns/AIWidget";
import CampaignList from "@/components/campaigns/CampaignList";
import CampaignToolbar from "@/components/campaigns/CampaignToolbar";
import StatCard from "@/components/campaigns/StatCard";
import StatsColumn from "@/components/campaigns/StatsColumn";
import { CreateCampaignModal } from "@/app/(modules)/admin/campaigns/components/CreateCampaignModal";
import { mapApiCampaignToUi, useCampaigns } from "@/app/(modules)/admin/hooks/useCampaigns";
import { useMemo, useState } from "react";

function TrendUpIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l7-7 4 4 7-7" />
      <path d="M14 7h7v7" />
    </svg>
  );
}

export default function AdminPage() {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const { campaigns, isLoading, error, refetch } = useCampaigns();

  const kpis = useMemo(() => {
    const counters = {
      total: campaigns.length,
      drafts: 0,
      waitingApproval: 0,
      generatingAssets: 0,
      completed: 0,
      published: 0,
    };

    for (const campaign of campaigns) {
      if (campaign.status === "DRAFT") {
        counters.drafts += 1;
      } else if (campaign.status === "WAITING_APPROVAL") {
        counters.waitingApproval += 1;
      } else if (campaign.status === "GENERATING_ASSETS") {
        counters.generatingAssets += 1;
      } else if (campaign.status === "COMPLETED") {
        counters.completed += 1;
      } else if (campaign.status === "PUBLISHED") {
        counters.published += 1;
      }
    }

    return counters;
  }, [campaigns]);

  const totalAssets = useMemo(
    () => campaigns.reduce((sum, c) => sum + (c._count?.adCreatives ?? 0), 0),
    [campaigns]
  );

  const campaignListItems = useMemo(() => campaigns.map(mapApiCampaignToUi), [campaigns]);

  return (
    <>
      {isCreateModalOpen ? (
        <CreateCampaignModal
          onClose={() => setCreateModalOpen(false)}
          onSuccess={() => {
            void refetch();
          }}
        />
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="flex flex-col gap-6">
          <CampaignToolbar onCreateCampaign={() => setCreateModalOpen(true)} />

          {isLoading ? (
            <div className="text-sm text-[var(--text-secondary)]">Carregando campanhas...</div>
          ) : null}

          {error ? (
            <div className="rounded-[10px] border border-[var(--danger-text)] bg-[var(--danger-bg)] px-4 py-3 text-sm text-[var(--danger-text)]">
              {error}
            </div>
          ) : null}

          {!isLoading && !error && campaigns.length === 0 ? (
            <div className="text-sm text-[var(--text-secondary)]">
              Em breve. Ainda não há campanhas para exibir.
            </div>
          ) : null}

          {!isLoading && !error && campaigns.length > 0 ? (
            <CampaignList campaigns={campaignListItems} />
          ) : null}

          <AIWidget />
        </section>

        <StatsColumn>
          <StatCard title="Campanhas Criadas (Mensal)" value={String(kpis.total)}>
            <div className="flex items-end justify-between">
              <div className="flex h-10 items-end gap-1">
                <span className="h-[40%] w-2 rounded-sm bg-[var(--orange-light)]" />
                <span className="h-[60%] w-2 rounded-sm bg-[var(--orange-light)]" />
                <span className="h-[30%] w-2 rounded-sm bg-[var(--orange-light)]" />
                <span className="h-full w-2 rounded-sm bg-[var(--brand-orange)] shadow-[0_0_8px_rgba(253,143,6,0.3)]" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-[var(--success-text)]">
              <TrendUpIcon />
              Rascunhos: {kpis.drafts}
            </div>
          </StatCard>

          <StatCard
            title="Assets Gerados"
            value={String(totalAssets)}
            valueClassName="text-[var(--magenta-text,var(--brand-magenta))]"
          >
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
              <div className="h-full w-[75%] rounded-full bg-[var(--brand-magenta)] shadow-[0_0_10px_rgba(153,0,153,0.4)]" />
            </div>
            <div className="mt-3 text-sm text-[var(--text-secondary)]">
              Em aprovação: {kpis.waitingApproval}
            </div>
          </StatCard>
        </StatsColumn>
      </div>
    </>
  );
}
