"use client";

import { Campaign, CreateCampaignDto, createCampaign } from "@/app/services/campaigns";
import { Sparkles, X } from "lucide-react";
import { useState } from "react";
import { WizardStepIndicator } from "./WizardStepIndicator";
import { Step1StrategyBrand } from "./wizard-steps/Step1StrategyBrand";
import { Step2AIInputs } from "./wizard-steps/Step2AIInputs";
import { Step3Review } from "./wizard-steps/Step3Review";

type Props = {
  onClose: () => void;
  onCreated: (c: Campaign) => void;
};

const INITIAL_FORM: CreateCampaignDto = {
  name: "",
  objective: "SALES",
  platform: "META",
  targetAudience: "",
  brandTone: "",
  keyBenefits: "",
  description: "",
  productCategory: "",
};

const WIZARD_STEPS = [
  { number: 1, label: "Estratégia", description: "Objetivo & Brand" },
  { number: 2, label: "IA Inputs", description: "Tom & Público" },
  { number: 3, label: "Revisar", description: "Confirmar & Gerar" },
];

export function CreateCampaignModal({ onClose, onCreated }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<CreateCampaignDto>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof CreateCampaignDto>(key: K, val: CreateCampaignDto[K]) {
    setForm((f) => ({ ...f, [key]: val }));
    setError(null);
  }

  function validateStep1(): boolean {
    if (!form.name.trim()) {
      setError("O nome da campanha é obrigatório.");
      return false;
    }
    if (form.name.trim().length < 3) {
      setError("O nome deve ter pelo menos 3 caracteres.");
      return false;
    }
    return true;
  }

  function handleNext() {
    if (currentStep === 1 && !validateStep1()) return;
    setCurrentStep((s) => s + 1);
    setError(null);
  }

  function handleBack() {
    setCurrentStep((s) => s - 1);
    setError(null);
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const created = await createCampaign(form);
      onCreated(created);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Erro ao criar campanha. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Defina a estratégia e a marca";
      case 2: return "Configure os inputs da IA";
      case 3: return "Revise e confirme os detalhes";
      default: return "";
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto
                   shadow-2xl border border-gray-200 dark:border-gray-800
                   animate-in zoom-in-95 duration-200"
      >
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FD8F06]/20 to-[#990099]/20 
                            flex items-center justify-center">
                <Sparkles size={24} className="text-[#FD8F06]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Nova Campanha
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {getStepTitle()}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 
                       transition-colors text-gray-500 hover:text-gray-700 
                       dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>

          <WizardStepIndicator steps={WIZARD_STEPS} currentStep={currentStep} />
        </div>

        <div className="px-8 py-6">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 
                          border-2 border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                {error}
              </p>
            </div>
          )}

          {currentStep === 1 && (
            <Step1StrategyBrand
              form={form}
              onUpdate={update}
              onNext={handleNext}
              onCancel={onClose}
              error={error}
            />
          )}

          {currentStep === 2 && (
            <Step2AIInputs
              form={form}
              onUpdate={update}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && (
            <Step3Review
              form={form}
              onBack={handleBack}
              onSubmit={handleSubmit}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
