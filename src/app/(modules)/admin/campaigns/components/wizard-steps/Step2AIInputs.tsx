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
};

export function Step2AIInputs({ form, onUpdate, onNext, onBack }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex gap-3">
          <Shield size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-1">
              Brand Safety Ativado
            </h3>
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
              Estes campos estruturados garantem que a IA gere conteúdo alinhado com a identidade da sua marca,
              sem desvios ou mensagens inadequadas.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          <Target size={16} className="inline mr-1.5 mb-0.5" />
          Público-Alvo
        </label>
        <textarea
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     focus:border-[#FD8F06] focus:ring-2 focus:ring-[#FD8F06]/20 outline-none
                     transition-all duration-200 resize-none"
          rows={3}
          placeholder="Ex: Mulheres de 25-40 anos, interessadas em moda sustentável, renda média-alta, moram em capitais..."
          value={form.targetAudience || ""}
          onChange={(e) => onUpdate("targetAudience", e.target.value)}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
          Quanto mais específico, melhor a IA consegue personalizar a mensagem.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
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
                    ? 'border-[#FD8F06] bg-[#FD8F06]/10 text-[#FD8F06] shadow-md'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
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
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          <Lightbulb size={16} className="inline mr-1.5 mb-0.5" />
          Principais Benefícios / Ganchos
        </label>
        <textarea
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     focus:border-[#FD8F06] focus:ring-2 focus:ring-[#FD8F06]/20 outline-none
                     transition-all duration-200 resize-none"
          rows={4}
          placeholder="Liste os principais benefícios ou ganchos que a IA deve destacar:&#10;• Entrega em 24h&#10;• Garantia de 2 anos&#10;• Feito com materiais sustentáveis&#10;• Aprovado por especialistas"
          value={form.keyBenefits || ""}
          onChange={(e) => onUpdate("keyBenefits", e.target.value)}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
          A IA usará estes pontos para criar headlines e copies persuasivos.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          <AlertCircle size={16} className="inline mr-1.5 mb-0.5" />
          Restrições ou Palavras a Evitar (Opcional)
        </label>
        <input
          type="text"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     focus:border-[#FD8F06] focus:ring-2 focus:ring-[#FD8F06]/20 outline-none
                     transition-all duration-200"
          placeholder='Ex: "barato", "promoção", "imperdível"...'
          value={form.productCategory || ""}
          onChange={(e) => onUpdate("productCategory", e.target.value)}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
          Palavras ou termos que não devem aparecer no conteúdo gerado.
        </p>
      </div>

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
    </div>
  );
}
