"use client";

import { useState } from "react";
import { useWizardStore } from "@/store/wizardStore";
import { TEMPLATES, CATEGORY_TABS, getTemplateById, getCategoryConfig } from "@/lib/templateData";
import { TemplateCardContent } from "@/components/TemplateCardContent";

export function TemplateStep({ onNext }: { onNext: () => void }) {
  const { formData, updateFormData } = useWizardStore();
  const [activeCategory, setActiveCategory] = useState<string>("Tümü");
  const [isNavigating, setIsNavigating] = useState(false);
  const selected = formData.templateId;

  const filtered = TEMPLATES.filter(
    (t) => activeCategory === "Tümü" || t.filterCategory === activeCategory
  );

  const handleSelectTemplate = (id: number) => {
    setIsNavigating(true);
    const tmpl = getTemplateById(id);
    const category = tmpl?.category ?? "Düğün";
    const config = getCategoryConfig(category);
    const te = config.templateElements ?? [];
    updateFormData({
      templateId: id,
      mainTitle: config.getMainTitle({ ...formData, templateId: id } as unknown as Record<string, string | undefined>),
      overlayStrength: tmpl?.overlayStrength ?? "dark",
      subtitle: config.defaultSubtitle,
      noteText: config.defaultNote,
      showSubtitle: te.includes("subtitle"),
      showAvatar: te.includes("avatar") && !!tmpl?.hasAvatar,
      showNote: te.includes("note"),
      showDate: te.includes("date"),
      showVenue: te.includes("venue"),
      showCountdown: te.includes("countdown"),
      showReminderButton: te.includes("reminderBtn"),
      showScrollIndicator: te.includes("scrollIndicator"),
      avatarShape: "circle",
    });
    onNext();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#171717] mb-2">
          Şablonunuzu Seçin
        </h2>
        <p className="text-[#737373]">Davetiyeniz için en uygun şablonu seçin</p>
      </div>

      {/* Category filter tabs */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          justifyContent: "center",
        }}
      >
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveCategory(tab)}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: 500,
              border: activeCategory === tab ? "2px solid #111" : "2px solid #e5e5e5",
              background: activeCategory === tab ? "#111" : "white",
              color: activeCategory === tab ? "white" : "#525252",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className={`mb-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 ${isNavigating ? "invisible" : ""}`}>
        {filtered.map((t) => {
          const isSelected = selected === t.id;
          return (
            <div key={t.id} className="flex flex-col gap-3">
              <div
                className="relative overflow-hidden rounded-3xl cursor-pointer w-full aspect-[9/16] transition-none"
                onMouseEnter={(e) => {
                  const img = e.currentTarget.querySelector("img");
                  if (img) (img as HTMLImageElement).style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  const img = e.currentTarget.querySelector("img");
                  if (img) (img as HTMLImageElement).style.transform = "scale(1)";
                }}
              >
                <TemplateCardContent template={t} />
                {isSelected && (
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: "rgba(34, 197, 94, 0.9)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: 14,
                      zIndex: 20,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    ✓
                  </div>
                )}
              </div>
              <p className="font-medium text-[#171717] text-sm text-center">{t.name}</p>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSelectTemplate(t.id);
                }}
                className="w-full bg-stone-900 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-stone-800 transition-colors"
              >
                Seç
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
