"use client";

import { formatEventDateTime } from "@/lib/utils";
import {
  LayoutProps,
  LayoutBackgroundLayer,
  LayoutOverlay,
  FamilyNamesBlock,
  SingleAvatar,
  AvatarPair,
  SharedCountdown,
  getFontStyle,
} from "./LayoutShared";

export function MinimalLayout({
  variant = "preview",
  eventDate = "",
  eventTime = "15:00",
  venueName = "",
  titleFontSize = 11,
  namesFontSize = 28,
  noteFontSize = 13,
  titleFontFamily = "inter",
  namesFontFamily = "cormorant",
  noteFontFamily = "cormorant",
  titleText = "Nikahımıza Davetlisiniz",
  noteText = "",
  mainTitle,
  textColor = "#FFFFFF",
  showFamilyNames,
  showVenue = true,
  showNote = true,
  showReminderButton = true,
  showScrollIndicator = true,
  showCountdown = true,
  countdownStyle,
  countdownFontSize = 20,
  showAvatar = true,
  avatarUrl1,
  avatarUrl2,
  avatarShape = "circle",
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
        className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center pointer-events-auto"
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)", ...colorStyle }}
      >
        {he("subtitle") && showSubtitle !== false && (
          <p
            className="text-[10px] uppercase tracking-[0.25em] shrink-0 mb-4"
            style={{
              letterSpacing: "4px",
              fontSize: `${titleFontSize}px`,
              opacity: 0.9,
              ...titleFontStyle,
            }}
          >
            {titleText}
          </p>
        )}
        {he("avatar") && showAvatar && (
          <div className="flex shrink-0 my-4">
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
        {he("mainTitle") && (
          <h1
            className="font-light shrink-0"
            style={{
              lineHeight: "1.2",
              fontSize: `${namesFontSize}px`,
              letterSpacing: "0.05em",
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
          <p className="text-xs opacity-90 mb-2 shrink-0" style={{ letterSpacing: "0.05em" }}>
            {[fatherName && `Baba: ${fatherName}`, motherName && `Anne: ${motherName}`].filter(Boolean).join(" • ")}
          </p>
        )}
        {he("organizationName") && organizationName && (
          <p className="text-xs opacity-90 mb-2 shrink-0" style={{ letterSpacing: "0.05em" }}>
            {organizationName}
          </p>
        )}
        {he("mevlutReason") && mevlutReason && (
          <p className="text-xs italic opacity-85 mb-2 shrink-0" style={{ letterSpacing: "0.05em" }}>
            {mevlutReason}
          </p>
        )}
        {he("divider") && (
          <div
            className="w-12 h-px my-5 shrink-0"
            style={{ backgroundColor: accent }}
          />
        )}
        {he("note") && showNote !== false && noteText && (
          <p className="text-xs italic opacity-90 mb-2 shrink-0" style={{ letterSpacing: "0.05em", ...noteFontStyle, fontSize: noteFontSize || 13 }}>
            {noteText}
          </p>
        )}
        {he("date") && dateTimeStr && showDate !== false && (
          <p
            className="text-xs shrink-0 tracking-widest"
            style={{ letterSpacing: "2px", opacity: 0.9 }}
          >
            {dateTimeStr}
          </p>
        )}
        {he("venue") && showVenue !== false && venueName && (
          <p className="text-xs opacity-80 mt-2 shrink-0">{venueName}</p>
        )}
        {he("countdown") && showCountdown !== false && (
          <div className="my-4 shrink-0">
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
            className="px-5 py-2 text-xs border border-current rounded-full mt-6 hover:bg-white/10 transition-colors shrink-0"
          >
            Hatırlatıcı Al
          </button>
        )}
        {variant !== "live" && he("scrollIndicator") && showScrollIndicator !== false && (
          <p className="text-[9px] opacity-40 shrink-0 mt-6">Yukarı kaydırınız.</p>
        )}
      </div>
    </div>
  );
}
