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
};

export function WizardStepIndicator({ steps, currentStep }: Props) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        {steps.map((step, index) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    font-bold text-sm transition-all duration-300
                    ${isCompleted 
                      ? 'bg-gradient-to-br from-[#FD8F06] to-[#990099] text-white shadow-lg' 
                      : isActive
                      ? 'bg-gradient-to-br from-[#FD8F06] to-[#990099] text-white shadow-lg scale-110'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                    }
                  `}
                >
                  {isCompleted ? <Check size={18} /> : step.number}
                </div>
                <div className="mt-2 text-center">
                  <div
                    className={`
                      text-xs font-semibold transition-colors
                      ${isActive ? 'text-[#FD8F06]' : isCompleted ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600'}
                    `}
                  >
                    {step.label}
                  </div>
                  <div className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5 max-w-[80px]">
                    {step.description}
                  </div>
                </div>
              </div>
              {!isLast && (
                <div className="flex-1 h-0.5 mx-2 mb-8">
                  <div
                    className={`
                      h-full transition-all duration-500
                      ${isCompleted ? 'bg-gradient-to-r from-[#FD8F06] to-[#990099]' : 'bg-gray-200 dark:bg-gray-700'}
                    `}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
