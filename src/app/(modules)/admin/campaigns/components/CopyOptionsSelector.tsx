"use client";

import { CopyOption } from "@/app/services/campaigns";
import { CheckCircle } from "lucide-react";

type Props = {
  options: CopyOption[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  loading: boolean;
};

export function CopyOptionsSelector({ options, selectedIndex, onSelect, loading }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      {options.map((option, index) => {
        const isSelected = selectedIndex === index;

        return (
          <article
            key={index}
            className="rounded-[var(--radius-md)] border bg-[var(--bg-surface)] p-4 shadow-[var(--shadow-sm)]"
            style={{
              borderColor: isSelected ? "var(--brand-orange)" : "var(--border)",
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {option.framework ? (
                  <span className="inline-flex rounded-full border border-[var(--border)] bg-[var(--bg-body)] px-2 py-0.5 text-xs font-semibold text-[var(--text-secondary)]">
                    {option.framework}
                  </span>
                ) : null}
                {isSelected ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--orange-light)] px-2 py-0.5 text-xs font-semibold text-[var(--brand-orange)]">
                    <CheckCircle size={12} />
                    Selecionado
                  </span>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => onSelect(index)}
                disabled={loading}
                className="inline-flex rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-body)] px-2.5 py-1 text-xs font-semibold text-[var(--text-main)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSelected ? "Selecionado" : "Selecionar"}
              </button>
            </div>

            <h4 className="mt-3 text-base font-bold leading-snug text-[var(--text-main)]">{option.headline}</h4>

            <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-xs leading-relaxed text-[var(--text-secondary)] sm:text-sm">
              {option.primaryText}
            </p>

            <div className="mt-3 inline-flex rounded-[var(--radius-sm)] bg-[var(--bg-body)] px-2.5 py-1 text-xs font-semibold text-[var(--text-main)]">
              CTA: {option.cta}
            </div>

            {option.reasoning ? (
              <details className="mt-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-body)] p-2">
                <summary className="cursor-pointer text-xs font-semibold text-[var(--text-secondary)]">
                  Ver framework e racional
                </summary>
                <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-[var(--text-secondary)]">
                  {option.reasoning}
                </p>
              </details>
            ) : null}
          </article>
        );
      })}

      {loading ? (
        <p className="col-span-full text-sm text-[var(--text-secondary)]">Gerando variações...</p>
      ) : null}
    </div>
  );
}
