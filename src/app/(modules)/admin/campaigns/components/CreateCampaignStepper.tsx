"use client";

import { Check } from "lucide-react";

type Step = {
  number: number;
  label: string;
  description: string;
};

type Props = {
  steps: Step[];
  currentStep: number;
  orientation?: "horizontal" | "vertical";
};

export function CreateCampaignStepper({ steps, currentStep, orientation = "horizontal" }: Props) {
  const isVertical = orientation === "vertical";

  return (
    <ol
      className={
        isVertical
          ? "flex flex-col gap-3"
          : "flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      }
    >
      {steps.map((step, index) => {
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;
        const isLast = index === steps.length - 1;

        const markerClass = isCompleted
          ? "border-transparent text-white"
          : isActive
            ? "border-[var(--brand-orange)] bg-[var(--orange-light)] text-[var(--brand-orange)]"
            : "border-[var(--border)] bg-[var(--bg-body)] text-[var(--text-secondary)]";

        const labelClass = isActive || isCompleted ? "text-[var(--text-main)]" : "text-[var(--text-secondary)]";

        return (
          <li key={step.number} className={isVertical ? "flex items-center gap-3" : "flex items-center gap-2"}>
            <div className={`flex items-center gap-3 ${isVertical ? "w-full" : ""}`}>
              <span
                className={`inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${markerClass}`}
                style={isCompleted ? { background: "var(--brand-gradient)" } : undefined}
              >
                {isCompleted ? <Check size={14} /> : step.number}
              </span>
              <span className={`min-w-0 ${labelClass}`}>
                <span className="block truncate text-xs font-semibold">{step.label}</span>
                <span className="block truncate text-[11px] text-[var(--text-secondary)]">{step.description}</span>
              </span>
            </div>
            {!isLast ? (
              <span
                className={isVertical ? "ml-4 h-5 w-px flex-shrink-0" : "h-px w-8 flex-shrink-0"}
                style={{
                  background: isCompleted ? "var(--brand-gradient)" : "var(--border)",
                }}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
