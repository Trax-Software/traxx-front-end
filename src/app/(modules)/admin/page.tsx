import AIWidget from "@/components/campaigns/AIWidget";
import CampaignList from "@/components/campaigns/CampaignList";
import CampaignToolbar from "@/components/campaigns/CampaignToolbar";
import StatCard from "@/components/campaigns/StatCard";
import StatsColumn from "@/components/campaigns/StatsColumn";

function TrendUpIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l7-7 4 4 7-7" />
      <path d="M14 7h7v7" />
    </svg>
  );
}

export default function AdminPage() {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="flex flex-col gap-6">
        <CampaignToolbar />
        <CampaignList />
        <AIWidget />
      </section>

      <StatsColumn>
        <StatCard title="Campanhas Criadas (Mensal)" value="12">
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
            +3 vs anterior
          </div>
        </StatCard>

        <StatCard
          title="Assets Gerados"
          value="148"
          valueClassName="text-[var(--magenta-text,var(--brand-magenta))]"
        >
          <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
            <div className="h-full w-[75%] rounded-full bg-[var(--brand-magenta)] shadow-[0_0_10px_rgba(153,0,153,0.4)]" />
          </div>
          <div className="mt-3 text-sm text-[var(--text-secondary)]">Produção dentro da meta</div>
        </StatCard>
      </StatsColumn>
    </div>
  );
}
