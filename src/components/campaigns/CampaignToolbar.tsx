const tabs = ["Todas", "Em andamento", "Concluídas"];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export default function CampaignToolbar() {
  return (
    <div className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] p-4 shadow-[var(--shadow-sm)] lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
          <SearchIcon />
        </span>
        <input
          type="text"
          placeholder="Buscar campanhas..."
          className="h-11 w-full rounded-[10px] border border-[var(--border)] bg-[var(--bg-body)] pl-10 pr-3 text-sm text-[var(--text-main)] outline-none transition focus:border-[var(--brand-orange)] focus:bg-[var(--bg-surface)] focus:shadow-[0_0_0_3px_var(--orange-light)]"
        />
      </div>

      <div className="flex flex-wrap gap-1 rounded-[10px] border border-[var(--border)] bg-[var(--bg-body)] p-1">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            type="button"
            className={
              index === 0
                ? "rounded-md bg-[var(--bg-surface)] px-4 py-2 text-sm font-semibold text-[var(--brand-orange)] shadow-[var(--shadow-sm)]"
                : "rounded-md px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--brand-orange)]"
            }
          >
            {tab}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="group relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-[10px] bg-[var(--brand-orange)] px-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition hover:-translate-y-0.5"
      >
        <span
          className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition group-hover:opacity-100"
          style={{ background: "var(--brand-gradient)" }}
        />
        <PlusIcon />
        Nova Campanha
      </button>
    </div>
  );
}
