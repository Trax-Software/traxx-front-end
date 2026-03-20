"use client";

import { CopyOption } from "@/app/services/campaigns";
import { CheckCircle, Copy, Lightbulb, Sparkles } from "lucide-react";

type Props = {
  options: CopyOption[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  saving: boolean;
};

const FRAMEWORK_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  AIDA: { bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.3)", text: "#8b5cf6" },
  PAS: { bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.3)", text: "#3b82f6" },
  FAB: { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)", text: "#10b981" },
};

export function CopyOptionsSelector({ options, selectedIndex, onSelect, saving }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={18} className="text-[#FD8F06]" />
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">
          Escolha a melhor opção de copy
        </h3>
      </div>

      {options.map((option, index) => {
        const isSelected = selectedIndex === index;
        const colors = FRAMEWORK_COLORS[option.framework] || FRAMEWORK_COLORS.AIDA;

        return (
          <button
            key={index}
            type="button"
            onClick={() => !saving && onSelect(index)}
            disabled={saving}
            className={`
              w-full text-left p-5 rounded-xl transition-all duration-200
              border-2 hover:scale-[1.01] active:scale-[0.99]
              ${isSelected 
                ? 'shadow-lg' 
                : 'hover:shadow-md'
              }
              ${saving ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
            `}
            style={{
              borderColor: isSelected ? colors.border : 'var(--border)',
              backgroundColor: isSelected ? colors.bg : 'var(--bg-surface)',
            }}
          >
            {/* Header com Framework */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div 
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: colors.bg,
                    color: colors.text,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  {option.framework}
                </div>
                {isSelected && (
                  <CheckCircle size={18} style={{ color: colors.text }} />
                )}
              </div>
              <Copy size={14} className="text-gray-400" />
            </div>

            {/* Headline */}
            <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
              {option.headline}
            </h4>

            {/* Primary Text */}
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3 line-clamp-3">
              {option.primaryText}
            </p>

            {/* CTA */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#FD8F06] to-[#990099] text-white text-sm font-semibold mb-3">
              {option.cta}
            </div>

            {/* Reasoning */}
            <div 
              className="mt-3 pt-3 border-t"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-start gap-2">
                <Lightbulb size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  <strong>Por que funciona:</strong> {option.reasoning}
                </p>
              </div>
            </div>
          </button>
        );
      })}

      {saving && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-2">
          Aplicando copy selecionado...
        </p>
      )}
    </div>
  );
}
