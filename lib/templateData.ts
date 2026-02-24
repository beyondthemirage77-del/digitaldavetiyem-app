import { templateBackgrounds } from "./templates";

export const overlayConfig = {
  light: { base: "rgba(0,0,0,0.08)", bottom: "rgba(0,0,0,0.55)", top: "rgba(0,0,0,0.25)" },
  medium: { base: "rgba(0,0,0,0.18)", bottom: "rgba(0,0,0,0.70)", top: "rgba(0,0,0,0.35)" },
  dark: { base: "rgba(0,0,0,0.30)", bottom: "rgba(0,0,0,0.85)", top: "rgba(0,0,0,0.45)" },
} as const;

export type TemplateLayout =
  | "centered"
  | "bottom-left"
  | "top-center"
  | "split"
  | "minimal"
  | "corporate";

/** Legacy: maps layout to componentId for getTemplatePreviewBg */
export type ComponentId = "classic" | "modern" | "bohemian";

/** @deprecated Legacy field ids - use unique category fields (wedding_*, kina_*, etc.) */
export type FormFieldId =
  | "brideName"
  | "groomName"
  | "motherName"
  | "fatherName"
  | "childName"
  | "age"
  | "parentNames"
  | "hostName"
  | "mevlutReason"
  | "eventTitle"
  | "organizationName"
  | "eventDate"
  | "eventTime"
  | "venueName"
  | "venueAddress"
  | "googleMapsUrl";

export interface WizardFieldDef {
  key: string;
  label: string;
  placeholder: string;
  type?: "text" | "date" | "time" | "number";
  optional?: boolean;
  asTextarea?: boolean;
}

/** Element IDs for layout conditional render and template element toggles - hasElement(el) */
export type TemplateElementId =
  | "mainTitle"
  | "subtitle"
  | "avatar"
  | "note"
  | "date"
  | "venue"
  | "countdown"
  | "reminderBtn"
  | "scrollIndicator";

export interface CategoryFieldConfig {
  wizardFields: WizardFieldDef[];
  defaultSubtitle: string;
  defaultNote: string;
  getMainTitle: (f: Record<string, string | undefined>) => string;
  getSubTitle2?: (f: Record<string, string | undefined>) => string;
  /** Elements this category supports - toggles shown only for these; defaults set from this */
  templateElements: TemplateElementId[];
}

const ELEMENTS_PARTY: TemplateElementId[] = ["mainTitle", "subtitle", "avatar", "note", "date", "venue", "countdown", "reminderBtn", "scrollIndicator"];
const ELEMENTS_WEDDING: TemplateElementId[] = ["mainTitle", "subtitle", "avatar", "note", "date", "venue", "countdown", "reminderBtn", "scrollIndicator"];
const ELEMENTS_WITH_AVATAR: TemplateElementId[] = ["mainTitle", "subtitle", "avatar", "note", "date", "venue", "countdown", "reminderBtn", "scrollIndicator"];
const ELEMENTS_TOPLANTI: TemplateElementId[] = ["mainTitle", "subtitle", "note", "date", "venue", "countdown", "scrollIndicator"];

const dogumConfig: CategoryFieldConfig = {
  wizardFields: [
    { key: "dogum_childName", label: "Doğum Günü Sahibi İsmi", placeholder: "Zeynep" },
    { key: "dogum_age", label: "Kaç Yaşına Giriyor?", placeholder: "5" },
    { key: "eventDate", label: "Parti Tarihi", type: "date", placeholder: "" },
    { key: "eventTime", label: "Saat", type: "time", placeholder: "" },
    { key: "venueName", label: "Mekan Adı", placeholder: "Eğlence Merkezi" },
    { key: "venueAddress", label: "Adres", placeholder: "İzmir" },
    { key: "googleMapsUrl", label: "Google Maps Linki (opsiyonel)", placeholder: "https://maps.google.com/...", optional: true },
  ],
  defaultSubtitle: "Doğum Günü Partisi 🎉",
  defaultNote: "Doğum günü partisine davetlisiniz!",
  getMainTitle: (f) => {
    if (f.dogum_childName && f.dogum_age) return `${f.dogum_childName} ${f.dogum_age} Yaşında! 🎂`;
    if (f.dogum_childName) return `${f.dogum_childName}'in Doğum Günü`;
    return "Doğum Günü Partisi";
  },
  templateElements: ELEMENTS_PARTY,
};

/** Canonical field groups per category - unique keys per template */
export const categoryFields: Record<string, CategoryFieldConfig> = {
  Düğün: {
    wizardFields: [
      { key: "wedding_brideName", label: "Gelin Adı", placeholder: "Ayşe" },
      { key: "wedding_groomName", label: "Damat Adı", placeholder: "Mehmet" },
      { key: "eventDate", label: "Düğün Tarihi", type: "date", placeholder: "" },
      { key: "eventTime", label: "Saat", type: "time", placeholder: "" },
      { key: "venueName", label: "Mekan Adı", placeholder: "Grand Hotel" },
      { key: "venueAddress", label: "Adres", placeholder: "Beşiktaş, İstanbul" },
      { key: "googleMapsUrl", label: "Google Maps Linki (opsiyonel)", placeholder: "https://maps.google.com/...", optional: true },
    ],
    defaultSubtitle: "Nikahımıza Davetlisiniz",
    defaultNote: "Bu mutlu günümüzü sizinle paylaşmak istiyoruz",
    getMainTitle: (f) => `${f.wedding_brideName || "Gelin"} & ${f.wedding_groomName || "Damat"}`,
    templateElements: ELEMENTS_WEDDING,
  },
  Nişan: {
    wizardFields: [
      { key: "wedding_brideName", label: "Nişanlı Adı (Kız)", placeholder: "Ayşe" },
      { key: "wedding_groomName", label: "Nişanlı Adı (Erkek)", placeholder: "Mehmet" },
      { key: "eventDate", label: "Nişan Tarihi", type: "date", placeholder: "" },
      { key: "eventTime", label: "Saat", type: "time", placeholder: "" },
      { key: "venueName", label: "Mekan Adı", placeholder: "Grand Hotel" },
      { key: "venueAddress", label: "Adres", placeholder: "Beşiktaş, İstanbul" },
      { key: "googleMapsUrl", label: "Google Maps Linki (opsiyonel)", placeholder: "https://maps.google.com/...", optional: true },
    ],
    defaultSubtitle: "Nişanımıza Davetlisiniz",
    defaultNote: "Bu mutlu günümüzü sizinle paylaşmak istiyoruz",
    getMainTitle: (f) => `${f.wedding_brideName || "Kız"} & ${f.wedding_groomName || "Erkek"}`,
    templateElements: ELEMENTS_WITH_AVATAR,
  },
  Kına: {
    wizardFields: [
      { key: "kina_brideName", label: "Gelin Adı", placeholder: "Fatma" },
      { key: "eventDate", label: "Kına Tarihi", type: "date", placeholder: "" },
      { key: "eventTime", label: "Saat", type: "time", placeholder: "" },
      { key: "venueName", label: "Mekan Adı", placeholder: "Düğün Salonu" },
      { key: "venueAddress", label: "Adres", placeholder: "Kadıköy, İstanbul" },
      { key: "googleMapsUrl", label: "Google Maps Linki (opsiyonel)", placeholder: "https://maps.google.com/...", optional: true },
    ],
    defaultSubtitle: "Kına Gecemize Davetlisiniz",
    defaultNote: "Bu özel gecemizi sizinle paylaşmak istiyoruz",
    getMainTitle: (f) => (f.kina_brideName ? `${f.kina_brideName}'nın Kınası` : "Fatma'nın Kınası"),
    templateElements: ELEMENTS_WEDDING,
  },
  "Baby Shower": {
    wizardFields: [
      { key: "babyshower_motherName", label: "Anne Adı", placeholder: "Fatma" },
      { key: "eventDate", label: "Parti Tarihi", type: "date", placeholder: "" },
      { key: "eventTime", label: "Saat", type: "time", placeholder: "" },
      { key: "venueName", label: "Mekan Adı", placeholder: "Park Otel" },
      { key: "venueAddress", label: "Adres", placeholder: "Ankara" },
      { key: "googleMapsUrl", label: "Google Maps Linki (opsiyonel)", placeholder: "https://maps.google.com/...", optional: true },
    ],
    defaultSubtitle: "Baby Shower",
    defaultNote: "Bu özel günümüzü sizinle kutlamak istiyoruz",
    getMainTitle: (f) => f.babyshower_motherName || "Bebeğimiz Geliyor!",
    templateElements: ELEMENTS_WITH_AVATAR,
  },
  "Cinsiyet Partisi": {
    wizardFields: [
      { key: "cinsiyet_parentNames", label: "Anne & Baba Adları", placeholder: "Fatma & Ali" },
      { key: "eventDate", label: "Parti Tarihi", type: "date", placeholder: "" },
      { key: "eventTime", label: "Saat", type: "time", placeholder: "" },
      { key: "venueName", label: "Mekan Adı", placeholder: "Bahçe Kafe" },
      { key: "venueAddress", label: "Adres", placeholder: "İzmir" },
      { key: "googleMapsUrl", label: "Google Maps Linki (opsiyonel)", placeholder: "https://maps.google.com/...", optional: true },
    ],
    defaultSubtitle: "Cinsiyet Partisi",
    defaultNote: "Cinsiyeti birlikte öğrenelim!",
    getMainTitle: (f) => f.cinsiyet_parentNames || "Pembe mi? Mavi mi?",
    templateElements: ELEMENTS_WITH_AVATAR,
  },
  Sünnet: {
    wizardFields: [
      { key: "sunnet_childName", label: "Çocuğun Adı", placeholder: "Ahmet" },
      { key: "sunnet_parentNames", label: "Aile İsmi", placeholder: "Mehmet & Fatma Yılmaz" },
      { key: "eventDate", label: "Tören Tarihi", type: "date", placeholder: "" },
      { key: "eventTime", label: "Saat", type: "time", placeholder: "" },
      { key: "venueName", label: "Mekan Adı", placeholder: "Dedeman Otel" },
      { key: "venueAddress", label: "Adres", placeholder: "Ankara" },
      { key: "googleMapsUrl", label: "Google Maps Linki (opsiyonel)", placeholder: "https://maps.google.com/...", optional: true },
    ],
    defaultSubtitle: "Sünnet Törenimize Davetlisiniz",
    defaultNote: "Bu mutlu günümüzü sizinle paylaşmak istiyoruz",
    getMainTitle: (f) => (f.sunnet_childName ? `${f.sunnet_childName}'in Sünneti` : "Ahmet'in Sünneti"),
    getSubTitle2: (f) => f.sunnet_parentNames || "",
    templateElements: ELEMENTS_WITH_AVATAR,
  },
  "Doğum Günü": dogumConfig,
  Parti: dogumConfig,
  Mevlüt: {
    wizardFields: [
      { key: "mevlut_hostName", label: "Ev Sahibi Adı", placeholder: "Ahmet Yılmaz" },
      { key: "mevlut_reason", label: "Mevlüt Sebebi", placeholder: "Hayırlı olsun, şükran...", asTextarea: true },
      { key: "eventDate", label: "Mevlüt Tarihi", type: "date", placeholder: "" },
      { key: "eventTime", label: "Saat", type: "time", placeholder: "" },
      { key: "venueName", label: "Mekan Adı", placeholder: "Ev / Cami" },
      { key: "venueAddress", label: "Adres", placeholder: "Üsküdar, İstanbul" },
      { key: "googleMapsUrl", label: "Google Maps Linki (opsiyonel)", placeholder: "https://maps.google.com/...", optional: true },
    ],
    defaultSubtitle: "Mevlidimize Davetlisiniz",
    defaultNote: "",
    getMainTitle: (f) => f.mevlut_hostName || "Mevlidimize Davetlisiniz",
    templateElements: ELEMENTS_WEDDING,
  },
  Toplantı: {
    wizardFields: [
      { key: "toplanti_eventTitle", label: "Etkinlik Başlığı", placeholder: "Yıllık Strateji Toplantısı" },
      { key: "toplanti_organizationName", label: "Kurum / Şirket Adı", placeholder: "ABC Şirketi" },
      { key: "eventDate", label: "Toplantı Tarihi", type: "date", placeholder: "" },
      { key: "eventTime", label: "Saat", type: "time", placeholder: "" },
      { key: "venueName", label: "Mekan / Oda Adı", placeholder: "Toplantı Salonu A" },
      { key: "venueAddress", label: "Adres", placeholder: "Şişli, İstanbul" },
      { key: "googleMapsUrl", label: "Google Maps Linki (opsiyonel)", placeholder: "https://maps.google.com/...", optional: true },
    ],
    defaultSubtitle: "Toplantıya Davetlisiniz",
    defaultNote: "",
    getMainTitle: (f) => f.toplanti_eventTitle || f.toplanti_organizationName || "Yıllık Strateji Toplantısı",
    templateElements: ELEMENTS_TOPLANTI,
  },
  Açılış: {
    wizardFields: [
      { key: "acilis_firmaAdi", label: "Firma / Mekan Adı", placeholder: "ABC Şirketi" },
      { key: "eventDate", label: "Açılış Tarihi", type: "date", placeholder: "" },
      { key: "eventTime", label: "Saat", type: "time", placeholder: "" },
      { key: "venueName", label: "Mekan Adı", placeholder: "Yeni Şubemiz" },
      { key: "venueAddress", label: "Adres", placeholder: "Bağcılar, İstanbul" },
      { key: "googleMapsUrl", label: "Google Maps Linki (opsiyonel)", placeholder: "https://maps.google.com/...", optional: true },
    ],
    defaultSubtitle: "Açılışımıza Davetlisiniz",
    defaultNote: "Sizi aramızda görmekten mutluluk duyarız",
    getMainTitle: (f) => f.acilis_firmaAdi || "ABC Şirketi",
    templateElements: ELEMENTS_TOPLANTI,
  },
};

export interface CustomTexts {
  subtitle: string;
  note: string;
}

/** Legacy - for TEMPLATES backward compat */
const CATEGORY_FORM_CONFIG: Record<string, { formFields: string[]; customTexts: CustomTexts }> = Object.fromEntries(
  Object.entries(categoryFields).map(([k, v]) => [
    k,
    { formFields: v.wizardFields.map((f) => f.key), customTexts: { subtitle: v.defaultSubtitle, note: v.defaultNote } },
  ])
);

const DEFAULT_FORM_CONFIG = CATEGORY_FORM_CONFIG["Düğün"]!;

/** Get category config - use for BilgilerStep, TemplateRenderer, PreviewStep */
export function getCategoryConfig(category: string | undefined): CategoryFieldConfig {
  if (!category) return categoryFields["Düğün"]!;
  return categoryFields[category] ?? categoryFields["Düğün"]!;
}

export interface TemplateItem {
  id: number;
  name: string;
  category: string;
  filterCategory: string;
  bgKey: string;
  cardStyle: string;
  overlayStrength: keyof typeof overlayConfig;
  layout: TemplateLayout;
  couple: string;
  font: string;
  accent: string;
  accentBg: string;
  hasAvatar?: boolean;
  avatarCount?: number;
  avatarEmoji?: string | string[];
  formFields: string[];
  customTexts: CustomTexts;
}

const TEMPLATES_RAW: Omit<TemplateItem, "layout" | "formFields" | "customTexts">[] = [
  { id: 1, name: "Klasik Düğün", category: "Düğün", filterCategory: "Düğün", bgKey: "klasik-dugun", cardStyle: "klasik", overlayStrength: "dark", couple: "Ayşe & Mehmet", font: "var(--font-cormorant)", accent: "#C9A96E", accentBg: "rgba(201,169,110,0.2)" },
  { id: 2, name: "Modern Düğün", category: "Düğün", filterCategory: "Düğün", bgKey: "modern-dugun", cardStyle: "modern", overlayStrength: "dark", couple: "Elif & Burak", font: "var(--font-playfair)", accent: "#ffffff", accentBg: "rgba(0,0,0,0.06)" },
  { id: 3, name: "Bohem Düğün", category: "Düğün", filterCategory: "Düğün", bgKey: "bohem-dugun", cardStyle: "bohem", overlayStrength: "dark", couple: "Selin & Kaan", font: "var(--font-dancing)", accent: "#E8B4B8", accentBg: "rgba(232,180,184,0.3)" },
  { id: 4, name: "Nişan", category: "Nişan", filterCategory: "Nişan", bgKey: "nisan", cardStyle: "nisan", overlayStrength: "medium", couple: "Merve & Emre", font: "var(--font-cormorant)", accent: "#c2185b", accentBg: "rgba(194,24,91,0.15)", hasAvatar: true, avatarCount: 2, avatarEmoji: ["👰", "🤵"] },
  { id: 5, name: "Baby Shower", category: "Baby Shower", filterCategory: "Baby Shower", bgKey: "baby-shower", cardStyle: "babyshower", overlayStrength: "medium", couple: "Bebeğimiz Geliyor!", font: "var(--font-dancing)", accent: "#1565c0", accentBg: "rgba(21,101,192,0.15)", hasAvatar: true, avatarCount: 1, avatarEmoji: "👶" },
  { id: 6, name: "Cinsiyet Partisi", category: "Cinsiyet Partisi", filterCategory: "Parti", bgKey: "cinsiyet-partisi", cardStyle: "cinsiyet", overlayStrength: "dark", couple: "Pembe mi? Mavi mi?", font: "var(--font-dancing)", accent: "#7b1fa2", accentBg: "rgba(123,31,162,0.15)", hasAvatar: true, avatarCount: 1, avatarEmoji: "🎀" },
  { id: 7, name: "Mevlüt", category: "Mevlüt", filterCategory: "Mevlüt", bgKey: "mevlut", cardStyle: "mevlut", overlayStrength: "dark", couple: "Mevlidimize Davetlisiniz", font: "var(--font-cormorant)", accent: "#a5d6a7", accentBg: "rgba(165,214,167,0.4)" },
  { id: 8, name: "Doğum Günü", category: "Parti", filterCategory: "Parti", bgKey: "dogum-gunu", cardStyle: "dogumgunu", overlayStrength: "dark", couple: "30. Yaşım 🎉", font: "var(--font-playfair)", accent: "#ce93d8", accentBg: "rgba(206,147,216,0.3)", hasAvatar: true, avatarCount: 1, avatarEmoji: "🎂" },
  { id: 9, name: "Toplantı", category: "Toplantı", filterCategory: "Toplantı", bgKey: "toplanti", cardStyle: "kurumsal", overlayStrength: "dark", couple: "Yıllık Strateji Toplantısı", font: "var(--font-inter)", accent: "#4fc3f7", accentBg: "rgba(79,195,247,0.2)" },
  { id: 10, name: "Kına", category: "Kına", filterCategory: "Kına", bgKey: "kina", cardStyle: "kina", overlayStrength: "dark", couple: "Fatma'nın Kınası", font: "var(--font-dancing)", accent: "#ff80ab", accentBg: "rgba(255,128,171,0.25)" },
  { id: 11, name: "Sünnet", category: "Sünnet", filterCategory: "Sünnet", bgKey: "sunnet", cardStyle: "sunnet", overlayStrength: "dark", couple: "Ahmet'in Sünnet Töreni", font: "var(--font-cormorant)", accent: "#1565c0", accentBg: "rgba(21,101,192,0.15)", hasAvatar: true, avatarCount: 1, avatarEmoji: "🕌" },
  { id: 12, name: "Klasik Düğün 2", category: "Düğün", filterCategory: "Düğün", bgKey: "klasik-dugun-2", cardStyle: "klasik", overlayStrength: "medium", couple: "Ayşe & Mehmet", font: "var(--font-cormorant)", accent: "#C9A96E", accentBg: "rgba(201,169,110,0.2)" },
  { id: 13, name: "Modern Düğün 2", category: "Düğün", filterCategory: "Düğün", bgKey: "modern-dugun-2", cardStyle: "modern", overlayStrength: "medium", couple: "Elif & Burak", font: "var(--font-playfair)", accent: "#ffffff", accentBg: "rgba(0,0,0,0.06)" },
  { id: 14, name: "Bohem Düğün 2", category: "Düğün", filterCategory: "Düğün", bgKey: "bohem-dugun-2", cardStyle: "bohem", overlayStrength: "medium", couple: "Selin & Kaan", font: "var(--font-dancing)", accent: "#E8B4B8", accentBg: "rgba(232,180,184,0.3)" },
  { id: 15, name: "Nişan 2", category: "Nişan", filterCategory: "Nişan", bgKey: "nisan-2", cardStyle: "nisan", overlayStrength: "light", couple: "Merve & Emre", font: "var(--font-cormorant)", accent: "#c2185b", accentBg: "rgba(194,24,91,0.15)", hasAvatar: true, avatarCount: 2, avatarEmoji: ["👰", "🤵"] },
  { id: 16, name: "Baby Shower 2", category: "Baby Shower", filterCategory: "Baby Shower", bgKey: "baby-shower-2", cardStyle: "babyshower", overlayStrength: "medium", couple: "Bebeğimiz Geliyor!", font: "var(--font-dancing)", accent: "#1565c0", accentBg: "rgba(21,101,192,0.15)", hasAvatar: true, avatarCount: 1, avatarEmoji: "👶" },
  { id: 17, name: "Cinsiyet Partisi 2", category: "Cinsiyet Partisi", filterCategory: "Parti", bgKey: "cinsiyet-partisi-2", cardStyle: "cinsiyet", overlayStrength: "light", couple: "Pembe mi? Mavi mi?", font: "var(--font-dancing)", accent: "#7b1fa2", accentBg: "rgba(123,31,162,0.15)", hasAvatar: true, avatarCount: 1, avatarEmoji: "🎀" },
  { id: 18, name: "Mevlüt 2", category: "Mevlüt", filterCategory: "Mevlüt", bgKey: "mevlut-2", cardStyle: "mevlut", overlayStrength: "medium", couple: "Mevlidimize Davetlisiniz", font: "var(--font-cormorant)", accent: "#a5d6a7", accentBg: "rgba(165,214,167,0.4)" },
  { id: 19, name: "Doğum Günü 2", category: "Parti", filterCategory: "Parti", bgKey: "dogum-gunu-2", cardStyle: "dogumgunu", overlayStrength: "medium", couple: "30. Yaşım 🎉", font: "var(--font-playfair)", accent: "#ce93d8", accentBg: "rgba(206,147,216,0.3)", hasAvatar: true, avatarCount: 1, avatarEmoji: "🎂" },
  { id: 20, name: "Toplantı 2", category: "Toplantı", filterCategory: "Toplantı", bgKey: "toplanti-2", cardStyle: "kurumsal", overlayStrength: "light", couple: "Yıllık Strateji Toplantısı", font: "var(--font-inter)", accent: "#4fc3f7", accentBg: "rgba(79,195,247,0.2)" },
  { id: 21, name: "Kına 2", category: "Kına", filterCategory: "Kına", bgKey: "kina-2", cardStyle: "kina", overlayStrength: "medium", couple: "Fatma'nın Kınası", font: "var(--font-dancing)", accent: "#ff80ab", accentBg: "rgba(255,128,171,0.25)" },
  { id: 22, name: "Sünnet 2", category: "Sünnet", filterCategory: "Sünnet", bgKey: "sunnet-2", cardStyle: "sunnet", overlayStrength: "light", couple: "Ahmet'in Sünnet Töreni", font: "var(--font-cormorant)", accent: "#1565c0", accentBg: "rgba(21,101,192,0.15)", hasAvatar: true, avatarCount: 1, avatarEmoji: "🕌" },
  { id: 23, name: "Açılış Daveti", category: "Açılış", filterCategory: "Açılış", bgKey: "acilis-daveti", cardStyle: "kurumsal", overlayStrength: "dark", couple: "ABC Şirketi", font: "var(--font-playfair)", accent: "#C9A96E", accentBg: "rgba(201,169,110,0.2)", hasAvatar: false, avatarCount: 0 },
  { id: 24, name: "Açılış Daveti 2", category: "Açılış", filterCategory: "Açılış", bgKey: "acilis-daveti-2", cardStyle: "kurumsal", overlayStrength: "dark", couple: "ABC Şirketi", font: "var(--font-playfair)", accent: "#C9A96E", accentBg: "rgba(201,169,110,0.2)", hasAvatar: false, avatarCount: 0 },
];

const LAYOUT_BY_ID: Record<number, TemplateLayout> = {
  1: "centered", 2: "bottom-left", 3: "centered", 4: "top-center", 5: "top-center",
  6: "centered", 7: "centered", 8: "top-center", 9: "corporate", 10: "centered",
  11: "top-center", 12: "bottom-left", 13: "centered", 14: "top-center", 15: "minimal",
  16: "centered", 17: "centered", 18: "top-center", 19: "top-center", 20: "minimal",
  21: "centered", 22: "centered", 23: "centered", 24: "centered",
};

function layoutToComponentId(layout: TemplateLayout): ComponentId {
  if (layout === "centered" || layout === "top-center" || layout === "split" || layout === "minimal") return "classic";
  if (layout === "bottom-left") return "modern";
  if (layout === "corporate") return "modern";
  return "classic";
}

/** Full templates with bg URL, layout, formFields, customTexts */
export const TEMPLATES: (TemplateItem & { bg: string; componentId: ComponentId })[] = TEMPLATES_RAW.map((t) => {
  const layout = LAYOUT_BY_ID[t.id] ?? "centered";
  const formConfig = CATEGORY_FORM_CONFIG[t.category] ?? DEFAULT_FORM_CONFIG;
  return {
    ...t,
    layout,
    componentId: layoutToComponentId(layout),
    bg: templateBackgrounds[t.bgKey as keyof typeof templateBackgrounds] ?? "",
    formFields: formConfig.formFields,
    customTexts: formConfig.customTexts,
  };
});

export const CATEGORY_TABS = ["Tümü", "Düğün", "Nişan", "Baby Shower", "Parti", "Sünnet", "Doğum Günü", "Kına", "Mevlüt", "Toplantı", "Açılış"] as const;

export function getTemplateById(id: number | null | undefined): (TemplateItem & { bg: string; componentId: ComponentId }) | undefined {
  if (id == null || id < 1) return undefined;
  return TEMPLATES.find((t) => t.id === id);
}

/** Normalize templateId from legacy string (Firestore) to number */
export function normalizeTemplateId(value: number | string | null | undefined): number | null {
  if (value == null) return null;
  if (typeof value === "number" && value >= 1 && value <= 24) return value;
  if (typeof value === "string") {
    const map: Record<string, number> = { classic: 1, modern: 2, bohemian: 3 };
    return map[value] ?? 1;
  }
  return null;
}

const COMPONENT_GRADIENTS: Record<ComponentId, string> = {
  classic: "linear-gradient(135deg, #2c1810, #4a2c1a)",
  modern: "linear-gradient(135deg, #1a1a2e, #0f3460)",
  bohemian: "linear-gradient(135deg, #3d1a1a, #5c2d2d)",
};

/** Compute main title for template hero - uses unique fields */
export function getMainTitle(
  category: string,
  data: Record<string, string | undefined>
): string {
  const config = getCategoryConfig(category);
  return config.getMainTitle(data);
}

/** Get preview background (gradient or image URL) for template id - for dashboard cards */
export function getTemplatePreviewBg(templateId: number | string | null | undefined): string {
  const t = typeof templateId === "number" ? getTemplateById(templateId) : null;
  if (t) return COMPONENT_GRADIENTS[t.componentId] ?? COMPONENT_GRADIENTS.classic;
  if (typeof templateId === "string" && templateId in COMPONENT_GRADIENTS) {
    return COMPONENT_GRADIENTS[templateId as ComponentId];
  }
  return COMPONENT_GRADIENTS.classic;
}
