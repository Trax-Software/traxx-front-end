/**
 * StrategySelector
 * Componente para exibir e selecionar opções de estratégia geradas pela IA.
 * Exibe um card por opção com título, descrição, público-alvo e mensagem chave.
 */

"use client";

import { StrategyOption } from "@/app/services/campaigns";
import { CheckCircle, Target, MessageSquare } from "lucide-react";

type Props = {
  strategies: StrategyOption[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  saving: boolean;
};

export function StrategySelector({ strategies, selectedIndex, onSelect, saving }: Props) {
  return (
    <div className="grid gap-3">
      <p className="mb-1 text-sm font-semibold text-[var(--text-main)]">
        Escolha a estratégia que melhor representa sua campanha:
      </p>

      {strategies.map((s, i) => {
        const isSelected = selectedIndex === i;
        const strategyText = s.reasoning?.trim() || s.description?.trim() || "";
        const keyBenefit = s.keyBenefits?.trim();
        const brandTone = s.brandTone?.trim();

        return (
          <button
            key={i}
            onClick={() => !saving && onSelect(i)}
            disabled={saving}
            className={`w-full rounded-[14px] border-2 p-4 text-left transition sm:p-[18px] ${
              isSelected
                ? "border-[var(--brand-orange)] bg-[var(--bg-surface)] ring-1 ring-[var(--brand-orange)]"
                : "border-[var(--border)] bg-[var(--bg-body)] hover:border-[var(--brand-orange)]"
            } ${saving ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
            aria-pressed={isSelected}
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div
                  className={`grid h-[22px] w-[22px] flex-shrink-0 place-items-center rounded-[6px] ${
                    isSelected ? "bg-[var(--orange-light)]" : "bg-[var(--bg-surface)]"
                  }`}
                >
                  {isSelected ? (
                    <CheckCircle size={13} color="var(--brand-orange)" />
                  ) : (
                    <span className="block h-2 w-2 rounded-full bg-[var(--text-secondary)]" />
                  )}
                </div>
                <strong className="line-clamp-2 text-[15px] font-bold leading-[1.35] text-[var(--text-main)]">
                  {s.title}
                </strong>
              </div>
              {isSelected ? (
                <span className="inline-flex flex-shrink-0 rounded-full border border-[var(--brand-orange)] bg-[var(--orange-light)] px-2 py-0.5 text-xs font-semibold text-[var(--brand-orange)]">
                  Selecionada
                </span>
              ) : null}
            </div>

            {strategyText ? (
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                {strategyText}
              </p>
            ) : null}

            {(s.targetAudience || keyBenefit || brandTone || s.keyMessage) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {s.targetAudience && (
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]">
                    <Target size={11} /> {s.targetAudience}
                  </div>
                )}
                {keyBenefit ? (
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]">
                    <MessageSquare size={11} /> {keyBenefit}
                  </div>
                ) : null}
                {brandTone ? (
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]">
                    <MessageSquare size={11} /> Tom: {brandTone}
                  </div>
                ) : null}
                {s.keyMessage && (
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]">
                    <MessageSquare size={11} /> {s.keyMessage}
                  </div>
                )}
              </div>
            )}
          </button>
        );
      })}

      {saving && (
        <p className="pt-1 text-center text-sm text-[var(--text-secondary)]">
          Aplicando estratégia...
        </p>
      )}
    </div>
  );
}
