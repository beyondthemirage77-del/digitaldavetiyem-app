"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { TEMPLATES } from "@/lib/templateData";
import { ScalableTemplatePreview } from "@/components/ScalableTemplatePreview";

const STEPS = [
  {
    id: 1,
    title: "Şablonu Seç",
    desc: "Düğün, nişan, doğum günü... 24+ şablondan birini seçin",
    icon: "🎨",
  },
  {
    id: 2,
    title: "Bilgileri Gir",
    desc: "İsimler, tarih, mekan ve davetiye notunuzu ekleyin",
    icon: "✏️",
  },
  {
    id: 3,
    title: "Özelleştir",
    desc: "Fotoğraf, müzik, geri sayım ve renkleri kişiselleştirin",
    icon: "✨",
  },
  {
    id: 4,
    title: "Yayınla & Paylaş",
    desc: "WhatsApp'tan paylaşın, RSVP bildirimlerini takip edin",
    icon: "🚀",
  },
];

function StepScreenTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="absolute inset-0 bg-[#fafaf8] flex flex-col"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[#e5e5e5] bg-white/90">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 mx-4 rounded-lg bg-[#f0f0f0] px-3 py-1.5 text-[10px] text-[#888]">
          digitaldavetiyem.com/create
        </div>
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

function Screen1TemplateSelection() {
  return (
    <StepScreenTemplate>
      <div className="p-3 h-full overflow-hidden flex flex-col">
        <div className="mb-2">
          <h3 className="text-[11px] font-semibold text-[#171717]">Şablonunuzu Seçin</h3>
          <p className="text-[9px] text-[#737373]">Davetiyeniz için en uygun şablonu seçin</p>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {["Tümü", "Düğün", "Nişan", "Parti"].map((tab, i) => (
            <button
              key={tab}
              type="button"
              className="px-2 py-1 rounded-full text-[8px] font-medium"
              style={{
                background: i === 0 ? "#111" : "white",
                color: i === 0 ? "white" : "#525252",
                border: `1px solid ${i === 0 ? "#111" : "#e5e5e5"}`,
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <div
          className="grid gap-2 flex-1 min-h-0 overflow-hidden"
          style={{
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gridTemplateRows: "repeat(2, minmax(0, 1fr))",
          }}
        >
          {TEMPLATES.slice(0, 8).map((t) => (
            <div key={t.id} className="relative rounded-xl overflow-hidden min-h-0 min-w-0">
              <ScalableTemplatePreview template={t} className="w-full h-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </StepScreenTemplate>
  );
}

function Screen2DetailsForm() {
  return (
    <StepScreenTemplate>
      <div className="p-3 h-full overflow-auto">
        <div className="mb-3">
          <h3 className="text-[11px] font-semibold text-[#171717]">Bilgileri Gir</h3>
          <p className="text-[9px] text-[#737373]">Davetiyenizde gösterilecek bilgileri girin</p>
        </div>
        <div className="space-y-2">
          {[
            { label: "Gelin Adı", placeholder: "Ayşe" },
            { label: "Damat Adı", placeholder: "Mehmet" },
            { label: "Düğün Tarihi", placeholder: "15.06.2026" },
            { label: "Saat", placeholder: "15:00" },
            { label: "Mekan Adı", placeholder: "Grand Hotel" },
            { label: "Adres", placeholder: "Beşiktaş, İstanbul" },
          ].map((f) => (
            <div key={f.label}>
              <label className="block text-[8px] font-medium text-[#525252] mb-0.5">{f.label}</label>
              <div
                className="w-full rounded-lg px-2 py-1.5 text-[9px] bg-[#f5f5f5] border border-transparent text-[#171717]"
                style={{ minHeight: 24 }}
              >
                {f.placeholder}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            className="flex-1 py-2 rounded-lg text-[9px] font-medium bg-white border border-[#e5e5e5] text-[#171717]"
          >
            ← Geri
          </button>
          <button
            type="button"
            className="flex-1 py-2 rounded-lg text-[9px] font-medium bg-[#171717] text-white"
          >
            Devam Et →
          </button>
        </div>
      </div>
    </StepScreenTemplate>
  );
}

function Screen3Customize() {
  return (
    <StepScreenTemplate>
      <div className="flex h-full">
        {/* Preview - phone with real template */}
        <div className="w-2/5 flex items-center justify-center p-2 bg-[#f5f5f5] min-w-0">
          <div
            className="relative rounded-xl overflow-hidden w-full max-w-[100px] shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
            style={{ aspectRatio: "9/16" }}
          >
            <ScalableTemplatePreview template={TEMPLATES[0]!} className="w-full h-full rounded-xl" />
          </div>
        </div>
        {/* Sidebar */}
        <div className="flex-1 p-2 border-l border-[#e5e5e5] overflow-auto">
          <div className="flex gap-1 mb-2">
            {["Medya", "Metin", "Öğeler"].map((t, i) => (
              <button
                key={t}
                type="button"
                className="px-2 py-1 rounded-lg text-[8px] font-medium"
                style={{
                  background: i === 0 ? "#111" : "transparent",
                  color: i === 0 ? "white" : "#666",
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-[8px] font-medium text-[#525252] mb-1">Kapak Fotoğrafı</p>
              <div className="rounded-lg border-2 border-dashed border-[#e5e5e5] p-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#f0f0f0] flex items-center justify-center">
                  <span className="text-[10px]">📷</span>
                </div>
                <span className="text-[8px] text-[#888]">Fotoğraf yükle</span>
              </div>
            </div>
            <div>
              <p className="text-[8px] font-medium text-[#525252] mb-1">Arka Plan Müziği</p>
              <div className="flex gap-1">
                {["Klasik", "Romantik", "Akustik"].map((m) => (
                  <div
                    key={m}
                    className="px-2 py-1 rounded text-[7px] border border-[#e5e5e5]"
                  >
                    {m}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[8px] text-[#525252]">Geri sayım</span>
              <div className="w-8 h-4 rounded-full bg-[#111]" />
            </div>
          </div>
        </div>
      </div>
    </StepScreenTemplate>
  );
}

function Screen4WhatsAppShare() {
  return (
    <div
      className="absolute inset-0 flex flex-col bg-[#e5ddd5]"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      {/* Phone status bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#075e54] text-white">
        <span className="text-[10px] font-medium">9:41</span>
        <div className="flex gap-0.5">
          <span className="text-[10px]">📶</span>
          <span className="text-[10px]">🔋</span>
        </div>
      </div>
      {/* WhatsApp header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#075e54]">
        <div className="w-6 h-6 rounded-full bg-white/20" />
        <div className="flex-1">
          <p className="text-[10px] font-medium text-white">Davetiye Grubu</p>
          <p className="text-[8px] text-white/80">Çevrimiçi</p>
        </div>
      </div>
      {/* Chat */}
      <div className="flex-1 p-3 overflow-hidden flex flex-col justify-end">
        <div className="flex justify-end">
          <div
            className="max-w-[85%] rounded-lg px-3 py-2"
            style={{
              background: "#d9fdd3",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            <div className="rounded-lg overflow-hidden border border-[#e0e0e0] bg-white mb-1">
              <div
                className="relative w-full min-h-[90px]"
                style={{ aspectRatio: "9/16" }}
              >
                <ScalableTemplatePreview template={TEMPLATES[0]!} className="w-full h-full" />
              </div>
              <p className="text-[7px] text-[#666] px-2 py-1 text-center">digitaldavetiyem.com/ayse-mehmet</p>
            </div>
            <p className="text-[8px] text-[#667781]">9:42</p>
          </div>
        </div>
        <div className="flex justify-end mt-1">
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#25d366]">
            <span className="text-[10px]">📤</span>
            <span className="text-[9px] font-medium text-white">WhatsApp&apos;ta Paylaş</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const SCREENS = [
  Screen1TemplateSelection,
  Screen2DetailsForm,
  Screen3Customize,
  Screen4WhatsAppShare,
];

export function HowItWorksSteps() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isInView]);

  const ScreenComponent = SCREENS[activeStep];

  return (
    <section
      id="ozellikler"
      className="py-24 px-4 sm:px-6 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #FAF9F7 0%, #f5f4f2 50%, #FAF9F7 100%)" }}
    >
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{
              background: "rgba(201,162,39,0.12)",
              color: "#8B6914",
              border: "1px solid rgba(201,162,39,0.25)",
            }}
          >
            Nasıl Çalışır?
          </div>
          <h2
            className="font-[family-name:var(--font-cormorant)] font-bold text-[#171717] mb-4"
            style={{ fontSize: "clamp(28px, 4vw, 42px)" }}
          >
            Uygulama Tanıtımı
          </h2>
          <p className="text-[#666] max-w-xl mx-auto" style={{ fontSize: "17px", lineHeight: 1.6 }}>
            Davetiye oluşturma sürecini adım adım keşfedin
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
          {/* Steps list */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-3">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -24 }}
                animate={
                  isInView
                    ? {
                        opacity: 1,
                        x: 0,
                        scale: activeStep === i ? 1.02 : 1,
                      }
                    : {}
                }
                transition={{
                  duration: 0.4,
                  delay: i * 0.08,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className={`relative rounded-2xl p-5 cursor-default transition-shadow ${
                  activeStep === i ? "shadow-lg ring-2 ring-[#C9A227]/40" : "shadow-md hover:shadow-lg"
                }`}
                style={{
                  background: activeStep === i ? "white" : "rgba(255,255,255,0.9)",
                  border: "1px solid " + (activeStep === i ? "rgba(201,162,39,0.3)" : "#eee"),
                }}
                onMouseEnter={() => setActiveStep(i)}
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-lg"
                    style={{
                      background:
                        activeStep === i
                          ? "linear-gradient(135deg, #C9A227 0%, #8B6914 100%)"
                          : "#f0f0f0",
                      color: activeStep === i ? "white" : "#666",
                    }}
                  >
                    {step.icon}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: "#C9A227" }}
                    >
                      Adım {step.id}
                    </span>
                    <h3 className="font-semibold text-[#171717] text-[15px] leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-[#666] text-[13px] leading-snug mt-0.5">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Demo screen - laptop/phone frame */}
          <motion.div
            className="flex-1 w-full min-w-0 flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div
              className="relative w-full"
              style={{
                aspectRatio: "16/10",
                maxWidth: 520,
              }}
            >
              <AnimatePresence mode="wait">
                {activeStep === 3 ? (
                  /* Phone frame for WhatsApp - centered in same aspect area, offset down to avoid header overlap */
                  <motion.div
                    key="phone"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.35 }}
                    className="absolute inset-0 flex items-center justify-center pt-8"
                  >
                    <div
                      className="rounded-[32px] overflow-hidden shadow-[0_24px_60px_-12px_rgba(0,0,0,0.25)]"
                      style={{
                        width: 220,
                        aspectRatio: "9/19",
                        border: "10px solid #1a1a1a",
                        background: "#111",
                      }}
                    >
                      <div className="relative w-full h-full overflow-hidden rounded-[22px]">
                        <Screen4WhatsAppShare />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* Laptop/browser frame for steps 1-3 */
                  <motion.div
                    key={`browser-${activeStep}`}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.35 }}
                    className="absolute inset-0 rounded-xl overflow-hidden shadow-[0_24px_60px_-12px_rgba(0,0,0,0.2)]"
                    style={{
                      border: "12px solid #2a2a2a",
                      background: "#111",
                    }}
                  >
                    <div className="relative w-full h-full overflow-hidden rounded-t">
                      <ScreenComponent />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.p
              className="text-center text-sm text-[#888] mt-4"
              animate={{ opacity: isInView ? 1 : 0 }}
              transition={{ delay: 0.5 }}
            >
              {activeStep === 0 && "Şablon seçim ekranı"}
              {activeStep === 1 && "Bilgi giriş formu"}
              {activeStep === 2 && "Özelleştirme paneli"}
              {activeStep === 3 && "WhatsApp paylaşım görünümü"}
            </motion.p>
          </motion.div>
        </div>

        <motion.div
          className="text-center mt-14"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <Link
            href="/create"
            className="inline-flex items-center gap-2 text-white font-semibold rounded-[14px] hover:bg-[#333] transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              padding: "16px 32px",
              fontSize: "16px",
              background: "#111",
              boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
            }}
          >
            Hemen Başla
            <span className="text-lg">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
