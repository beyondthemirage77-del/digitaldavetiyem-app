"use client";

import type { CSSProperties } from "react";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { formatEventDateTime } from "@/lib/utils";
import { getTemplateById, getCategoryConfig } from "@/lib/templateData";
import { normalizeTemplateId } from "@/lib/templateData";
import {
  CenteredLayout,
  BottomLeftLayout,
  TopCenterLayout,
  SplitLayout,
  MinimalLayout,
  CorporateLayout,
} from "./layouts";
import {
  EventDetailsSection,
  RSVPSection,
  FooterSection,
  getFontStyle,
} from "./layouts/LayoutShared";
import type { TemplateLayout } from "@/lib/templateData";
import type {
  MediaType,
  BackgroundType,
  PresetBackgroundId,
  FontFamilyId,
  CountdownStyleId,
} from "@/lib/types";

export interface TemplateRendererProps {
  templateId: number | string | null;
  variant?: "preview" | "live";
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
  noteFontSize?: number;
  countdownFontSize?: number;
  titleFontFamily?: FontFamilyId;
  namesFontFamily?: FontFamilyId;
  noteFontFamily?: FontFamilyId;
  mainTitle?: string;
  subtitle?: string;
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
  overlayStrength?: "light" | "medium" | "dark";
  /** Unique fields per category - passed through for getMainTitle */
  wedding_brideName?: string;
  wedding_groomName?: string;
  kina_brideName?: string;
  babyshower_motherName?: string;
  cinsiyet_parentNames?: string;
  sunnet_childName?: string;
  sunnet_parentNames?: string;
  dogum_childName?: string;
  dogum_age?: string;
  mevlut_hostName?: string;
  mevlut_reason?: string;
  toplanti_eventTitle?: string;
  toplanti_organizationName?: string;
  acilis_firmaAdi?: string;
  /** @internal For download only - base64 background to bypass CORS in html2canvas */
  _base64Background?: string | null;
  /** @internal For download only - blob URL for background (converted from Firebase) */
  _blobBgUrl?: string | null;
  /** Legacy - for backward compat when loading old invitations */
  brideName?: string;
  groomName?: string;
  motherName?: string;
  fatherName?: string;
  childName?: string;
  age?: string;
  parentNames?: string;
  hostName?: string;
  mevlutReason?: string;
  eventTitle?: string;
  organizationName?: string;
}

function VideoHero({
  mediaUrls,
  displayName,
  eventDate,
  eventTime,
  venueName,
  textColor,
  namesFontSize,
  namesFontFamily,
  countdownStyle,
  countdownFontSize,
  template,
}: {
  mediaUrls: string[];
  displayName: string;
  eventDate?: string;
  eventTime?: string;
  venueName?: string;
  textColor?: string;
  namesFontSize?: number;
  namesFontFamily?: FontFamilyId;
  countdownStyle?: CountdownStyleId;
  countdownFontSize?: number;
  template: NonNullable<ReturnType<typeof getTemplateById>>;
}) {
  const dateTimeStr = formatEventDateTime(eventDate ?? "", eventTime);
  const namesFontStyle = getFontStyle(namesFontFamily ?? "cormorant");
  const videoTextColor = textColor || "#1a1a1a";
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
    backgroundColor: template.accentBg || "rgba(0,0,0,0.05)",
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
            fontSize: `${namesFontSize || 22}px`,
            margin: 0,
            textAlign: "center",
            flexShrink: 0,
            fontWeight: 400,
            color: videoTextColor,
            ...namesFontStyle,
          }}
        >
          {displayName}
        </p>
        <div
          style={{
            height: "1px",
            width: "40px",
            backgroundColor: template.accent,
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
            variant="classic"
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

function buildFormRecord(props: TemplateRendererProps): Record<string, string | undefined> {
  return {
    wedding_brideName: props.wedding_brideName ?? props.brideName,
    wedding_groomName: props.wedding_groomName ?? props.groomName,
    kina_brideName: props.kina_brideName ?? props.brideName,
    babyshower_motherName: props.babyshower_motherName ?? props.motherName,
    cinsiyet_parentNames: props.cinsiyet_parentNames ?? props.parentNames,
    sunnet_childName: props.sunnet_childName ?? props.childName,
    sunnet_parentNames: props.sunnet_parentNames,
    dogum_childName: props.dogum_childName ?? props.childName,
    dogum_age: props.dogum_age ?? props.age,
    mevlut_hostName: props.mevlut_hostName ?? props.hostName,
    mevlut_reason: props.mevlut_reason ?? props.mevlutReason,
    toplanti_eventTitle: props.toplanti_eventTitle ?? props.eventTitle,
    toplanti_organizationName: props.toplanti_organizationName ?? props.organizationName,
    acilis_firmaAdi: props.acilis_firmaAdi,
  };
}

export function TemplateRenderer(props: TemplateRendererProps) {
  const {
    templateId,
    variant = "preview",
    rsvpEnabled = false,
    mediaType,
    mediaUrls,
    _base64Background,
    _blobBgUrl,
    ...rest
  } = props;

  const numericId = normalizeTemplateId(templateId);
  const template = getTemplateById(numericId ?? 1);

  if (!template) {
    return (
      <div style={{ width: "390px", padding: 40, textAlign: "center", color: "#666" }}>
        Şablon yüklenemedi.
      </div>
    );
  }

  const category = template.category;
  const categoryConfig = getCategoryConfig(category);
  const formRecord = buildFormRecord(props);
  const mainTitle = props.mainTitle || categoryConfig.getMainTitle(formRecord);
  const titleText = props.subtitle ?? props.titleText ?? categoryConfig.defaultSubtitle;
  const noteText = props.noteText ?? categoryConfig.defaultNote;

  const effectiveShowCountdown = category === "Açılış" ? false : (props.showCountdown !== false);
  const te = categoryConfig.templateElements ?? [];
  const hasElement = (el: string) => te.includes(el as never);
  const showIf = (el: string, v?: boolean) => (hasElement(el) ? (v !== false) : false);

  const bgOverride = _blobBgUrl ?? _base64Background;
  const templateWithBg = bgOverride
    ? { ...template, bg: bgOverride }
    : template;

  const bgUrl = templateWithBg?.bg;
  if (process.env.NODE_ENV === "development" && (template?.id === 16 || template?.id === 21)) {
    console.log("bgKey:", (props as unknown as Record<string, unknown>).bgKey, "tmpl bgKey:", template?.bgKey, "bgUrl:", bgUrl);
  }

  const layoutProps = {
    ...rest,
    mainTitle,
    titleText,
    noteText,
    variant,
    template: templateWithBg,
    mediaType,
    mediaUrls,
    backgroundType: props.backgroundType,
    presetBackground: props.presetBackground,
    fatherName: props.fatherName,
    motherName: props.motherName,
    sunnet_parentNames: props.sunnet_parentNames,
    organizationName: props.toplanti_organizationName ?? props.organizationName,
    mevlutReason: props.mevlut_reason ?? props.mevlutReason,
    showCountdown: effectiveShowCountdown,
    showSubtitle: showIf("subtitle", props.showSubtitle),
    showAvatar: showIf("avatar", props.showAvatar),
    showNote: showIf("note", props.showNote),
    showDate: showIf("date", props.showDate),
    showVenue: showIf("venue", props.showVenue),
    showReminderButton: showIf("reminderBtn", props.showReminderButton),
    showScrollIndicator: showIf("scrollIndicator", props.showScrollIndicator),
    hasElement,
  };

  if (mediaType === "video" && mediaUrls?.[0]) {
    return (
      <div style={{ width: "390px", overflow: "hidden" }}>
        <VideoHero
          mediaUrls={mediaUrls}
          displayName={mainTitle || "Ad & Soyad"}
          eventDate={props.eventDate}
          eventTime={props.eventTime}
          venueName={props.venueName}
          textColor={props.textColor}
          namesFontSize={props.namesFontSize}
          namesFontFamily={props.namesFontFamily}
          countdownStyle={props.countdownStyle}
          countdownFontSize={props.countdownFontSize}
          template={template}
        />
        {variant !== "live" && (
          <>
            <EventDetailsSection
              eventDate={props.eventDate}
              eventTime={props.eventTime}
              venueName={props.venueName}
              venueAddress={props.venueAddress}
              googleMapsUrl={props.googleMapsUrl}
            />
            {rsvpEnabled && <RSVPSection />}
            <FooterSection />
          </>
        )}
      </div>
    );
  }

  let HeroComponent: React.ComponentType<typeof layoutProps>;
  switch (template.layout as TemplateLayout) {
    case "centered":
      HeroComponent = CenteredLayout;
      break;
    case "bottom-left":
      HeroComponent = BottomLeftLayout;
      break;
    case "top-center":
      HeroComponent = TopCenterLayout;
      break;
    case "split":
      HeroComponent = SplitLayout;
      break;
    case "minimal":
      HeroComponent = MinimalLayout;
      break;
    case "corporate":
      HeroComponent = CorporateLayout;
      break;
    default:
      HeroComponent = CenteredLayout;
  }

  return (
    <div style={{ width: "390px", overflow: "hidden" }}>
      <HeroComponent {...layoutProps} />
      {variant !== "live" && (
        <>
          <EventDetailsSection
            eventDate={props.eventDate}
            eventTime={props.eventTime}
            venueName={props.venueName}
            venueAddress={props.venueAddress}
            googleMapsUrl={props.googleMapsUrl}
          />
          {rsvpEnabled && <RSVPSection />}
          <FooterSection />
        </>
      )}
    </div>
  );
}
