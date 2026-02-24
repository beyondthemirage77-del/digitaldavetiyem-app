"use client";

import { useState } from "react";
import { useWizardStore } from "@/store/wizardStore";
import { getTemplateById, getCategoryConfig } from "@/lib/templateData";

export function DetailsStep({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const { formData, updateFormData } = useWizardStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedTemplate = getTemplateById(formData.templateId);
  const category = selectedTemplate?.category ?? "Düğün";
  const config = getCategoryConfig(category);
  const wizardFields = config.wizardFields;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    for (const field of wizardFields) {
      if (field.optional) continue;
      const value = formData[field.key as keyof typeof formData];
      const str = typeof value === "string" ? value.trim() : value != null ? String(value) : "";
      if (!str) {
        nextErrors[field.key] = `${field.label} gerekli`;
      }
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onNext();
  };

  const inputClass =
    "w-full rounded-[12px] bg-[#f5f5f5] border border-transparent focus:border-[#171717]/30 focus:bg-white focus:outline-none transition-all duration-300 text-[#171717] placeholder:text-[#a3a3a3]";
  const inputStyle = { padding: "10px 14px" };

  const handleFieldChange = (key: string, value: string) => {
    const updates: Record<string, string> = { [key]: value };
    const nextFormData = { ...formData, [key]: value } as unknown as Record<string, string | undefined>;
    // Ana Başlık'ı kategoriye göre güncelle
    if (
      (category === "Düğün" || category === "Nişan") &&
      (key === "wedding_brideName" || key === "wedding_groomName")
    ) {
      updates.mainTitle = config.getMainTitle(nextFormData);
    } else if (category === "Mevlüt" && key === "mevlut_hostName") {
      updates.mainTitle = config.getMainTitle(nextFormData);
    } else if (
      (category === "Parti" || category === "Doğum Günü") &&
      (key === "dogum_childName" || key === "dogum_age")
    ) {
      updates.mainTitle = config.getMainTitle(nextFormData);
    } else if (
      category === "Toplantı" &&
      (key === "toplanti_eventTitle" || key === "toplanti_organizationName")
    ) {
      updates.mainTitle = config.getMainTitle(nextFormData);
    } else if (category === "Kına" && key === "kina_brideName") {
      updates.mainTitle = config.getMainTitle(nextFormData);
    } else if (category === "Sünnet" && key === "sunnet_childName") {
      updates.mainTitle = config.getMainTitle(nextFormData);
    } else if (category === "Açılış" && key === "acilis_firmaAdi") {
      updates.mainTitle = config.getMainTitle(nextFormData);
    }
    updateFormData(updates);
  };

  const renderField = (
    field: (typeof wizardFields)[0],
    wrapStyle?: React.CSSProperties
  ) => {
    const value = formData[field.key as keyof typeof formData];
    const strValue = value !== undefined && value !== null ? String(value) : "";
    const hasError = !!errors[field.key];
    const baseClass = `${inputClass} ${hasError ? "border-red-400" : ""}`;
    const fieldEl = (
      <div key={field.key} style={{ marginBottom: 10, ...wrapStyle }}>
        <label
          className="block font-medium text-[#525252]"
          style={{ marginBottom: 4, fontSize: 12 }}
        >
          {field.label}
        </label>
        {field.asTextarea || field.key === "mevlut_reason" ? (
          <textarea
            rows={3}
            className={`${baseClass} resize-none`}
            style={inputStyle}
            placeholder={field.placeholder}
            value={strValue}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
          />
        ) : (
          <input
            type={field.type ?? "text"}
            className={baseClass}
            style={inputStyle}
            placeholder={field.placeholder}
            value={strValue}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
          />
        )}
        {hasError && (
          <p className="mt-1 text-sm text-red-600/90">{errors[field.key]}</p>
        )}
      </div>
    );
    return fieldEl;
  };

  const fieldKeys = wizardFields.map((f) => f.key);
  const dateTimeIdx = fieldKeys.indexOf("eventDate");
  const hasDateTime =
    dateTimeIdx >= 0 &&
    fieldKeys[dateTimeIdx + 1] === "eventTime";
  const venueIdx = fieldKeys.indexOf("venueName");
  const hasVenue =
    venueIdx >= 0 &&
    fieldKeys[venueIdx + 1] === "venueAddress";

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#171717] mb-2">
          Bilgileri Gir
        </h2>
        <p className="text-[#737373] text-sm">Davetiyenizde gösterilecek bilgileri girin</p>
      </div>

      <form onSubmit={handleSubmit}>
        {wizardFields.map((field, i) => {
          if (hasDateTime && field.key === "eventTime") return null;
          if (hasVenue && field.key === "venueAddress") return null;

          if (hasDateTime && field.key === "eventDate") {
            const timeField = wizardFields[i + 1]!;
            return (
              <div
                key="eventDate-eventTime"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                {renderField(field, { marginBottom: 0 })}
                {renderField(timeField, { marginBottom: 0 })}
              </div>
            );
          }
          if (hasVenue && field.key === "venueName") {
            const addrField = wizardFields[i + 1]!;
            return (
              <div
                key="venueName-venueAddress"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                {renderField(field, { marginBottom: 0 })}
                {renderField(addrField, { marginBottom: 0 })}
              </div>
            );
          }
          return renderField(field);
        })}

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-3 rounded-[12px] bg-white border border-[#e5e5e5] text-[#171717] font-medium hover:bg-[#fafafa] transition-all duration-300"
          >
            ← Geri
          </button>
          <button
            type="submit"
            className="flex-1 py-3 rounded-[12px] bg-[#171717] text-white font-medium transition-all duration-300 hover:scale-[0.98] active:scale-[0.96]"
          >
            Devam Et →
          </button>
        </div>
      </form>
    </div>
  );
}
