import { format, toDate } from "date-fns";
import { tr } from "date-fns/locale";

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

const TURKISH_MAP: Record<string, string> = {
  ş: "s",
  Ş: "s",
  ı: "i",
  İ: "i",
  ğ: "g",
  Ğ: "g",
  ü: "u",
  Ü: "u",
  ö: "o",
  Ö: "o",
  ç: "c",
  Ç: "c",
};

/**
 * Normalize Turkish characters and return a URL-safe slug.
 * Format: "asli-mehmet"
 */
export function generateSlug(brideName: string, groomName: string): string {
  const normalize = (s: string) =>
    s
      .trim()
      .split("")
      .map((c) => TURKISH_MAP[c] ?? c)
      .join("")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  const bride = normalize(brideName);
  const groom = normalize(groomName);
  if (!bride && !groom) return "invitation";
  if (!bride) return groom;
  if (!groom) return bride;
  return `${bride}-${groom}`;
}

/**
 * Format date as Turkish long date with weekday.
 * Example: "15 Haziran 2026, Cumartesi"
 */
export function formatEventDate(dateString: string): string {
  if (!dateString) return "";
  const date = toDate(dateString);
  if (isNaN(date.getTime())) return "";
  return format(date, "d MMMM yyyy, EEEE", { locale: tr });
}

/**
 * Format date and time for invitation display.
 * Example: "15 Haziran 2026 · Cumartesi · 18:30"
 */
export function formatEventDateTime(
  dateString: string,
  timeString?: string
): string {
  if (!dateString) return "";
  const date = toDate(dateString);
  if (isNaN(date.getTime())) return "";
  const datePart = format(date, "d MMMM yyyy", { locale: tr });
  const weekdayPart = format(date, "EEEE", { locale: tr });
  const timePart = timeString?.trim() || format(date, "HH:mm", { locale: tr });
  return `${datePart} · ${weekdayPart} · ${timePart}`;
}

const MUSIC_TRACK_LABELS: Record<string, string> = {
  "romantic-piano": "Romantik Piyano",
  "classical-waltz": "Klasik Vals",
  "acoustic-guitar": "Akustik Gitar",
  orchestral: "Orkestra",
  "jazz-lounge": "Jazz Lounge",
};

/**
 * Map music track IDs to display names.
 */
export function getMusicTrackLabel(trackId: string): string {
  return MUSIC_TRACK_LABELS[trackId] ?? trackId;
}

/**
 * Generate an ICS file string for calendar download.
 */
export function generateIcsContent(
  brideName: string,
  groomName: string,
  eventDate: string,
  eventTime: string,
  venueName: string,
  venueAddress: string
): string {
  const start = new Date(eventDate);
  const [h = 0, m = 0] = (eventTime || "00:00").split(":").map(Number);
  start.setHours(h, m, 0, 0);
  const end = new Date(start);
  end.setHours(end.getHours() + 3);
  const formatDt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const title = `Nikah - ${brideName} & ${groomName}`;
  const location = [venueName, venueAddress].filter(Boolean).join(", ");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DigitalDavetiyem//TR",
    "BEGIN:VEVENT",
    `DTSTART:${formatDt(start)}`,
    `DTEND:${formatDt(end)}`,
    `SUMMARY:${title.replace(/,/g, "\\,")}`,
    location ? `LOCATION:${location.replace(/,/g, "\\,")}` : null,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}
