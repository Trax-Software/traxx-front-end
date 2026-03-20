"use client";

import { CopyOption } from "@/app/services/campaigns";
import { generateCampaignImage } from "@/app/services/ai";
import { CheckCircle, Image as ImageIcon, Sparkles, Upload, X } from "lucide-react";
import { useState } from "react";

type Props = {
  campaignId: string;
  selectedCopy: CopyOption;
  productName: string;
  onComplete: () => void;
  onSkip: () => void;
};

export function ProductImageUploadModal({ campaignId, selectedCopy, productName, onComplete, onSkip }: Props) {
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 5MB.');
      return;
    }

    setProductImage(file);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setProductImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveImage() {
    setProductImage(null);
    setProductImagePreview(null);
  }

  async function handleGenerate() {
    setGenerating(true);
    setError(null);

    try {
      // Monta um prompt inteligente baseado no copy escolhido
      const prompt = buildImagePrompt();
      
      await generateCampaignImage({
        prompt,
        campaignId,
      });

      onComplete();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Erro ao gerar imagem. Verifique seus créditos.');
    } finally {
      setGenerating(false);
    }
  }

  function buildImagePrompt(): string {
    // Constrói um prompt profissional baseado no copy e framework escolhido
    const basePrompt = `Imagem publicitária profissional para: ${productName}.`;
    
    let styleGuide = '';
    switch (selectedCopy.framework) {
      case 'AIDA':
        styleGuide = 'Estilo chamativo e vibrante que captura atenção imediatamente. Cores vivas, composição dinâmica.';
        break;
      case 'PAS':
        styleGuide = 'Estilo que mostra transformação e solução. Antes/depois implícito, iluminação que transmite esperança.';
        break;
      case 'FAB':
        styleGuide = 'Estilo clean e profissional que destaca características. Fundo minimalista, foco no produto.';
        break;
      default:
        styleGuide = 'Estilo moderno e profissional.';
    }

    const technicalSpecs = 'Alta qualidade, 4K, iluminação profissional, composição publicitária.';
    
    if (productImagePreview) {
      return `${basePrompt} ${styleGuide} Incorpore elementos da imagem do produto fornecida. ${technicalSpecs}`;
    } else {
      return `${basePrompt} ${styleGuide} Crie uma representação visual atraente do produto. ${technicalSpecs}`;
    }
  }

  return (
    <div className="fixed inset-0 z-[1002] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-200 dark:border-gray-800 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-800 px-8 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FD8F06]/20 to-[#990099]/20 flex items-center justify-center">
                <ImageIcon size={24} className="text-[#FD8F06]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Gerar Imagem da Campanha
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  A IA vai criar uma imagem profissional baseada no copy escolhido
                </p>
              </div>
            </div>
            <button
              onClick={onSkip}
              disabled={generating}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-6">
          
          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex gap-3">
              <Sparkles size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-1">
                  Copy Selecionado: {selectedCopy.framework}
                </h3>
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                  <strong>"{selectedCopy.headline}"</strong> - A IA vai criar uma imagem que complementa perfeitamente este copy.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          {/* Upload Area */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Foto do Produto (Opcional)
            </label>
            
            {!productImagePreview ? (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 hover:border-[#FD8F06] hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Upload size={28} className="text-gray-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Clique para fazer upload ou arraste aqui
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        PNG, JPG ou WEBP até 5MB
                      </p>
                    </div>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                <img
                  src={productImagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                >
                  <X size={18} />
                </button>
                <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-sm">
                  <p className="text-xs text-white font-medium flex items-center gap-1.5">
                    <CheckCircle size={14} />
                    Imagem carregada
                  </p>
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              💡 {productImagePreview 
                ? 'A IA vai usar esta imagem como referência para criar o criativo final.' 
                : 'Sem imagem, a IA vai criar uma representação visual baseada na descrição do produto.'}
            </p>
          </div>

          {/* Preview do Prompt */}
          <details className="group">
            <summary className="cursor-pointer text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-[#FD8F06] transition-colors">
              🔍 Ver prompt que será enviado para a IA
            </summary>
            <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-mono leading-relaxed">
                {buildImagePrompt()}
              </p>
            </div>
          </details>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onSkip}
              disabled={generating}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700
                         text-gray-700 dark:text-gray-300 font-semibold
                         hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pular por Agora
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="flex-[2] px-6 py-3 rounded-xl font-semibold text-white
                         bg-gradient-to-r from-[#FD8F06] to-[#990099]
                         hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                         transition-all duration-200 flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Gerando Imagem...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Gerar Imagem com IA
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
