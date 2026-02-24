"use client";

import type { TemplateItem } from "@/lib/templateData";
import { overlayConfig } from "@/lib/templateData";

interface TemplateCardContentProps {
  template: TemplateItem & { bg: string };
  /** When true, show full template scaled to fit (for compact previews). Default false = zoomed 1.5x */
  compact?: boolean;
}

/** Zoom for card preview (landing + TemplateStep). 1.5 = fonts ~1.5x larger. CustomizeStep uses TemplateRenderer, not this. */
const CARD_ZOOM = 1.5;

export function TemplateCardContent({ template: t, compact = false }: TemplateCardContentProps) {
  const oc = overlayConfig[t.overlayStrength] ?? overlayConfig.medium;
  const zoom = compact ? 1 : CARD_ZOOM;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: `${100 / zoom}%`,
        height: `${100 / zoom}%`,
        transform: `scale(${zoom})`,
        transformOrigin: "top left",
      }}
    >
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={t.bg}
        alt={t.name}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.5s ease",
        }}
      />
      {/* Base overlay */}
      <div style={{ position: "absolute", inset: 0, background: oc.base }} />
      {/* Bottom gradient */}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${oc.bottom} 0%, rgba(0,0,0,0.2) 40%, transparent 65%)` }} />
      {/* Top gradient */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "35%", background: `linear-gradient(to bottom, ${oc.top} 0%, transparent 100%)` }} />
      {/* Category badge */}
      <span
        style={{
          position: "absolute",
          top: "14px",
          left: "14px",
          fontSize: "11px",
          color: "white",
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(6px)",
          padding: "3px 10px",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.25)",
          textShadow: "0 1px 8px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)",
          zIndex: 10,
        }}
      >
        {t.category}
      </span>
      {/* Content by cardStyle */}
      {t.cardStyle === "klasik" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px", textAlign: "center" }}>
          <span style={{ fontSize: "20px", marginBottom: "8px", color: "rgba(255,255,255,0.9)", textShadow: "0 1px 8px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)" }}>∞</span>
          <p style={{ color: "rgba(255,255,255,0.95)", fontSize: "9px", letterSpacing: "3px", marginBottom: "6px", textShadow: "0 1px 8px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)" }}>NİKAHIMIZA DAVETLİSİNİZ</p>
          <h3 style={{ color: "white", fontSize: "18px", fontFamily: "var(--font-cormorant)", fontStyle: "italic", textShadow: "0 2px 12px rgba(0,0,0,1), 0 1px 4px rgba(0,0,0,1)", margin: "0 0 8px" }}>{t.couple}</h3>
          <div style={{ width: "40px", height: "1px", background: "#C9A96E", margin: "0 auto 8px" }} />
          <p style={{ color: "rgba(255,255,255,0.95)", fontSize: "9px", textShadow: "0 1px 8px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)" }}>15 Haziran 2026</p>
          <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
            {["12", "05", "30", "45"].map((n, i) => (
              <div key={i} style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "4px", padding: "3px 5px", color: "white", fontSize: "9px", fontWeight: "600" }}>{n}</div>
            ))}
          </div>
        </div>
      )}
      {t.cardStyle === "modern" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "16px" }}>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "8px", letterSpacing: "2px", marginBottom: "4px", textShadow: "0 1px 8px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)" }}>SAVE THE DATE</p>
          <h3 style={{ color: "white", fontSize: "20px", fontFamily: "var(--font-playfair)", fontWeight: "700", margin: "0 0 4px", textShadow: "0 2px 12px rgba(0,0,0,1), 0 1px 4px rgba(0,0,0,1)" }}>{t.couple}</h3>
          <div style={{ width: "30px", height: "2px", background: "white", margin: "6px 0" }} />
          <p style={{ color: "rgba(255,255,255,0.95)", fontSize: "9px", marginBottom: "10px", textShadow: "0 1px 8px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)" }}>15 Haziran 2026 · İstanbul</p>
          <div style={{ display: "flex", gap: "4px" }}>
            {["12G", "05S", "30D"].map((n, i) => (
              <div key={i} style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "4px", padding: "3px 6px", color: "white", fontSize: "9px", fontWeight: "700" }}>{n}</div>
            ))}
          </div>
        </div>
      )}
      {t.cardStyle === "bohem" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px", textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "8px", letterSpacing: "2px", marginBottom: "12px", textShadow: "0 1px 8px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)" }}>~ birlikte ~</p>
          <h3 style={{ color: "white", fontSize: "22px", fontFamily: "var(--font-dancing)", textShadow: "0 2px 12px rgba(0,0,0,1), 0 1px 4px rgba(0,0,0,1)", margin: "0 0 8px" }}>{t.couple}</h3>
          <p style={{ color: "rgba(255,255,255,0.95)", fontSize: "9px", marginBottom: "10px", fontStyle: "italic", textShadow: "0 1px 8px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)" }}>Bu mutlu günümüzü paylaşın</p>
          <p style={{ color: "rgba(255,255,255,0.95)", fontSize: "9px", border: "1px solid rgba(255,255,255,0.3)", padding: "3px 10px", borderRadius: "10px", textShadow: "0 1px 8px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)" }}>15 Haziran 2026</p>
        </div>
      )}
      {t.cardStyle === "nisan" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px", textAlign: "center" }}>
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "2px solid white", background: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>👰</div>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "2px solid white", background: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", marginLeft: "-10px" }}>🤵</div>
          </div>
          <p style={{ color: "rgba(255,255,255,0.95)", fontSize: "8px", letterSpacing: "2px", marginBottom: "4px", textShadow: "0 1px 8px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)" }}>NİŞANIMIZA DAVETLİSİNİZ</p>
          <h3 style={{ color: "white", fontSize: "16px", fontFamily: "var(--font-cormorant)", fontStyle: "italic", margin: "0 0 6px", textShadow: "0 2px 12px rgba(0,0,0,1), 0 1px 4px rgba(0,0,0,1)" }}>{t.couple}</h3>
          <p style={{ color: "rgba(255,255,255,0.95)", fontSize: "9px", textShadow: "0 1px 8px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)" }}>20 Temmuz 2026</p>
        </div>
      )}
      {t.cardStyle === "babyshower" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px", textAlign: "center" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", marginBottom: "10px" }}>👶</div>
          <h3 style={{ color: "white", fontSize: "15px", fontFamily: "var(--font-dancing)", margin: "0 0 4px", textShadow: "0 2px 12px rgba(0,0,0,1), 0 1px 4px rgba(0,0,0,1)" }}>{t.couple}</h3>
          <p style={{ color: "rgba(255,255,255,0.95)", fontSize: "9px", marginBottom: "8px", textShadow: "0 1px 8px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)" }}>Baby Shower Partisi</p>
          <p style={{ color: "rgba(255,255,255,0.95)", fontSize: "9px", border: "1px solid rgba(255,255,255,0.3)", padding: "3px 10px", borderRadius: "10px", textShadow: "0 1px 8px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)" }}>5 Temmuz 2026</p>
        </div>
      )}
      {t.cardStyle === "cinsiyet" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px", textAlign: "center" }}>
          <p style={{ fontSize: "24px", marginBottom: "8px" }}>💙🩷</p>
          <h3 style={{ color: "white", fontSize: "15px", fontFamily: "var(--font-dancing)", margin: "0 0 6px", textShadow: "0 2px 12px rgba(0,0,0,1), 0 1px 4px rgba(0,0,0,1)" }}>{t.couple}</h3>
          <p style={{ color: "rgba(255,255,255,0.95)", fontSize: "9px", marginBottom: "8px", textShadow: "0 1px 8px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)" }}>Cinsiyeti birlikte öğrenelim!</p>
          <div style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "10px", padding: "6px 14px" }}>
            <p style={{ color: "white", fontSize: "9px", fontWeight: "600", margin: 0, textShadow: "0 1px 8px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)" }}>10 Ağustos 2026</p>
          </div>
        </div>
      )}
      {t.cardStyle === "mevlut" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px", textAlign: "center" }}>
          <p style={{ fontSize: "20px", marginBottom: "8px" }}>☪️</p>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "8px", letterSpacing: "2px", marginBottom: "6px", textShadow: "0 1px 8px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)" }}>MEVLİDİMİZE DAVETLİSİNİZ</p>
          <h3 style={{ color: "white", fontSize: "15px", fontFamily: "var(--font-cormorant)", margin: "0 0 6px", textShadow: "0 2px 12px rgba(0,0,0,1), 0 1px 4px rgba(0,0,0,1)" }}>Ahmet Yılmaz</h3>
          <div style={{ width: "30px", height: "1px", background: "rgba(255,255,255,0.6)", margin: "0 auto 6px" }} />
          <p style={{ color: "rgba(255,255,255,0.95)", fontSize: "9px", textShadow: "0 1px 8px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)" }}>22 Mart 2026 · Cuma</p>
        </div>
      )}
      {t.cardStyle === "dogumgunu" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px", textAlign: "center" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", marginBottom: "8px" }}>🎂</div>
          <h3 style={{ color: "white", fontSize: "16px", fontFamily: "var(--font-dancing)", margin: "0 0 4px", textShadow: "0 2px 12px rgba(0,0,0,1), 0 1px 4px rgba(0,0,0,1)" }}>{t.couple}</h3>
          <p style={{ color: "rgba(255,255,255,0.95)", fontSize: "9px", marginBottom: "8px", textShadow: "0 1px 8px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)" }}>Doğum Günü Partisi 🎉</p>
          <p style={{ color: "rgba(255,255,255,0.95)", fontSize: "9px", textShadow: "0 1px 8px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)" }}>1 Eylül 2026</p>
        </div>
      )}
      {t.cardStyle === "kurumsal" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "16px" }}>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "8px", letterSpacing: "3px", marginBottom: "6px", textShadow: "0 1px 8px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)" }}>KURUMSAL ETKİNLİK</p>
          <h3 style={{ color: "white", fontSize: "13px", fontFamily: "var(--font-inter)", fontWeight: "600", margin: "0 0 6px", textShadow: "0 2px 12px rgba(0,0,0,1), 0 1px 4px rgba(0,0,0,1)" }}>{t.couple}</h3>
          <div style={{ width: "20px", height: "1px", background: "rgba(255,255,255,0.6)", margin: "0 0 6px" }} />
          <p style={{ color: "rgba(255,255,255,0.95)", fontSize: "9px", textShadow: "0 1px 8px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)" }}>15 Mart 2026 · 09:00</p>
        </div>
      )}
      {t.cardStyle === "kina" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px", textAlign: "center" }}>
          <p style={{ fontSize: "18px", marginBottom: "8px" }}>🌹</p>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "8px", letterSpacing: "2px", marginBottom: "6px", textShadow: "0 1px 8px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)" }}>KINA GECEMİZE DAVETLİSİNİZ</p>
          <h3 style={{ color: "white", fontSize: "18px", fontFamily: "var(--font-dancing)", margin: "0 0 6px", textShadow: "0 2px 12px rgba(0,0,0,1), 0 1px 4px rgba(0,0,0,1)" }}>{t.couple}</h3>
          <div style={{ width: "40px", height: "1px", background: "rgba(255,255,255,0.6)", margin: "0 auto 6px" }} />
          <p style={{ color: "rgba(255,255,255,0.95)", fontSize: "9px", textShadow: "0 1px 8px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)" }}>14 Haziran 2026 · Cumartesi</p>
        </div>
      )}
      {t.cardStyle === "sunnet" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px", textAlign: "center" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", marginBottom: "8px" }}>🕌</div>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "8px", letterSpacing: "2px", marginBottom: "4px", textShadow: "0 1px 8px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)" }}>SÜNNET TÖRENİMİZE</p>
          <h3 style={{ color: "white", fontSize: "16px", fontFamily: "var(--font-cormorant)", margin: "0 0 6px", textShadow: "0 2px 12px rgba(0,0,0,1), 0 1px 4px rgba(0,0,0,1)" }}>Ahmet&apos;in Sünneti</h3>
          <p style={{ color: "rgba(255,255,255,0.95)", fontSize: "9px", border: "1px solid rgba(255,255,255,0.3)", padding: "3px 10px", borderRadius: "10px", textShadow: "0 1px 8px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)" }}>20 Temmuz 2026</p>
        </div>
      )}
    </div>
  );
}
