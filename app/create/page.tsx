"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AuthGuard } from "@/components/AuthGuard";
import { useWizardStore } from "@/store/wizardStore";
import { TemplateStep } from "@/components/editor/steps/TemplateStep";
import { DetailsStep } from "@/components/editor/steps/DetailsStep";
import { CustomizeStep } from "@/components/steps/CustomizeStep";

const STEPS: { id: string; label: string }[] = [
  { id: "template", label: "Şablon" },
  { id: "details", label: "Bilgiler" },
  { id: "preview", label: "Özelleştir" },
  { id: "payment", label: "Yayınla" },
];

export default function CreatePage() {
  const { currentStep, setStep } = useWizardStore();
  const stepIndex = Math.max(0, STEPS.findIndex((s) => s.id === currentStep));

  const goNext = () => {
    const next = STEPS[stepIndex + 1];
    if (next) setStep(next.id as "template" | "details" | "preview" | "payment");
  };

  const goBack = () => {
    const prev = STEPS[stepIndex - 1];
    if (prev) setStep(prev.id as "template" | "details" | "preview" | "payment");
  };

  return (
    <AuthGuard>
      <div
        className={`flex flex-col bg-[#fafaf8] ${currentStep === "preview" ? "overflow-hidden" : "min-h-screen"}`}
        style={
          {
            "--wizard-header-h": "113px",
            height:
              currentStep === "preview"
                ? "calc(100vh - 56px)"
                : undefined,
          } as React.CSSProperties
        }
      >
        {/* Progress bar */}
        <div className="shrink-0 z-10 bg-white/90 backdrop-blur-sm border-b border-[#f0f0f0] px-4 py-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between gap-3 mb-2">
              {STEPS.map((step, i) => (
                <span
                  key={step.id}
                  className={`text-sm sm:text-base font-medium truncate ${
                    i <= stepIndex ? "text-[#171717]" : "text-[#a3a3a3]"
                  }`}
                  style={{ flex: 1 }}
                >
                  {step.label}
                </span>
              ))}
            </div>
            <div className="h-1 bg-[#e5e5e5] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#171717] rounded-full"
                initial={false}
                animate={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </div>
          </div>
        </div>

        {/* Step content — preview step bypasses max-width for full split layout */}
        {currentStep === "preview" ? (
          <div className="flex-1 min-h-0 overflow-hidden w-full">
            <CustomizeStep onBack={goBack} />
          </div>
        ) : (
          <div
            className={`flex-1 mx-auto px-4 sm:px-6 w-full pb-24 ${currentStep === "template" ? "max-w-7xl" : "max-w-4xl"} ${currentStep === "details" ? "py-4 sm:py-6" : "py-8 sm:py-12"}`}
          >
            <AnimatePresence mode="wait">
              {currentStep === "template" && (
                <motion.div
                  key="template"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <TemplateStep onNext={goNext} />
                </motion.div>
              )}
              {currentStep === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <DetailsStep onNext={goNext} onBack={goBack} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
