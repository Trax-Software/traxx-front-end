"use client";

import { CreateCampaignDto } from "@/app/services/campaigns";
import { Building2, ChevronLeft, Lightbulb, MessageSquare, Sparkles, Target } from "lucide-react";

type Props = {
  form: CreateCampaignDto;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
};

export function Step3Review({ form, onBack, onSubmit, loading }: Props) {
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
      <div className="bg-gradient-to-br from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 
                      border-2 border-purple-200 dark:border-purple-800 rounded-xl p-5">
        <div className="flex gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FD8F06] to-[#990099] 
                          flex items-center justify-center flex-shrink-0">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
              Tudo Pronto para Gerar!
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Revise os detalhes abaixo. Nossa IA usará essas informações para criar estratégias e ativos publicitários personalizados.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-4">
          <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Estratégia & Brand
          </h4>
          <div className="space-y-2.5">
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Nome da Campanha</span>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{form.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Objetivo</span>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{getObjectiveLabel()}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Plataforma</span>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{getPlatformLabel()}</p>
              </div>
            </div>
            {form.description && (
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Building2 size={12} />
                  Brand / Cliente
                </span>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{form.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-4">
          <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Inputs da IA
          </h4>
          <div className="space-y-2.5">
            {form.targetAudience && (
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Target size={12} />
                  Público-Alvo
                </span>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{form.targetAudience}</p>
              </div>
            )}
            {form.brandTone && (
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <MessageSquare size={12} />
                  Tom de Voz
                </span>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{form.brandTone}</p>
              </div>
            )}
            {form.keyBenefits && (
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Lightbulb size={12} />
                  Benefícios / Ganchos
                </span>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {form.keyBenefits}
                </p>
              </div>
            )}
            {form.productCategory && (
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Restrições</span>
                <p className="text-sm text-gray-700 dark:text-gray-300">{form.productCategory}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          <strong className="font-bold">Próximos passos:</strong> Após criar a campanha, nossa IA irá processar 
          as informações e gerar sugestões de estratégia. Você poderá revisar e aprovar antes de gerar os ativos finais.
        </p>
      </div>

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
    </div>
  );
}
