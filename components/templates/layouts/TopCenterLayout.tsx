"use client";

import { formatEventDateTime } from "@/lib/utils";
import {
  LayoutProps,
  LayoutBackgroundLayer,
  LayoutOverlay,
  SharedCountdown,
  SingleAvatar,
  AvatarPair,
  FamilyNamesBlock,
  getFontStyle,
} from "./LayoutShared";

export function TopCenterLayout({
  variant = "preview",
  eventDate = "",
  eventTime = "15:00",
  venueName = "",
  titleFontSize = 12,
  namesFontSize = 32,
  noteFontSize = 13,
  countdownFontSize = 20,
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
  const hasTwoAvatars = template.hasAvatar && template.avatarCount === 2;
  const he = (el: string) => hasElement?.(el as never) ?? true;

  return (
    <div className="relative min-h-[844px] flex flex-col">
      <LayoutBackgroundLayer
        mediaType={mediaType}
        mediaUrls={mediaUrls}
        backgroundType={backgroundType}
        presetBackground={presetBackground}
        templateBg={template.bg}
      />
      <LayoutOverlay strength={overlayStrength ?? template.overlayStrength} />
      <div
        className="absolute inset-0 flex flex-col items-center pt-16 px-8 text-center pointer-events-auto"
        style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)", ...colorStyle }}
      >
        {he("subtitle") && showSubtitle !== false && (
          <p
            className="text-xs uppercase tracking-[0.2em] shrink-0 mb-2"
            style={{
              letterSpacing: "3px",
              fontSize: `${titleFontSize}px`,
              lineHeight: "1.2",
              ...titleFontStyle,
            }}
          >
            {titleText}
          </p>
        )}
        {he("mainTitle") && (
          <h1
            className="font-light shrink-0 mb-4"
            style={{
              lineHeight: "1.1",
              fontSize: `${namesFontSize}px`,
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
        {he("avatar") && showAvatar && (
          <div className="flex-1 flex items-center justify-center min-h-[200px]">
            {hasTwoAvatars && (avatarUrl1 || avatarUrl2) ? (
              <AvatarPair avatarUrl1={avatarUrl1} avatarUrl2={avatarUrl2} accent={accent} avatarShape={avatarShape} />
            ) : (
              <SingleAvatar
                avatarUrl={avatarUrl1}
                accent={accent}
                emoji={template.avatarEmoji}
                size={100}
                avatarShape={avatarShape}
              />
            )}
          </div>
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
            className="w-20 h-px my-3 shrink-0"
            style={{ backgroundColor: accent }}
          />
        )}
        {he("note") && showNote !== false && noteText && (
          <p
            className="text-sm italic opacity-90 mb-2 shrink-0"
            style={{ ...noteFontStyle, fontSize: noteFontSize || 13 }}
          >
            {noteText}
          </p>
        )}
        {he("date") && dateTimeStr && showDate !== false && (
          <p className="text-sm mb-1 shrink-0" style={{ letterSpacing: "1px" }}>
            {dateTimeStr}
          </p>
        )}
        {he("venue") && showVenue !== false && venueName && (
          <p className="text-sm opacity-80 mb-4 shrink-0">{venueName}</p>
        )}
        {he("countdown") && showCountdown !== false && (
          <div className="mb-4 shrink-0">
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
            className="px-6 py-2 text-sm border border-current rounded-full mb-4 hover:bg-white/10 transition-colors shrink-0"
          >
            Hatırlatıcı Al
          </button>
        )}
        {variant !== "live" && he("scrollIndicator") && showScrollIndicator !== false && (
          <p className="text-[10px] opacity-50 shrink-0">Yukarı kaydırınız.</p>
        )}
      </div>
    </div>
  );
}
