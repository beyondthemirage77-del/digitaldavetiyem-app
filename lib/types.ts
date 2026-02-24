/** Template id 1-22; null/0 means not selected */
export type TemplateId = number | null;
export type MediaType = "image" | "slider" | "video";
export type AudioType = "music" | "voice" | "none";
export type MusicTrackId =
  | "romantic-piano"
  | "classical-waltz"
  | "acoustic-guitar"
  | "orchestral"
  | "jazz-lounge";
export type InvitationStatus =
  | "draft"
  | "pending_payment"
  | "active"
  | "expired";
export type RSVPResponse = "attending" | "not_attending" | "maybe";
export type WizardStep =
  | "template"
  | "details"
  | "preview"
  | "payment";

/** Firestore invitation document - supports new unique fields + legacy for migration */
export interface Invitation {
  id: string;
  userId: string;
  slug: string;
  status: InvitationStatus;
  isPaid: boolean;
  templateId: TemplateId;
  /** @deprecated Use wedding_* / category-specific fields */
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
  mainTitle?: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  googleMapsUrl: string;
  mediaType: MediaType;
  audioType: AudioType;
  backgroundType: BackgroundType;
  presetBackground: PresetBackgroundId;
  mediaUrls: string[];
  audioUrl: string;
  musicTrack: string;
  fontFamily?: string;
  textColor?: string;
  countdownStyle?: string;
  fontSizeScale?: number;
  titleFontSize?: number;
  namesFontSize?: number;
  countdownFontSize?: number;
  titleFontFamily?: string;
  namesFontFamily?: string;
  noteFontFamily?: string;
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
  showSubtitle?: boolean;
  showDate?: boolean;
  showReminderButton?: boolean;
  showScrollIndicator?: boolean;
  familyNames?: {
    brideMotherName: string;
    brideFatherName: string;
    groomMotherName: string;
    groomFatherName: string;
    brideFamilySurname: string;
    groomFamilySurname: string;
  };
  rsvpEnabled: boolean;
  overlayStrength?: "light" | "medium" | "dark";
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RSVPEntry {
  id: string;
  invitationId: string;
  guestName: string;
  guestCount: number;
  response: RSVPResponse;
  note: string;
  createdAt: string;
}

export type FontFamilyId = "cormorant" | "inter" | "dancing" | "playfair";
export type CountdownStyleId = "classic" | "modern" | "minimal";
export type BackgroundType = "upload" | "preset";
export type PresetBackgroundId =
  | "cream"
  | "navy"
  | "dusty-rose"
  | "sage"
  | "gold"
  | "marble";

/** Form data with unique fields per template category - no conflicts */
export interface InvitationFormData {
  templateId: TemplateId;

  // DÜĞÜN & NİŞAN fields
  wedding_brideName?: string;
  wedding_groomName?: string;

  // KINA fields
  kina_brideName?: string;

  // BABY SHOWER fields
  babyshower_motherName?: string;

  // CİNSİYET PARTİSİ fields
  cinsiyet_parentNames?: string;

  // SÜNNET fields
  sunnet_childName?: string;
  sunnet_parentNames?: string;

  // DOĞUM GÜNÜ fields
  dogum_childName?: string;
  dogum_age?: string;

  // MEVLÜT fields
  mevlut_hostName?: string;
  mevlut_reason?: string;

  // TOPLANTI fields
  toplanti_eventTitle?: string;
  toplanti_organizationName?: string;

  // AÇILIŞ fields
  acilis_firmaAdi?: string;

  // SHARED fields (all templates)
  mainTitle?: string;
  eventDate?: string;
  eventTime?: string;
  venueName?: string;
  venueAddress?: string;
  googleMapsUrl?: string;

  // SHARED STYLE fields (all templates)
  subtitle?: string;
  noteText?: string;
  textColor?: string;
  overlayStrength?: "light" | "medium" | "dark";
  titleFontSize?: number;
  namesFontSize?: number;
  noteFontSize?: number;
  countdownFontSize?: number;
  titleFontFamily?: string;
  namesFontFamily?: string;
  noteFontFamily?: string;
  countdownStyle?: "classic" | "modern" | "minimal";

  // SHARED ELEMENT TOGGLES (always in "Elementleri Düzenle")
  showSubtitle?: boolean;
  showAvatar?: boolean;
  showNote?: boolean;
  showDate?: boolean;
  showVenue?: boolean;
  showCountdown?: boolean;
  showReminderButton?: boolean;
  showScrollIndicator?: boolean;

  // AVATAR
  avatarUrl1?: string;
  avatarUrl2?: string;
  avatarShape?: "circle" | "square" | "rounded";

  // RSVP
  rsvpEnabled?: boolean;

  // MEDIA & BACKGROUND
  mediaType?: MediaType;
  audioType?: AudioType;
  backgroundType?: BackgroundType;
  presetBackground?: PresetBackgroundId;
  mediaFiles?: File[];
  mediaUrls?: string[];
  audioFile?: File | null;
  audioUrl?: string;
  musicTrack?: MusicTrackId;

  // LEGACY / MISC
  fontSizeScale?: number;
  showFamilyNames?: boolean;
  customColor?: string;
  familyNames?: {
    brideMotherName: string;
    brideFatherName: string;
    groomMotherName: string;
    groomFatherName: string;
    brideFamilySurname: string;
    groomFamilySurname: string;
  };
  hasAvatarTemplate?: boolean;
}
