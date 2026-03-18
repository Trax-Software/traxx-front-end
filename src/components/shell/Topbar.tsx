import React from "react";

type TopbarProps = {
  title: string;
  userName?: string;
};

export default function Topbar({ title, userName = "Murilo" }: TopbarProps) {
  return (
    <header className="flex flex-col gap-3 px-6 pt-6 lg:px-10 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-main)]">
          {title}
        </h1>
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1 text-xs font-semibold text-[var(--success-text)]">
          <span className="h-2 w-2 rounded-full bg-[var(--success-text)]" />
          Auto-salvo
        </span>
      </div>

      <div className="flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5">
        <div
          className="h-8 w-8 rounded-full border-2 border-[var(--bg-surface)]"
          style={{ background: "var(--brand-gradient)" }}
        />
        <span className="text-sm font-semibold text-[var(--text-main)]">{userName}</span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bg-body)] text-[var(--text-secondary)]">
          <svg viewBox="0 0 20 20" className="h-3 w-3" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M5 8l5 5 5-5" />
          </svg>
        </span>
      </div>
    </header>
  );
}
