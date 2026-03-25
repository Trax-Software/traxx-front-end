"use client";

import { CreateCampaignDto } from "@/app/services/campaigns";
import { AlertCircle, ChevronLeft, ChevronRight, Lightbulb, MessageSquare, Shield, Target } from "lucide-react";

const TONE_OPTIONS = [
  { value: "Profissional", emoji: "💼" },
  { value: "Casual", emoji: "😊" },
  { value: "Motivador", emoji: "🚀" },
  { value: "Urgente", emoji: "⚡" },
  { value: "Educativo", emoji: "📚" },
  { value: "Divertido", emoji: "🎉" },
];

type Props = {
  form: CreateCampaignDto;
  onUpdate: <K extends keyof CreateCampaignDto>(key: K, val: CreateCampaignDto[K]) => void;
  onNext: () => void;
  onBack: () => void;
  showActions?: boolean;
};

export function Step2AIInputs({ form, onUpdate, onNext, onBack, showActions = true }: Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--orange-light)] p-4">
        <div className="flex gap-3">
          <Shield size={20} className="mt-0.5 flex-shrink-0 text-[var(--brand-orange)]" />
          <div>
            <h3 className="mb-1 text-sm font-bold text-[var(--text-main)]">
              Brand Safety Ativado
            </h3>
            <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
              Estes campos estruturados garantem que a IA gere conteúdo alinhado com a identidade da sua marca,
              sem desvios ou mensagens inadequadas.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[var(--text-main)]">
          <Target size={16} className="inline mr-1.5 mb-0.5" />
          Público-Alvo
        </label>
        <textarea
          className="w-full resize-none rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 text-[var(--text-main)] outline-none transition focus:border-[var(--brand-orange)] focus:shadow-[0_0_0_3px_var(--orange-light)]"
          rows={3}
          placeholder="Ex: Mulheres de 25-40 anos, interessadas em moda sustentável, renda média-alta, moram em capitais..."
          value={form.targetAudience || ""}
          onChange={(e) => onUpdate("targetAudience", e.target.value)}
        />
        <p className="mt-1.5 text-xs text-[var(--text-secondary)]">
          Quanto mais específico, melhor a IA consegue personalizar a mensagem.
        </p>
      </div>

      <div>
        <label className="mb-3 block text-sm font-semibold text-[var(--text-main)]">
          <MessageSquare size={16} className="inline mr-1.5 mb-0.5" />
          Tom de Voz da Marca
        </label>
        <div className="grid grid-cols-3 gap-2">
          {TONE_OPTIONS.map(({ value, emoji }) => {
            const isSelected = form.brandTone === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => onUpdate("brandTone", value)}
                className={`
                  px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                  border-2 hover:scale-[1.02] active:scale-[0.98]
                  ${isSelected
                    ? 'border-[var(--brand-orange)] bg-[var(--orange-light)] text-[var(--brand-orange)] shadow-[var(--shadow-sm)]'
                    : 'border-[var(--border)] text-[var(--text-main)] hover:border-[var(--brand-orange)]'
                  }
                `}
              >
                <span className="mr-1.5">{emoji}</span>
                {value}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[var(--text-main)]">
          <Lightbulb size={16} className="inline mr-1.5 mb-0.5" />
          Principais Benefícios / Ganchos
        </label>
        <textarea
          className="w-full resize-none rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 text-[var(--text-main)] outline-none transition focus:border-[var(--brand-orange)] focus:shadow-[0_0_0_3px_var(--orange-light)]"
          rows={4}
          placeholder="Liste os principais benefícios ou ganchos que a IA deve destacar:&#10;• Entrega em 24h&#10;• Garantia de 2 anos&#10;• Feito com materiais sustentáveis&#10;• Aprovado por especialistas"
          value={form.keyBenefits || ""}
          onChange={(e) => onUpdate("keyBenefits", e.target.value)}
        />
        <p className="mt-1.5 text-xs text-[var(--text-secondary)]">
          A IA usará estes pontos para criar headlines e copies persuasivos.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[var(--text-main)]">
          <AlertCircle size={16} className="inline mr-1.5 mb-0.5" />
          Restrições ou Palavras a Evitar (Opcional)
        </label>
        <input
          type="text"
          className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 text-[var(--text-main)] outline-none transition focus:border-[var(--brand-orange)] focus:shadow-[0_0_0_3px_var(--orange-light)]"
          placeholder='Ex: "barato", "promoção", "imperdível"...'
          value={form.productCategory || ""}
          onChange={(e) => onUpdate("productCategory", e.target.value)}
        />
        <p className="mt-1.5 text-xs text-[var(--text-secondary)]">
          Palavras ou termos que não devem aparecer no conteúdo gerado.
        </p>
      </div>

      {showActions ? (
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700
                       text-gray-700 dark:text-gray-300 font-semibold
                       hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200
                       flex items-center justify-center gap-2"
          >
            <ChevronLeft size={18} />
            Voltar
          </button>
          <button
            type="button"
            onClick={onNext}
            className="flex-[2] px-6 py-3 rounded-xl font-semibold text-white
                       bg-gradient-to-r from-[#FD8F06] to-[#990099]
                       hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                       transition-all duration-200 flex items-center justify-center gap-2"
          >
            Próximo: Revisão
            <ChevronRight size={18} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
