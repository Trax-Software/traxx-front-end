"use client";

import { Campaign, CreateCampaignDto, createCampaign } from "@/app/services/campaigns";
import { Sparkles, X } from "lucide-react";
import { useState } from "react";
import { CreateCampaignStepper } from "./CreateCampaignStepper";
import { Step1StrategyBrand } from "./wizard-steps/Step1StrategyBrand";
import { Step2AIInputs } from "./wizard-steps/Step2AIInputs";
import { Step3Review } from "./wizard-steps/Step3Review";

type Props = {
  onClose: () => void;
  onCreated?: (c: Campaign) => void;
  onSuccess?: () => void;
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

export function CreateCampaignModal({ onClose, onCreated, onSuccess }: Props) {
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
      onCreated?.(created);
      onSuccess?.();
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

  const canAdvanceStep1 = form.name.trim().length >= 3;
  const isPrimaryDisabled = loading || (currentStep === 1 && !canAdvanceStep1);
  const primaryLabel =
    currentStep === 3
      ? loading
        ? "Criando Campanha..."
        : "Criar Campanha"
      : currentStep === 2
        ? "Próximo: Revisão"
        : "Próximo: Inputs da IA";
  const secondaryLabel = currentStep === 1 ? "Cancelar" : "Voltar";

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-0 backdrop-blur-sm animate-in fade-in duration-200 sm:p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Nova Campanha"
        onClick={(e) => e.stopPropagation()}
        className="flex h-[100dvh] w-full flex-col overflow-hidden border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-main)] animate-in zoom-in-95 duration-200 sm:h-auto sm:max-h-[85vh] sm:max-w-[960px] sm:rounded-[var(--radius-lg)] sm:shadow-[var(--shadow-sm)]"
      >
        <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--bg-surface)] px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--orange-light)]">
                <Sparkles size={20} className="text-[var(--brand-orange)]" />
              </div>
              <div>
                <h2 className="text-lg font-bold sm:text-xl">Nova Campanha</h2>
                <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{getStepTitle()}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] p-2 text-[var(--text-secondary)] transition hover:bg-[var(--bg-body)] hover:text-[var(--text-main)]"
              aria-label="Fechar modal"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-hidden">
          <div className="grid h-full min-h-0 lg:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="hidden border-r border-[var(--border)] bg-[var(--bg-body)] p-5 lg:block">
              <CreateCampaignStepper steps={WIZARD_STEPS} currentStep={currentStep} orientation="vertical" />
            </aside>

            <section className="flex min-h-0 flex-col">
              <div className="border-b border-[var(--border)] bg-[var(--bg-body)] px-4 py-3 lg:hidden">
                <CreateCampaignStepper steps={WIZARD_STEPS} currentStep={currentStep} />
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
                {error ? (
                  <div className="mb-5 rounded-[var(--radius-md)] border border-[var(--danger-text)] bg-[var(--danger-bg)] px-4 py-3 text-sm font-medium text-[var(--danger-text)]">
                    {error}
                  </div>
                ) : null}

                {currentStep === 1 ? (
                  <Step1StrategyBrand
                    form={form}
                    onUpdate={update}
                    onNext={handleNext}
                    onCancel={onClose}
                    error={error}
                    showActions={false}
                  />
                ) : null}

                {currentStep === 2 ? (
                  <Step2AIInputs
                    form={form}
                    onUpdate={update}
                    onNext={handleNext}
                    onBack={handleBack}
                    showActions={false}
                  />
                ) : null}

                {currentStep === 3 ? (
                  <Step3Review
                    form={form}
                    onBack={handleBack}
                    onSubmit={handleSubmit}
                    loading={loading}
                    showActions={false}
                  />
                ) : null}
              </div>
            </section>
          </div>
        </div>

        <footer className="sticky bottom-0 z-20 border-t border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={currentStep === 1 ? onClose : handleBack}
              disabled={loading}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] px-4 text-sm font-semibold text-[var(--text-main)] transition hover:bg-[var(--bg-body)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {secondaryLabel}
            </button>

            <button
              type="button"
              onClick={currentStep === 3 ? handleSubmit : handleNext}
              disabled={isPrimaryDisabled}
              className="inline-flex h-11 flex-[1.4] items-center justify-center rounded-[var(--radius-md)] px-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              style={{ background: "var(--brand-gradient)" }}
            >
              {primaryLabel}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
