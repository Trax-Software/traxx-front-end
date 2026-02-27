import React from "react";

type StepStatus = "done" | "active" | "pending";

type StepProps = {
  label: string;
  status: StepStatus;
};

function StepIcon({ status }: { status: StepStatus }) {
  if (status === "done") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 13l4 4L19 7" />
      </svg>
    );
  }

  if (status === "active") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="6" width="12" height="12" rx="2" />
        <path d="M9 1v4M15 1v4M9 19v4M15 19v4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

function Step({ label, status }: StepProps) {
  const isActive = status === "active";
  const isDone = status === "done";

  return (
    <div className={`flex items-center gap-3 ${isActive ? "opacity-100" : "opacity-70"}`}>
      <div
        className={
          "flex h-8 w-8 items-center justify-center rounded-full text-white " +
          (isDone
            ? "bg-[var(--success-text)]"
            : isActive
            ? "bg-[var(--brand-magenta)] shadow-[0_0_10px_rgba(153,0,153,0.3)]"
            : "bg-[var(--border)]")
        }
      >
        <StepIcon status={status} />
      </div>
      <span className={isActive ? "font-semibold text-[var(--magenta-text,var(--brand-magenta))]" : "text-[var(--text-main)]"}>
        {label}
      </span>
    </div>
  );
}

export default function AIWidget() {
  return (
    <div
      className="relative rounded-[var(--radius-lg)] border border-[var(--border)] p-6"
      style={{
        background: "linear-gradient(160deg, var(--bg-surface), var(--magenta-subtle, var(--magenta-light)))",
      }}
    >
      <div className="absolute left-0 top-0 h-full w-1 rounded-l-[var(--radius-lg)] bg-[var(--brand-magenta)]" />
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-lg font-extrabold" style={{ color: "var(--magenta-text, var(--brand-magenta))" }}>
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--magenta-subtle,var(--magenta-light))]">
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z" />
            </svg>
          </span>
          IA em Processamento
        </div>

        <div className="flex flex-col gap-3">
          <Step status="done" label="Validando contexto..." />
          <Step status="active" label="Gerando variações de criativos (Step 2/3)" />
        </div>
      </div>
    </div>
  );
}
