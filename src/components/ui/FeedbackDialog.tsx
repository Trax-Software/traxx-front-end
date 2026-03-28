"use client";

import { useEffect } from "react";

type FeedbackDialogProps = {
  open: boolean;
  tone?: "success" | "danger" | "info";
  title: string;
  description: string;
  buttonText?: string;
  onClose: () => void;
  autoCloseMs?: number;
};

export function FeedbackDialog({
  open,
  tone = "info",
  title,
  description,
  buttonText = "OK",
  onClose,
  autoCloseMs,
}: FeedbackDialogProps) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, open]);

  useEffect(() => {
    if (!open || !autoCloseMs) return;

    const timeout = window.setTimeout(() => {
      onClose();
    }, autoCloseMs);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [autoCloseMs, onClose, open]);

  if (!open) {
    return null;
  }

  const toneClasses =
    tone === "success"
      ? "border-[var(--success-text)] text-[var(--success-text)] bg-[var(--success-bg)]"
      : tone === "danger"
        ? "border-[var(--danger-text)] text-[var(--danger-text)] bg-[var(--danger-bg)]"
        : "border-[var(--brand-orange)] text-[var(--brand-orange)] bg-[var(--orange-light)]";

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-end justify-center bg-black/55 p-4 sm:items-center"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] p-4 shadow-[var(--shadow-lg)] sm:p-5"
      >
        <div className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClasses}`}>
          {tone === "success" ? "Sucesso" : tone === "danger" ? "Erro" : "Aviso"}
        </div>

        <h3 className="mt-3 text-base font-bold text-[var(--text-main)]">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{description}</p>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-body)] px-4 text-sm font-semibold text-[var(--text-main)] transition hover:bg-[var(--bg-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
