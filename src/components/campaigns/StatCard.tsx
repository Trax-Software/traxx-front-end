import React from "react";

type StatCardProps = {
  title: string;
  value: string;
  valueClassName?: string;
  children?: React.ReactNode;
};

export default function StatCard({ title, value, valueClassName, children }: StatCardProps) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-sm)]">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
        {title}
      </div>
      <div className={`mt-3 text-4xl font-extrabold ${valueClassName ?? "text-[var(--text-main)]"}`}>
        {value}
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
