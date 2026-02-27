import React from "react";

type Status = "success" | "warning" | "danger";

type CampaignCardProps = {
  title: string;
  subtitle: string;
  status: Status;
  statusLabel: string;
  timeLabel: string;
  platformLabel: string;
  platformColor: string;
  platformBg: string;
};

const statusStyles: Record<Status, string> = {
  success: "bg-[var(--success-bg)] text-[var(--success-text)]",
  warning: "bg-[var(--warning-bg)] text-[var(--warning-text)]",
  danger: "bg-[var(--danger-bg)] text-[var(--danger-text)]",
};

export default function CampaignCard({
  title,
  subtitle,
  status,
  statusLabel,
  timeLabel,
  platformLabel,
  platformColor,
  platformBg,
}: CampaignCardProps) {
  return (
    <div className="grid gap-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] p-4 shadow-[var(--shadow-sm)] transition hover:border-[var(--brand-orange)] sm:grid-cols-[48px_1fr] lg:grid-cols-[48px_2fr_1fr_1fr_auto] lg:items-center">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold"
        style={{ color: platformColor, background: platformBg }}
      >
        {platformLabel}
      </div>

      <div>
        <h4 className="text-base font-semibold text-[var(--text-main)]">{title}</h4>
        <p className="text-sm text-[var(--text-secondary)]">{subtitle}</p>
      </div>

      <div className="lg:justify-self-start">
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}>
          <span className="h-2 w-2 rounded-full bg-current" />
          {statusLabel}
        </span>
      </div>

      <div className="text-sm font-medium text-[var(--text-secondary)] lg:text-right">
        {timeLabel}
      </div>

      <button
        type="button"
        aria-label="Mais opcoes"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-[var(--text-secondary)] transition hover:border-[var(--border)] hover:bg-[var(--bg-body)]"
      >
        <span className="flex flex-col items-center gap-1">
          <span className="h-1 w-1 rounded-full bg-current" />
          <span className="h-1 w-1 rounded-full bg-current" />
          <span className="h-1 w-1 rounded-full bg-current" />
        </span>
      </button>
    </div>
  );
}
