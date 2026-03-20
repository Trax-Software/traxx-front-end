"use client";

import { Campaign, CampaignObjective, createCampaign } from "@/app/services/campaigns";
import { Lightbulb, Megaphone, ShoppingCart, Sparkles, Target, TrendingUp, X } from "lucide-react";
import { useState } from "react";

const OBJECTIVES: { value: CampaignObjective; label: string; desc: string; icon: React.ElementType; color: string }[] = [
  { value: "AWARENESS", label: "Reconhecimento", desc: "Aumentar visibilidade", icon: Megaphone, color: "#8b5cf6" },
  { value: "TRAFFIC", label: "Tráfego", desc: "Atrair visitantes", icon: TrendingUp, color: "#3b82f6" },
  { value: "SALES", label: "Vendas", desc: "Converter em vendas", icon: ShoppingCart, color: "#16a34a" },
  { value: "LEADS", label: "Leads", desc: "Captar contatos", icon: Target, color: "#FD8F06" },
];

type Props = {
  onClose: () => void;
  onCreated: (c: Campaign) => void;
};

export function SimpleCampaignWizard({ onClose, onCreated }: Props) {
  const [productName, setProductName] = useState("");
  const [objective, setObjective] = useState<CampaignObjective>("SALES");
  const [targetAudience, setTargetAudience] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productUsp, setProductUsp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creatingStep, setCreatingStep] = useState<'idle' | 'creating' | 'generating'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!productName.trim()) {
      setError("O nome do produto é obrigatório.");
      return;
    }
    if (!targetAudience.trim()) {
      setError("Descreva o público-alvo.");
      return;
    }

    setLoading(true);
    setError(null);
    setCreatingStep('creating');

    try {
      const campaign = await createCampaign({
        name: productName,
        objective,
        platform: "META",
        targetAudience,
        productName,
        productUrl: productUrl || undefined,
        productPrice: productPrice ? parseFloat(productPrice) : undefined,
        productUsp: productUsp || undefined,
        description: `Campanha para ${productName} - ${objective}`,
      });

      setCreatingStep('generating');
      onCreated(campaign);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Erro ao criar campanha.");
      setLoading(false);
      setCreatingStep('idle');
    }
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => !loading && e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-800 animate-in zoom-in-95 duration-200 relative">
        
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="text-center px-8">
              {/* Animated Icon */}
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FD8F06] to-[#990099] opacity-20 animate-ping" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FD8F06] to-[#990099] opacity-30 animate-pulse" />
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#FD8F06] to-[#990099] flex items-center justify-center">
                  <Sparkles size={40} className="text-white animate-pulse" />
                </div>
              </div>

              {/* Status Messages */}
              {creatingStep === 'creating' && (
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Criando sua campanha...
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Salvando informações no banco de dados
                  </p>
                </div>
              )}

              {creatingStep === 'generating' && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    ✨ IA trabalhando na sua campanha...
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Analisando seu produto e público-alvo
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Gerando 3 opções de copy usando frameworks AIDA, PAS e FAB
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                      Isso pode levar 5-10 segundos...
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6 w-full max-w-xs mx-auto">
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#FD8F06] to-[#990099] rounded-full animate-pulse"
                        style={{
                          width: '70%',
                          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FD8F06]/20 to-[#990099]/20 flex items-center justify-center">
                <Sparkles size={24} className="text-[#FD8F06]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Nova Campanha Inteligente
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  A IA vai criar 3 opções de copy para você escolher
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
          
          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex gap-3">
              <Lightbulb size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-1">
                  Como funciona?
                </h3>
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                  Preencha apenas 3 campos obrigatórios. Nossa IA vai analisar seu produto e público para gerar 
                  <strong> 3 opções completas de copy</strong> (headlines + texto + CTA) usando as melhores práticas de marketing.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          {/* Campo 1: Produto */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              1. O que você está vendendo? *
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         focus:border-[#FD8F06] focus:ring-2 focus:ring-[#FD8F06]/20 outline-none
                         transition-all duration-200"
              placeholder="Ex: Curso de Marketing Digital, Tênis Esportivo, Consultoria Financeira..."
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              autoFocus
            />
          </div>

          {/* Campo 2: Objetivo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              2. Qual o objetivo principal? *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {OBJECTIVES.map(({ value, label, desc, icon: Icon, color }) => {
                const isSelected = objective === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setObjective(value)}
                    className={`
                      p-4 rounded-xl text-left transition-all duration-200
                      border-2 hover:scale-[1.02] active:scale-[0.98]
                      ${isSelected 
                        ? 'border-current shadow-lg' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }
                    `}
                    style={{
                      borderColor: isSelected ? color : undefined,
                      backgroundColor: isSelected ? `${color}15` : undefined,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon size={16} color={isSelected ? color : "#9ca3af"} />
                      <span className="text-sm font-bold" style={{ color: isSelected ? color : undefined }}>
                        {label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Campo 3: Público-Alvo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              3. Para quem você está vendendo? *
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         focus:border-[#FD8F06] focus:ring-2 focus:ring-[#FD8F06]/20 outline-none
                         transition-all duration-200 resize-none"
              rows={3}
              placeholder="Ex: Empreendedores de 25-45 anos que querem escalar suas vendas online, moram em capitais, renda média-alta..."
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
              💡 Quanto mais específico, melhor a IA consegue personalizar o copy
            </p>
          </div>

          {/* Campos Opcionais */}
          <details className="group">
            <summary className="cursor-pointer text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-[#FD8F06] transition-colors">
              + Informações adicionais (opcional - a IA preenche se vazio)
            </summary>
            <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  URL do Produto / Landing Page
                </label>
                <input
                  type="url"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:border-[#FD8F06] focus:ring-1 focus:ring-[#FD8F06]/20 outline-none
                             transition-all duration-200 text-sm"
                  placeholder="https://seusite.com/produto"
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Preço (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:border-[#FD8F06] focus:ring-1 focus:ring-[#FD8F06]/20 outline-none
                             transition-all duration-200 text-sm"
                  placeholder="197.00"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Diferencial Único (USP)
                </label>
                <textarea
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:border-[#FD8F06] focus:ring-1 focus:ring-[#FD8F06]/20 outline-none
                             transition-all duration-200 resize-none text-sm"
                  rows={2}
                  placeholder="O que torna seu produto único? Ex: Garantia de 30 dias, Suporte 24/7..."
                  value={productUsp}
                  onChange={(e) => setProductUsp(e.target.value)}
                />
              </div>
            </div>
          </details>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700
                         text-gray-700 dark:text-gray-300 font-semibold
                         hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !productName.trim() || !targetAudience.trim()}
              className="flex-[2] px-6 py-3 rounded-xl font-semibold text-white
                         bg-gradient-to-r from-[#FD8F06] to-[#990099]
                         hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                         transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Criando e gerando opções...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Criar e Gerar 3 Opções com IA
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
