import type { FormFieldId } from "./templateData";

export interface FieldConfig {
  label: string;
  placeholder: string;
  type?: "text" | "date" | "time" | "number" | "url";
  asTextarea?: boolean;
  optional?: boolean;
}

export const FORM_FIELD_CONFIG: Record<FormFieldId, FieldConfig> = {
  brideName: { label: "Gelin Adı", placeholder: "Ayşe", type: "text" },
  groomName: { label: "Damat Adı", placeholder: "Mehmet", type: "text" },
  motherName: { label: "Anne Adı", placeholder: "Fatma", type: "text" },
  fatherName: { label: "Baba Adı", placeholder: "Ali", type: "text" },
  childName: { label: "Çocuğun Adı", placeholder: "Zeynep", type: "text" },
  age: { label: "Kaç Yaşına Giriyor?", placeholder: "5", type: "number" },
  parentNames: { label: "Anne & Baba Adları", placeholder: "Fatma & Ali", type: "text" },
  hostName: { label: "Ev Sahibi Adı", placeholder: "Ahmet Yılmaz", type: "text" },
  mevlutReason: {
    label: "Mevlüt Sebebi",
    placeholder: "Hayırlı olsun, şükran...",
    type: "text",
    optional: true,
  },
  eventTitle: { label: "Etkinlik Başlığı", placeholder: "Yıllık Strateji Toplantısı", type: "text" },
  organizationName: { label: "Kurum/Şirket Adı", placeholder: "ABC Şirketi", type: "text" },
  eventDate: { label: "Tarih", placeholder: "", type: "date" },
  eventTime: { label: "Saat", placeholder: "15:00", type: "time" },
  venueName: { label: "Mekan Adı", placeholder: "Grand Hotel", type: "text" },
  venueAddress: { label: "Adres", placeholder: "Beşiktaş, İstanbul", type: "text", asTextarea: true },
  googleMapsUrl: {
    label: "Google Maps Linki (opsiyonel)",
    placeholder: "https://maps.google.com/...",
    type: "url",
    optional: true,
  },
};
