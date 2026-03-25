"use client";

import { CreateCampaignDto } from "@/app/services/campaigns";
import { Building2, ChevronLeft, Lightbulb, MessageSquare, Sparkles, Target } from "lucide-react";

type Props = {
  form: CreateCampaignDto;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
  showActions?: boolean;
};

export function Step3Review({ form, onBack, onSubmit, loading, showActions = true }: Props) {
  const getObjectiveLabel = () => {
    const map: Record<string, string> = {
      AWARENESS: "Reconhecimento",
      TRAFFIC: "Tráfego",
      SALES: "Vendas",
      LEADS: "Leads",
    };
    return map[form.objective] || form.objective;
  };

  const getPlatformLabel = () => {
    const map: Record<string, string> = {
      META: "Meta Ads (Facebook & Instagram)",
      GOOGLE: "Google Ads",
      LINKEDIN: "LinkedIn Ads",
    };
    return map[form.platform || ""] || form.platform;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-body)] p-5">
        <div className="flex gap-3 mb-4">
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius-md)]"
            style={{ background: "var(--brand-gradient)" }}
          >
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h3 className="mb-1 text-sm font-bold text-[var(--text-main)]">
              Tudo Pronto para Gerar!
            </h3>
            <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
              Revise os detalhes abaixo. Nossa IA usará essas informações para criar estratégias e ativos publicitários personalizados.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] p-4">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)]">
            Estratégia & Brand
          </h4>
          <div className="space-y-2.5">
            <div>
              <span className="text-xs text-[var(--text-secondary)]">Nome da Campanha</span>
              <p className="text-sm font-semibold text-[var(--text-main)]">{form.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-[var(--text-secondary)]">Objetivo</span>
                <p className="text-sm font-semibold text-[var(--text-main)]">{getObjectiveLabel()}</p>
              </div>
              <div>
                <span className="text-xs text-[var(--text-secondary)]">Plataforma</span>
                <p className="text-sm font-semibold text-[var(--text-main)]">{getPlatformLabel()}</p>
              </div>
            </div>
            {form.description && (
              <div>
                <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                  <Building2 size={12} />
                  Brand / Cliente
                </span>
                <p className="text-sm font-semibold text-[var(--text-main)]">{form.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] p-4">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)]">
            Inputs da IA
          </h4>
          <div className="space-y-2.5">
            {form.targetAudience && (
              <div>
                <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                  <Target size={12} />
                  Público-Alvo
                </span>
                <p className="text-sm leading-relaxed text-[var(--text-main)]">{form.targetAudience}</p>
              </div>
            )}
            {form.brandTone && (
              <div>
                <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                  <MessageSquare size={12} />
                  Tom de Voz
                </span>
                <p className="text-sm font-semibold text-[var(--text-main)]">{form.brandTone}</p>
              </div>
            )}
            {form.keyBenefits && (
              <div>
                <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                  <Lightbulb size={12} />
                  Benefícios / Ganchos
                </span>
                <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--text-main)]">
                  {form.keyBenefits}
                </p>
              </div>
            )}
            {form.productCategory && (
              <div>
                <span className="text-xs text-[var(--text-secondary)]">Restrições</span>
                <p className="text-sm text-[var(--text-main)]">{form.productCategory}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--warning-bg)] p-4">
        <p className="text-xs leading-relaxed text-[var(--warning-text)]">
          <strong className="font-bold">Próximos passos:</strong> Após criar a campanha, nossa IA irá processar 
          as informações e gerar sugestões de estratégia. Você poderá revisar e aprovar antes de gerar os ativos finais.
        </p>
      </div>

      {showActions ? (
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700
                       text-gray-700 dark:text-gray-300 font-semibold
                       hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
          >
            <ChevronLeft size={18} />
            Voltar
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="flex-[2] px-6 py-3 rounded-xl font-semibold text-white
                       bg-gradient-to-r from-[#FD8F06] to-[#990099]
                       hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                       transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Criando Campanha...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Criar Campanha
              </>
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
}
