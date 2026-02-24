"use client";

import { formatEventDateTime } from "@/lib/utils";
import {
  LayoutProps,
  LayoutBackgroundLayer,
  LayoutOverlay,
  SharedCountdown,
  AvatarPair,
  FamilyNamesBlock,
  getFontStyle,
} from "./LayoutShared";

function DovesIcon({ size = 48 }: { size?: number }) {
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
        d="M20 36c-4-2-6-6-6-10 0-2 1-4 3-5-2 1-3 3-3 5 0 4 2 8 6 10z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M28 36c4-2 6-6 6-10 0-2-1-4-3-5 2 1 3 3 3 5 0 4-2 8-6 10z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <ellipse cx="20" cy="24" rx="4" ry="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <ellipse cx="28" cy="24" rx="4" ry="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M16 18l2-4M32 18l-2-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function CenteredLayout({
  variant = "preview",
  eventDate = "",
  eventTime = "15:00",
  venueName = "",
  titleFontSize = 12,
  namesFontSize = 38,
  noteFontSize = 13,
  countdownFontSize = 24,
  titleFontFamily = "inter",
  namesFontFamily = "cormorant",
  noteFontFamily = "cormorant",
  titleText = "Nikahımıza Davetlisiniz",
  noteText = "Bu mutlu günümüzü sizinle paylaşmak istiyoruz",
  mainTitle,
  textColor = "#FFFFFF",
  countdownStyle,
  showFamilyNames,
  showAvatar = true,
  avatarUrl1,
  avatarUrl2,
  avatarShape = "circle",
  showCountdown = true,
  showNote = true,
  showVenue = true,
  showReminderButton = true,
  showScrollIndicator = true,
  familyNames,
  overlayStrength,
  mevlutReason,
  fatherName,
  organizationName,
  motherName,
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
        className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center pointer-events-auto"
        style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)", ...colorStyle }}
      >
        {he("icon") && (
          <div className="mb-4 shrink-0">
            <DovesIcon />
          </div>
        )}
        {he("subtitle") && showSubtitle !== false && (
          <p
            className="text-xs uppercase tracking-[0.2em] shrink-0"
            style={{
              letterSpacing: "3px",
              fontSize: `${titleFontSize}px`,
              marginBottom: "8px",
              lineHeight: "1.2",
              ...titleFontStyle,
            }}
          >
            {titleText}
          </p>
        )}
        {he("avatar") && showAvatar && <AvatarPair avatarUrl1={avatarUrl1} avatarUrl2={avatarUrl2} accent={accent} avatarShape={avatarShape} />}
        {he("mainTitle") && (
          <h1
            className="font-light italic shrink-0"
            style={{
              lineHeight: "1.1",
              fontSize: `${namesFontSize}px`,
              marginTop: "0",
              marginBottom: "1rem",
              ...namesFontStyle,
            }}
          >
            {mainTitle || "Ad & Soyad"}
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
        {he("parentNames") && (fatherName || motherName) && (
          <p className="text-sm opacity-90 mb-2 shrink-0" style={noteFontStyle}>
            {[fatherName && `Baba: ${fatherName}`, motherName && `Anne: ${motherName}`].filter(Boolean).join(" • ")}
          </p>
        )}
        {he("organizationName") && organizationName && (
          <p className="text-sm opacity-90 mb-2 shrink-0" style={noteFontStyle}>
            {organizationName}
          </p>
        )}
        {he("mevlutReason") && mevlutReason && (
          <p className="text-sm italic opacity-85 mb-2 shrink-0" style={noteFontStyle}>
            {mevlutReason}
          </p>
        )}
        {he("divider") && (
          <div
            className="w-20 h-px my-4 shrink-0"
            style={{ backgroundColor: accent }}
          />
        )}
        {he("note") && showNote !== false && noteText && (
          <p
            className="text-sm italic opacity-90 mb-3 shrink-0"
            style={{ ...noteFontStyle, fontSize: noteFontSize }}
          >
            {noteText}
          </p>
        )}
        {he("date") && dateTimeStr && showDate !== false && (
          <p className="text-base mb-2 shrink-0" style={{ letterSpacing: "1px" }}>
            {dateTimeStr}
          </p>
        )}
        {he("venue") && showVenue !== false && venueName && (
          <p className="text-sm opacity-80 mb-6 shrink-0">{venueName}</p>
        )}
        {he("countdown") && showCountdown !== false && (
          <div className="mb-6 shrink-0">
            <SharedCountdown
              eventDate={eventDate}
              countdownStyle={countdownStyle}
              textColor={textColor}
              countdownFontSize={countdownFontSize}
              variant="classic"
            />
          </div>
        )}
        <FamilyNamesBlock
          showFamilyNames={showFamilyNames}
          familyNames={familyNames}
          colorStyle={colorStyle}
        />
        {he("reminderBtn") && showReminderButton !== false && (
          <button
            type="button"
            className="px-6 py-2 text-sm border border-current rounded-full mb-6 hover:bg-white/10 transition-colors shrink-0"
          >
            Hatırlatıcı Al
          </button>
        )}
        {variant !== "live" && he("scrollIndicator") && showScrollIndicator !== false && (
          <>
            <div
              className="text-2xl mb-1 shrink-0"
              style={{ animation: "bounce-arrow 1.5s ease-in-out infinite" }}
            >
              ↓
            </div>
            <p className="text-[10px] opacity-50 shrink-0">Yukarı kaydırınız.</p>
          </>
        )}
      </div>
    </div>
  );
}
