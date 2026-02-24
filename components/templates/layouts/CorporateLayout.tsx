"use client";

import { formatEventDateTime } from "@/lib/utils";
import {
  LayoutProps,
  LayoutBackgroundLayer,
  LayoutOverlay,
  SharedCountdown,
  getFontStyle,
} from "./LayoutShared";

export function CorporateLayout({
  variant = "preview",
  eventDate = "",
  eventTime = "15:00",
  venueName = "",
  titleFontSize = 12,
  namesFontSize = 28,
  noteFontSize = 13,
  titleFontFamily = "inter",
  namesFontFamily = "inter",
  noteFontFamily = "inter",
  titleText = "Yıllık Strateji Toplantısı",
  noteText = "Sizi aramızda görmekten mutluluk duyarız",
  mainTitle,
  textColor = "#FFFFFF",
  showNote = true,
  showVenue = true,
  showReminderButton = true,
  showScrollIndicator = true,
  showCountdown = true,
  countdownStyle,
  countdownFontSize = 20,
  overlayStrength,
  mevlutReason,
  organizationName,
  sunnet_parentNames,
  showSubtitle = true,
  showDate = true,
  hasElement,
  template,
  mediaType,
  mediaUrls,
  backgroundType,
  presetBackground,
}: LayoutProps) {
  const dateTimeStr = formatEventDateTime(eventDate, eventTime);
  const titleFontStyle = getFontStyle(titleFontFamily);
  const namesFontStyle = getFontStyle(namesFontFamily);
  const noteFontStyle = getFontStyle(noteFontFamily);
  const colorStyle = { color: textColor };
  const accent = template.accent;
  const he = (el: string) => hasElement?.(el as never) ?? true;

  return (
    <div className="relative min-h-[844px]">
      <LayoutBackgroundLayer
        mediaType={mediaType}
        mediaUrls={mediaUrls}
        backgroundType={backgroundType}
        presetBackground={presetBackground}
        templateBg={template.bg}
      />
      <LayoutOverlay strength={overlayStrength ?? template.overlayStrength} />
      <div
        className="absolute inset-0 flex flex-col justify-center items-start pl-10 pr-10 text-left pointer-events-auto"
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)", ...colorStyle }}
      >
        {he("subtitle") && showSubtitle !== false && (
          <p
            className="text-xs uppercase tracking-widest shrink-0 mb-3"
            style={{
              letterSpacing: "3px",
              fontSize: `${titleFontSize}px`,
              fontWeight: 600,
              ...titleFontStyle,
            }}
          >
            {titleText}
          </p>
        )}
        {he("mainTitle") && (
          <h1
            className="font-semibold shrink-0 mb-4"
            style={{
              lineHeight: "1.2",
              fontSize: `${namesFontSize}px`,
              ...namesFontStyle,
            }}
          >
            {mainTitle || "Etkinlik"}
          </h1>
        )}
        {template.category === "Sünnet" && sunnet_parentNames && (
          <p style={{ fontSize: 14, opacity: 0.85, marginBottom: 8, textShadow: "0 1px 4px rgba(0,0,0,0.8)", color: textColor }}>
            {sunnet_parentNames}
          </p>
        )}
        {template.category === "Toplantı" && organizationName && organizationName !== mainTitle && (
          <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 8, color: textColor, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
            {organizationName}
          </p>
        )}
        {template.category === "Mevlüt" && mevlutReason && (
          <p style={{ fontSize: 13, fontStyle: "italic", opacity: 0.85, marginBottom: 8, color: textColor, textShadow: "0 1px 4px rgba(0,0,0,0.8)", maxWidth: 300, textAlign: "center", lineHeight: 1.5 }}>
            {mevlutReason}
          </p>
        )}
        {he("organizationName") && organizationName && (
          <p className="text-sm opacity-90 mb-3 shrink-0" style={noteFontStyle}>
            {organizationName}
          </p>
        )}
        {he("mevlutReason") && mevlutReason && (
          <p className="text-sm italic opacity-85 mb-3 shrink-0 max-w-[300px]" style={noteFontStyle}>
            {mevlutReason}
          </p>
        )}
        {he("divider") && (
          <div
            className="w-20 h-0.5 shrink-0 mb-4"
            style={{ backgroundColor: accent }}
          />
        )}
        {he("note") && showNote !== false && noteText && (
          <p
            className="text-sm opacity-90 mb-3 shrink-0 max-w-[300px]"
            style={{ ...noteFontStyle, fontSize: noteFontSize || 13 }}
          >
            {noteText}
          </p>
        )}
        {he("date") && dateTimeStr && showDate !== false && (
          <p className="text-sm font-medium mb-1 shrink-0" style={{ letterSpacing: "0.5px" }}>
            📅 {dateTimeStr}
          </p>
        )}
        {he("venue") && showVenue !== false && venueName && (
          <p className="text-sm opacity-90 shrink-0">
            📍 {venueName}
          </p>
        )}
        {he("countdown") && showCountdown !== false && (
          <div className="mt-4 mb-2 shrink-0">
            <SharedCountdown
              eventDate={eventDate}
              countdownStyle={countdownStyle}
              textColor={textColor}
              countdownFontSize={countdownFontSize}
              variant="classic"
            />
          </div>
        )}
        {he("reminderBtn") && showReminderButton !== false && (
          <button
            type="button"
            className="mt-8 px-6 py-3 text-sm font-medium rounded-lg shrink-0"
            style={{
              backgroundColor: accent,
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Katılımı Onayla
          </button>
        )}
        {variant !== "live" && he("scrollIndicator") && showScrollIndicator !== false && (
          <p className="text-[10px] opacity-50 shrink-0 mt-6">Yukarı kaydırınız.</p>
        )}
      </div>
    </div>
  );
}
