"use client";

import { ImageSlider } from "@/components/media/ImageSlider";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { formatEventDate } from "@/lib/utils";
import { PRESET_BACKGROUNDS } from "@/lib/presetBackgrounds";
import { overlayConfig } from "@/lib/templateData";
import type {
  MediaType,
  BackgroundType,
  PresetBackgroundId,
  FontFamilyId,
  CountdownStyleId,
} from "@/lib/types";
import type { TemplateItem, TemplateElementId } from "@/lib/templateData";

const FONT_VARS: Record<FontFamilyId, string> = {
  cormorant: "var(--font-cormorant)",
  inter: "var(--font-inter)",
  dancing: "var(--font-dancing)",
  playfair: "var(--font-playfair)",
};

export interface LayoutProps {
  variant?: "preview" | "live";
  brideName?: string;
  groomName?: string;
  /** Computed main title (e.g. "Ayşe & Mehmet" or "Fatma" for baby shower). Overrides brideName & groomName when set. */
  mainTitle?: string;
  eventDate?: string;
  eventTime?: string;
  venueName?: string;
  venueAddress?: string;
  googleMapsUrl?: string;
  rsvpEnabled?: boolean;
  overlayStrength?: "light" | "medium" | "dark";
  mediaUrls?: string[];
  mediaType?: MediaType;
  backgroundType?: BackgroundType;
  presetBackground?: PresetBackgroundId;
  fontFamily?: FontFamilyId;
  textColor?: string;
  countdownStyle?: CountdownStyleId;
  fontSizeScale?: number;
  titleFontSize?: number;
  namesFontSize?: number;
  noteFontSize?: number;
  countdownFontSize?: number;
  titleFontFamily?: FontFamilyId;
  namesFontFamily?: FontFamilyId;
  noteFontFamily?: FontFamilyId;
  titleText?: string;
  noteText?: string;
  showFamilyNames?: boolean;
  showAvatar?: boolean;
  avatarUrl1?: string;
  avatarUrl2?: string;
  avatarShape?: "circle" | "square" | "rounded";
  showCountdown?: boolean;
  showNote?: boolean;
  showVenue?: boolean;
  showReminderButton?: boolean;
  showScrollIndicator?: boolean;
  showSubtitle?: boolean;
  showDate?: boolean;
  familyNames?: {
    brideMotherName: string;
    brideFatherName: string;
    groomMotherName: string;
    groomFatherName: string;
    brideFamilySurname: string;
    groomFamilySurname: string;
  };
  template: TemplateItem & { bg: string };
  /** Category-specific: Mevlüt sebebi */
  mevlutReason?: string;
  /** Category-specific: Baba adı (Sünnet) */
  fatherName?: string;
  /** Category-specific: Kurum adı (Toplantı) */
  organizationName?: string;
  /** Category-specific: Anne adı (legacy) */
  motherName?: string;
  /** Category-specific: Aile ismi (Sünnet) */
  sunnet_parentNames?: string;
  /** Check if element should be rendered (from categoryFields.templateElements) */
  hasElement?: (el: TemplateElementId) => boolean;
}

export function getFontStyle(fontFamily: FontFamilyId) {
  return { fontFamily: FONT_VARS[fontFamily] ?? "var(--font-cormorant)" };
}

interface BackgroundLayerProps {
  mediaType?: MediaType;
  mediaUrls?: string[];
  backgroundType?: BackgroundType;
  presetBackground?: PresetBackgroundId;
  templateBg: string;
}

export function LayoutBackgroundLayer({
  mediaType,
  mediaUrls,
  backgroundType,
  presetBackground,
  templateBg,
}: BackgroundLayerProps) {
  if (backgroundType === "preset" && presetBackground) {
    const preset = PRESET_BACKGROUNDS.find((p) => p.id === presetBackground);
    if (preset) {
      return <div className="absolute inset-0" style={preset.style} />;
    }
  }
  if (mediaType === "slider" && mediaUrls && mediaUrls.length > 0) {
    return (
      <div className="absolute inset-0">
        <ImageSlider images={mediaUrls} />
      </div>
    );
  }
  if ((mediaType === "image" || !mediaType) && mediaUrls?.[0]) {
    return (
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mediaUrls[0]}
          crossOrigin="anonymous"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    );
  }
  const bgImageUrl = templateBg && templateBg.trim() ? templateBg : null;
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        backgroundImage: bgImageUrl ? `url(${bgImageUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        ...(bgImageUrl ? {} : { background: "linear-gradient(135deg, #2c1810, #4a2c1a)" }),
      }}
    />
  );
}

export function LayoutOverlay({
  strength,
}: {
  strength: keyof typeof overlayConfig;
}) {
  const oc = overlayConfig[strength];
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div style={{ position: "absolute", inset: 0, background: oc.base }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to top, ${oc.bottom} 0%, rgba(0,0,0,0.2) 40%, transparent 65%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "35%",
          background: `linear-gradient(to bottom, ${oc.top} 0%, transparent 100%)`,
        }}
      />
    </div>
  );
}

export function SharedCountdown({
  eventDate,
  countdownStyle,
  textColor,
  countdownFontSize,
  variant = "classic",
}: {
  eventDate?: string;
  countdownStyle?: CountdownStyleId;
  textColor?: string;
  countdownFontSize?: number;
  variant?: "classic" | "modern" | "bohemian";
}) {
  return (
    <CountdownTimer
      eventDate={eventDate}
      variant={variant}
      countdownStyle={countdownStyle}
      textColor={textColor}
      countdownFontSize={countdownFontSize}
    />
  );
}

export function getAvatarBorderRadius(shape?: "circle" | "square" | "rounded"): string {
  if (shape === "square") return "8px";
  if (shape === "rounded") return "16px";
  return "50%";
}

export function AvatarPair({
  avatarUrl1,
  avatarUrl2,
  accent,
  avatarShape,
}: {
  avatarUrl1?: string;
  avatarUrl2?: string;
  accent?: string;
  avatarShape?: "circle" | "square" | "rounded";
}) {
  if (!avatarUrl1) return null;
  const borderColor = accent || "white";
  const borderRadius = getAvatarBorderRadius(avatarShape);
  const commonStyle = {
    border: `3px solid ${borderColor}`,
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    borderRadius,
  };
  if (avatarUrl2) {
    return (
      <div className="flex justify-center items-center gap-0" style={{ margin: "12px 0" }}>
        <div className="w-20 h-20 overflow-hidden flex-shrink-0" style={commonStyle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatarUrl1} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="w-20 h-20 overflow-hidden flex-shrink-0 -ml-2.5" style={commonStyle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatarUrl2} alt="" className="w-full h-full object-cover" />
        </div>
      </div>
    );
  }
  return (
    <div className="w-20 h-20 overflow-hidden flex-shrink-0 my-3 mx-auto" style={commonStyle}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={avatarUrl1} alt="" className="w-full h-full object-cover" />
    </div>
  );
}

export function SingleAvatar({
  avatarUrl,
  accent,
  emoji,
  size = 80,
  avatarShape,
}: {
  avatarUrl?: string;
  accent?: string;
  emoji?: string | string[];
  size?: number;
  avatarShape?: "circle" | "square" | "rounded";
}) {
  const borderColor = accent || "white";
  const displayEmoji = Array.isArray(emoji) ? emoji[0] : emoji;
  const borderRadius = getAvatarBorderRadius(avatarShape);
  return (
    <div
      className="overflow-hidden flex-shrink-0 flex items-center justify-center bg-black/30"
      style={{
        width: size,
        height: size,
        border: `3px solid ${borderColor}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        borderRadius,
      }}
    >
      {avatarUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        <span className="text-3xl">{displayEmoji || "👤"}</span>
      )}
    </div>
  );
}

export function EventDetailsSection({
  eventDate,
  eventTime,
  venueName,
  venueAddress,
  googleMapsUrl,
}: {
  eventDate?: string;
  eventTime?: string;
  venueName?: string;
  venueAddress?: string;
  googleMapsUrl?: string;
}) {
  const formattedDate = formatEventDate(eventDate ?? "");
  return (
    <div style={{ background: "white", padding: "40px 24px", textAlign: "center" }}>
      <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "24px" }}>Etkinlik Detayları</h3>
      <div style={{ border: "1px solid #eee", borderRadius: "16px", padding: "20px", marginBottom: "16px" }}>
        <div style={{ fontSize: "32px", marginBottom: "8px" }}>📅</div>
        <div style={{ fontSize: "16px", fontWeight: 500 }}>{formattedDate || "-"}</div>
        <div style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>{eventTime || "-"}</div>
      </div>
      <div style={{ border: "1px solid #eee", borderRadius: "16px", padding: "20px", marginBottom: "16px" }}>
        <div style={{ fontSize: "32px", marginBottom: "8px" }}>📍</div>
        <div style={{ fontSize: "16px", fontWeight: 500 }}>{venueName || "-"}</div>
        <div style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>{venueAddress || "-"}</div>
        {googleMapsUrl && (
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: "12px",
              padding: "8px 20px",
              background: "#111",
              color: "white",
              borderRadius: "20px",
              fontSize: "13px",
              textDecoration: "none",
            }}
          >
            Konuma Git →
          </a>
        )}
      </div>
      <button
        type="button"
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          background: "white",
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        📅 Takvime Ekle
      </button>
    </div>
  );
}

export function RSVPSection() {
  return (
    <div style={{ background: "#fafafa", padding: "40px 24px" }}>
      <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px", textAlign: "center" }}>Katılım Bildirimi</h3>
      <p style={{ fontSize: "14px", color: "#666", textAlign: "center", marginBottom: "24px" }}>Lütfen katılım durumunuzu bildirin</p>
      <input
        placeholder="Ad Soyad"
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: "10px",
          border: "1px solid #ddd",
          fontSize: "14px",
          marginBottom: "12px",
          boxSizing: "border-box",
        }}
      />
      <input
        type="number"
        placeholder="Kaç kişi geliyorsunuz?"
        min={1}
        max={10}
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: "10px",
          border: "1px solid #ddd",
          fontSize: "14px",
          marginBottom: "12px",
          boxSizing: "border-box",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
        <button
          type="button"
          style={{ padding: "12px", borderRadius: "10px", border: "1px solid #ddd", background: "white", fontSize: "14px", cursor: "pointer" }}
        >
          🎉 Evet, Geliyorum
        </button>
        <button
          type="button"
          style={{ padding: "12px", borderRadius: "10px", border: "1px solid #ddd", background: "white", fontSize: "14px", cursor: "pointer" }}
        >
          😔 Maalesef Gelemiyorum
        </button>
        <button
          type="button"
          style={{ padding: "12px", borderRadius: "10px", border: "1px solid #ddd", background: "white", fontSize: "14px", cursor: "pointer" }}
        >
          🤔 Henüz Bilmiyorum
        </button>
      </div>
      <textarea
        placeholder="Not ekleyin (opsiyonel)"
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: "10px",
          border: "1px solid #ddd",
          fontSize: "14px",
          marginBottom: "12px",
          boxSizing: "border-box",
          minHeight: "80px",
          resize: "none",
        }}
      />
      <button
        type="button"
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          background: "#111",
          color: "white",
          fontSize: "15px",
          fontWeight: 600,
          cursor: "pointer",
          border: "none",
        }}
      >
        Bildirimi Gönder
      </button>
    </div>
  );
}

export function FooterSection() {
  return (
    <div style={{ background: "white", padding: "24px", textAlign: "center", borderTop: "1px solid #eee" }}>
      <p style={{ fontSize: "12px", color: "#999" }}>Bu davetiye <strong>DigitalDavetiyem.com</strong> ile oluşturuldu</p>
    </div>
  );
}

export function FamilyNamesBlock({
  showFamilyNames,
  familyNames,
  colorStyle,
}: {
  showFamilyNames?: boolean;
  familyNames?: LayoutProps["familyNames"];
  colorStyle?: React.CSSProperties;
}) {
  if (!showFamilyNames || !familyNames) return null;
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-[280px] mb-6 text-center shrink-0">
      <div className="text-[12px] leading-relaxed whitespace-pre-line" style={{ opacity: 0.85, ...colorStyle }}>
        {[familyNames.brideFatherName, familyNames.brideMotherName]
          .filter(Boolean)
          .join(" & ")}
        {familyNames.brideFamilySurname
          ? `\n${familyNames.brideFamilySurname} Ailesi`
          : ""}
      </div>
      <div className="text-[12px] leading-relaxed whitespace-pre-line" style={{ opacity: 0.85, ...colorStyle }}>
        {[familyNames.groomFatherName, familyNames.groomMotherName]
          .filter(Boolean)
          .join(" & ")}
        {familyNames.groomFamilySurname
          ? `\n${familyNames.groomFamilySurname} Ailesi`
          : ""}
      </div>
    </div>
  );
}
