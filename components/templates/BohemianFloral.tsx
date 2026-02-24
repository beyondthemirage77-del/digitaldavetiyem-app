"use client";

import type { CSSProperties } from "react";
import { ImageSlider } from "@/components/media/ImageSlider";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { formatEventDateTime, formatEventDate } from "@/lib/utils";
import { PRESET_BACKGROUNDS } from "@/lib/presetBackgrounds";
import type {
  MediaType,
  BackgroundType,
  PresetBackgroundId,
  FontFamilyId,
  CountdownStyleId,
} from "@/lib/types";

const FONT_VARS: Record<FontFamilyId, string> = {
  cormorant: "var(--font-cormorant)",
  inter: "var(--font-inter)",
  dancing: "var(--font-dancing)",
  playfair: "var(--font-playfair)",
};

interface InvitationTemplateProps {
  variant?: "preview" | "live";
  brideName?: string;
  groomName?: string;
  eventDate?: string;
  eventTime?: string;
  venueName?: string;
  venueAddress?: string;
  googleMapsUrl?: string;
  rsvpEnabled?: boolean;
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
  countdownFontSize?: number;
  titleFontFamily?: FontFamilyId;
  namesFontFamily?: FontFamilyId;
  noteFontFamily?: FontFamilyId;
  titleText?: string;
  noteText?: string;
  showFamilyNames?: boolean;
  avatarUrl1?: string;
  avatarUrl2?: string;
  familyNames?: {
    brideMotherName: string;
    brideFatherName: string;
    groomMotherName: string;
    groomFatherName: string;
    brideFamilySurname: string;
    groomFamilySurname: string;
  };
}

const DEFAULT_BG =
  "linear-gradient(135deg, #3d1a1a, #5c2d2d, #3d1a1a)";

function FloralWreathIcon({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white"
    >
      <path
        d="M24 8c0 0-4 4-4 8s2 6 4 8c2-2 4-4 4-8s-2-6-4-8z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M40 24c0 0-4 4-8 4s-6-2-8-4c2 2 4 4 8 4s6-2 8-4z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M24 40c0 0 4-4 4-8s-2-6-4-8c-2 2-4 4-4 8s2 6 4 8z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M8 24c0 0 4-4 8-4s6 2 8 4c-2-2-4-4-8-4s-6 2-8 4z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M16 16c2-2 4-2 6 0M32 16c-2-2-4-2-6 0M16 32c2 2 4 2 6 0M32 32c-2 2-4 2-6 0"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle
        cx="24"
        cy="24"
        r="6"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  );
}

function BackgroundLayer({
  mediaType,
  mediaUrls,
  backgroundType,
  presetBackground,
}: Pick<
  InvitationTemplateProps,
  "mediaType" | "mediaUrls" | "backgroundType" | "presetBackground"
>) {
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
        <img src={mediaUrls[0]} alt="" className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className="absolute inset-0"
      style={{ background: DEFAULT_BG }}
    />
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars -- fontFamily, fontSizeScale reserved for future use */
export function BohemianFloral({
  variant = "preview",
  brideName = "Ad",
  groomName = "Soyad",
  eventDate = "",
  eventTime = "15:00",
  venueName = "",
  venueAddress = "",
  googleMapsUrl = "",
  rsvpEnabled = false,
  mediaUrls = [],
  mediaType = "image",
  backgroundType = "upload",
  presetBackground = "cream",
  fontFamily = "dancing",
  textColor = "#FFFFFF",
  countdownStyle = "classic",
  fontSizeScale = 1.0,
  titleFontSize = 12,
  namesFontSize: namesFontSizeProp = 38,
  countdownFontSize = 24,
  titleFontFamily = "inter",
  namesFontFamily = "cormorant",
  noteFontFamily = "cormorant",
  titleText = "Nikahımıza Davetlisiniz",
  noteText = "Bu mutlu günümüzü sizinle paylaşmak istiyoruz",
  showFamilyNames = false,
  avatarUrl1,
  avatarUrl2,
  familyNames,
}: InvitationTemplateProps) {
  const dateTimeStr = formatEventDateTime(eventDate, eventTime);
  const titleFontStyle = { fontFamily: FONT_VARS[titleFontFamily] };
  const namesFontStyle = { fontFamily: FONT_VARS[namesFontFamily] };
  const noteFontStyle = { fontFamily: FONT_VARS[noteFontFamily] };
  const colorStyle = { color: textColor };

  if (mediaType === "video" && mediaUrls?.[0]) {
    const videoContainerStyle: CSSProperties = {
      width: "390px",
      height: "844px",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    };
    const videoTopStyle: CSSProperties = {
      width: "100%",
      height: "422px",
      overflow: "hidden",
      flexShrink: 0,
    };
    const videoTextColor = textColor || "#ffffff";
    const videoBottomStyle: CSSProperties = {
      width: "100%",
      height: "422px",
      flexShrink: 0,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      padding: "12px 20px",
      boxSizing: "border-box",
      backgroundColor: "#5c2d2d",
      color: videoTextColor,
    };
    return (
      <div style={videoContainerStyle}>
        <div style={videoTopStyle}>
          <VideoPlayer src={mediaUrls[0]} />
        </div>
        <div style={videoBottomStyle}>
          <p
            style={{
              fontSize: `${namesFontSizeProp || 22}px`,
              margin: 0,
              textAlign: "center",
              flexShrink: 0,
              fontWeight: 700,
              color: videoTextColor,
              ...namesFontStyle,
            }}
          >
            {brideName} & {groomName}
          </p>
          <div
            style={{
              height: "1px",
              width: "40px",
              backgroundColor: "#E8B4B8",
              flexShrink: 0,
            }}
          />
          {dateTimeStr && (
            <p
              style={{
                fontSize: "11px",
                margin: 0,
                flexShrink: 0,
                letterSpacing: "1px",
                color: videoTextColor,
              }}
            >
              {dateTimeStr}
            </p>
          )}
          {venueName && (
            <p style={{ fontSize: "11px", margin: 0, flexShrink: 0, opacity: 0.8, color: videoTextColor }}>
              {venueName}
            </p>
          )}
          <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
            <CountdownTimer
              eventDate={eventDate}
              variant="bohemian"
              countdownStyle={countdownStyle}
              textColor={videoTextColor}
              compact
              compactVariant="video"
              countdownFontSize={countdownFontSize || 16}
            />
          </div>
          <button
            type="button"
            style={{
              fontSize: "11px",
              padding: "4px 14px",
              margin: 0,
              flexShrink: 0,
              border: `1px solid ${videoTextColor}`,
              borderRadius: 9999,
              backgroundColor: "transparent",
              color: videoTextColor,
              cursor: "pointer",
            }}
          >
            Hatırlatıcı Al
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = formatEventDate(eventDate);

  return (
    <div style={{ width: "390px", overflow: "hidden" }}>
      {/* Hero section */}
      <div style={{ position: "relative", minHeight: "844px" }}>
      <BackgroundLayer
        mediaType={mediaType}
        mediaUrls={mediaUrls}
        backgroundType={backgroundType}
        presetBackground={presetBackground}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)",
        }}
      />
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center pointer-events-auto"
        style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)", ...colorStyle }}
      >
        <div className="mb-4 shrink-0">
          <FloralWreathIcon />
        </div>
        <p
          className="text-xs uppercase tracking-[0.2em] shrink-0"
          style={{
            letterSpacing: "3px",
            fontSize: `${titleFontSize}px`,
            marginBottom: "8px",
            lineHeight: "1.2",
            overflow: "hidden",
            ...titleFontStyle,
          }}
        >
          {titleText}
        </p>
        <h1
          className="font-bold shrink-0"
          style={{
            lineHeight: "1.1",
            fontSize: `${namesFontSizeProp}px`,
            marginTop: "0",
            marginBottom: "1rem",
            ...namesFontStyle,
          }}
        >
          {brideName} & {groomName}
        </h1>
        {avatarUrl1 && (
          avatarUrl2 ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "12px 0" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", border: "3px solid white", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.3)", flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatarUrl1} alt="" className="w-full h-full object-cover" />
              </div>
              <div style={{ width: 80, height: 80, borderRadius: "50%", border: "3px solid white", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.3)", marginLeft: -10, flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatarUrl2} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          ) : (
            <div style={{ width: 80, height: 80, borderRadius: "50%", border: "3px solid white", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.3)", margin: "12px auto", flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={avatarUrl1} alt="" className="w-full h-full object-cover" />
            </div>
          )
        )}
        <div
          className="w-20 h-px my-4 shrink-0"
          style={{ backgroundColor: "#E8B4B8" }}
        />
        <p
          className="text-sm italic opacity-90 mb-3 shrink-0"
          style={noteFontStyle}
        >
          {noteText}
        </p>
        {dateTimeStr && (
          <p className="text-base mb-2 shrink-0" style={{ letterSpacing: "1px" }}>
            {dateTimeStr}
          </p>
        )}
        {venueName && (
          <p className="text-sm opacity-80 mb-6 shrink-0">{venueName}</p>
        )}
        <div className="mb-6 shrink-0">
          <CountdownTimer
            eventDate={eventDate}
            variant="bohemian"
            countdownStyle={countdownStyle}
            textColor={textColor}
            countdownFontSize={countdownFontSize}
          />
        </div>
        {showFamilyNames && familyNames && (
          <div className="grid grid-cols-2 gap-4 w-full max-w-[280px] mb-6 text-center shrink-0">
            <div className="text-[12px] leading-relaxed whitespace-pre-line" style={{ opacity: 0.85 }}>
              {[familyNames.brideFatherName, familyNames.brideMotherName]
                .filter(Boolean)
                .join(" & ")}
              {familyNames.brideFamilySurname
                ? `\n${familyNames.brideFamilySurname} Ailesi`
                : ""}
            </div>
            <div className="text-[12px] leading-relaxed whitespace-pre-line" style={{ opacity: 0.85 }}>
              {[familyNames.groomFatherName, familyNames.groomMotherName]
                .filter(Boolean)
                .join(" & ")}
              {familyNames.groomFamilySurname
                ? `\n${familyNames.groomFamilySurname} Ailesi`
                : ""}
            </div>
          </div>
        )}
        <button
          type="button"
          className="px-6 py-2 text-sm border border-current rounded-full mb-6 hover:bg-white/10 transition-colors shrink-0"
        >
          Hatırlatıcı Al
        </button>
        <div
          className="text-2xl mb-1 shrink-0"
          style={{ animation: "bounce-arrow 1.5s ease-in-out infinite" }}
        >
          ↓
        </div>
        <p className="text-[10px] opacity-50 shrink-0">Yukarı kaydırınız.</p>
      </div>
      </div>

      {/* Section 2 - Etkinlik Detayları (preview only) */}
      {variant !== "live" && (
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
      )}

      {/* Section 3 - RSVP (preview only) */}
      {variant !== "live" && rsvpEnabled && (
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
      )}

      {/* Section 4 - Footer (preview only) */}
      {variant !== "live" && (
      <div style={{ background: "white", padding: "24px", textAlign: "center", borderTop: "1px solid #eee" }}>
        <p style={{ fontSize: "12px", color: "#999" }}>Bu davetiye <strong>DigitalDavetiyem.com</strong> ile oluşturuldu</p>
      </div>
      )}
    </div>
  );
}
