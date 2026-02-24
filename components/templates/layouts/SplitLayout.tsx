"use client";

import { formatEventDateTime } from "@/lib/utils";
import {
  LayoutProps,
  LayoutBackgroundLayer,
  SharedCountdown,
  SingleAvatar,
  AvatarPair,
  FamilyNamesBlock,
  getFontStyle,
} from "./LayoutShared";

export function SplitLayout({
  variant = "preview",
  eventDate = "",
  eventTime = "15:00",
  venueName = "",
  titleFontSize = 12,
  namesFontSize = 30,
  noteFontSize = 13,
  countdownFontSize = 18,
  titleFontFamily = "inter",
  namesFontFamily = "cormorant",
  noteFontFamily = "cormorant",
  titleText = "Nikahımıza Davetlisiniz",
  noteText = "Bu mutlu günümüzü sizinle paylaşmak istiyoruz",
  mainTitle,
  textColor = "#1a1a1a",
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
  const accentBg = template.accentBg;
  const hasTwoAvatars = template.hasAvatar && template.avatarCount === 2;
  const he = (el: string) => hasElement?.(el as never) ?? true;

  return (
    <div
      className="relative flex flex-col"
      style={{ width: 390, height: 844, position: "relative", overflow: "hidden", flexShrink: 0 }}
    >
      <div
        className="relative overflow-hidden"
        style={{ height: 422, flexShrink: 0 }}
      >
        <LayoutBackgroundLayer
          mediaType={mediaType}
          mediaUrls={mediaUrls}
          backgroundType={backgroundType}
          presetBackground={presetBackground}
          templateBg={template.bg}
        />
        {he("avatar") && showAvatar && (
          <div className="absolute inset-0 flex items-center justify-center">
            {hasTwoAvatars && (avatarUrl1 || avatarUrl2) ? (
              <AvatarPair avatarUrl1={avatarUrl1} avatarUrl2={avatarUrl2} accent={accent} avatarShape={avatarShape} />
            ) : (
              <SingleAvatar
                avatarUrl={avatarUrl1}
                accent={accent}
                emoji={template.avatarEmoji}
                size={120}
                avatarShape={avatarShape}
              />
            )}
          </div>
        )}
      </div>
      <div
        className="flex-1 flex flex-col items-center justify-center px-8 py-10 overflow-y-auto"
        style={{ background: accentBg || "rgba(255,255,255,0.95)", minHeight: 422, flexShrink: 0, ...colorStyle }}
      >
        {he("subtitle") && showSubtitle !== false && (
          <p
            className="text-xs uppercase tracking-[0.2em] shrink-0 mb-2"
            style={{
              letterSpacing: "3px",
              fontSize: `${titleFontSize}px`,
              ...titleFontStyle,
            }}
          >
            {titleText}
          </p>
        )}
        {he("mainTitle") && (
          <h1
            className="font-light shrink-0 mb-3"
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
        {he("parentNames") && (fatherName || motherName) && (
          <p className="text-sm opacity-90 mb-2 shrink-0 text-center" style={noteFontStyle}>
            {[fatherName && `Baba: ${fatherName}`, motherName && `Anne: ${motherName}`].filter(Boolean).join(" • ")}
          </p>
        )}
        {he("organizationName") && organizationName && (
          <p className="text-sm opacity-90 mb-2 shrink-0 text-center" style={noteFontStyle}>
            {organizationName}
          </p>
        )}
        {he("mevlutReason") && mevlutReason && (
          <p className="text-sm italic opacity-85 mb-2 shrink-0 text-center" style={noteFontStyle}>
            {mevlutReason}
          </p>
        )}
        {he("divider") && (
          <div
            className="w-16 h-px my-2 shrink-0"
            style={{ backgroundColor: accent }}
          />
        )}
        {he("note") && showNote !== false && noteText && (
          <p
            className="text-sm opacity-90 mb-2 shrink-0 text-center"
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
            className="px-6 py-2 text-sm border border-current rounded-full hover:bg-black/5 transition-colors shrink-0"
          >
            Hatırlatıcı Al
          </button>
        )}
        {variant !== "live" && he("scrollIndicator") && showScrollIndicator !== false && (
          <p className="text-[10px] opacity-60 shrink-0 mt-3">Yukarı kaydırınız.</p>
        )}
      </div>
    </div>
  );
}
