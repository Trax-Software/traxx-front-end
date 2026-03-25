"use client";

import { CampaignObjective, CreateCampaignDto } from "@/app/services/campaigns";
import { Building2, ChevronRight, Facebook, Globe, Linkedin, Megaphone, ShoppingCart, Target, TrendingUp } from "lucide-react";

const OBJECTIVES: { value: CampaignObjective; label: string; desc: string; icon: React.ElementType; color: string }[] = [
  { value: "AWARENESS", label: "Reconhecimento", desc: "Ampliar alcance da marca", icon: Megaphone, color: "#8b5cf6" },
  { value: "TRAFFIC", label: "Tráfego", desc: "Levar pessoas ao site", icon: TrendingUp, color: "#3b82f6" },
  { value: "SALES", label: "Vendas", desc: "Gerar conversões", icon: ShoppingCart, color: "#16a34a" },
  { value: "LEADS", label: "Leads", desc: "Captar contatos", icon: Target, color: "#FD8F06" },
];

const PLATFORMS: { value: "META" | "GOOGLE" | "LINKEDIN"; label: string; desc: string; icon: React.ElementType; color: string }[] = [
  { value: "META", label: "Meta Ads", desc: "Facebook & Instagram", icon: Facebook, color: "#1877F2" },
  { value: "GOOGLE", label: "Google Ads", desc: "Search & Display", icon: Globe, color: "#EA4335" },
  { value: "LINKEDIN", label: "LinkedIn", desc: "B2B Professional", icon: Linkedin, color: "#0A66C2" },
];

type Props = {
  form: CreateCampaignDto;
  onUpdate: <K extends keyof CreateCampaignDto>(key: K, val: CreateCampaignDto[K]) => void;
  onNext: () => void;
  onCancel: () => void;
  error: string | null;
  showActions?: boolean;
};

export function Step1StrategyBrand({ form, onUpdate, onNext, onCancel, error, showActions = true }: Props) {
  const handleNext = () => {
    if (!form.name.trim()) {
      return;
    }
    if (form.name.trim().length < 3) {
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-semibold text-[var(--text-main)]">
          Nome da Campanha *
        </label>
        <input
          type="text"
          className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 text-[var(--text-main)] outline-none transition focus:border-[var(--brand-orange)] focus:shadow-[0_0_0_3px_var(--orange-light)]"
          placeholder="Ex: Lançamento Coleção Outono 2026"
          value={form.name}
          onChange={(e) => onUpdate("name", e.target.value)}
          autoFocus
        />
        {error && error.includes("nome") && (
          <p className="mt-1 text-xs text-[var(--danger-text)]">{error}</p>
        )}
      </div>

      <div>
        <label className="mb-3 block text-sm font-semibold text-[var(--text-main)]">
          Objetivo da Campanha *
        </label>
        <div className="grid grid-cols-2 gap-3">
          {OBJECTIVES.map(({ value, label, desc, icon: Icon, color }) => {
            const isSelected = form.objective === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => onUpdate("objective", value)}
                className={`
                  p-4 rounded-xl text-left transition-all duration-200
                  border-2 hover:scale-[1.02] active:scale-[0.98]
                  ${isSelected 
                    ? 'border-current shadow-lg' 
                    : 'border-[var(--border)] hover:border-[var(--brand-orange)]'
                  }
                `}
                style={{
                  borderColor: isSelected ? color : undefined,
                  backgroundColor: isSelected ? `${color}15` : "var(--bg-surface)",
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={16} color={isSelected ? color : "var(--text-secondary)"} />
                  <span className="text-sm font-bold" style={{ color: isSelected ? color : undefined }}>
                    {label}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">{desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="mb-3 block text-sm font-semibold text-[var(--text-main)]">
          Plataforma *
        </label>
        <div className="grid grid-cols-3 gap-3">
          {PLATFORMS.map(({ value, label, icon: Icon, color }) => {
            const isSelected = form.platform === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => onUpdate("platform", value)}
                className={`
                  p-4 rounded-xl text-center transition-all duration-200
                  border-2 hover:scale-[1.02] active:scale-[0.98]
                  ${isSelected 
                    ? 'border-current shadow-lg' 
                    : 'border-[var(--border)] hover:border-[var(--brand-orange)]'
                  }
                `}
                style={{
                  borderColor: isSelected ? color : undefined,
                  backgroundColor: isSelected ? `${color}15` : "var(--bg-surface)",
                }}
              >
                <Icon size={24} color={isSelected ? color : "var(--text-secondary)"} className="mx-auto mb-2" />
                <span className="block text-xs font-bold" style={{ color: isSelected ? color : "var(--text-main)" }}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[var(--text-main)]">
          Brand / Cliente
        </label>
        <div className="relative">
          <Building2 size={18} className="absolute left-4 top-3.5 text-[var(--text-secondary)]" />
          <input
            type="text"
            className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] py-3 pl-12 pr-4 text-[var(--text-main)] outline-none transition focus:border-[var(--brand-orange)] focus:shadow-[0_0_0_3px_var(--orange-light)]"
            placeholder="Ex: Nike, Coca-Cola, Acme Corp..."
            value={form.description || ""}
            onChange={(e) => onUpdate("description", e.target.value)}
          />
        </div>
        <p className="mt-1.5 text-xs text-[var(--text-secondary)]">
          Qual marca/cliente da sua agência está sendo promovida?
        </p>
      </div>

      {showActions ? (
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700
                       text-gray-700 dark:text-gray-300 font-semibold
                       hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!form.name.trim() || form.name.trim().length < 3}
            className="flex-[2] px-6 py-3 rounded-xl font-semibold text-white
                       bg-gradient-to-r from-[#FD8F06] to-[#990099]
                       hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                       transition-all duration-200 flex items-center justify-center gap-2"
          >
            Próximo: Inputs da IA
            <ChevronRight size={18} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
