"use client";

import { TemplateRenderer } from "./TemplateRenderer";
import type {
  MediaType,
  BackgroundType,
  PresetBackgroundId,
  FontFamilyId,
  CountdownStyleId,
} from "@/lib/types";

export interface InvitationPreviewProps {
  /** Template id 1-22, or legacy string "classic"|"modern"|"bohemian" for backward compat */
  templateId: number | string | null;
  /** When "live", templates only render the hero (no event details/RSVP). Page provides those with full functionality. */
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

export function InvitationPreview(props: InvitationPreviewProps) {
  return <TemplateRenderer {...props} />;
}
