/**
 * Converts a Firebase Storage gs:// URL to an HTTP download URL.
 * @example gs://bucket-name.appspot.com/path/to/file.png -> https://firebasestorage.googleapis.com/v0/b/bucket-name.appspot.com/o/path%2Fto%2Ffile.png?alt=media
 */
export function gsUrlToHttp(gsUrl: string): string | null {
  if (!gsUrl.startsWith("gs://")) return null;
  const rest = gsUrl.slice(5); // strip "gs://"
  const slashIdx = rest.indexOf("/");
  if (slashIdx === -1) return null;
  const bucket = rest.slice(0, slashIdx);
  const path = rest.slice(slashIdx + 1);
  const encodedPath = encodeURIComponent(path);
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedPath}?alt=media`;
}

const STORAGE_BASE =
  "https://firebasestorage.googleapis.com/v0/b/davetiye-app-a9bc8.firebasestorage.app/o/template-backgrounds%3A";
const SUFFIX = "?alt=media";

export const templateBackgrounds = {
  "baby-shower": `${STORAGE_BASE}baby-shower.png${SUFFIX}`,
  "bohem-dugun": `${STORAGE_BASE}bohem-dugun.png${SUFFIX}`,
  "cinsiyet-partisi": `${STORAGE_BASE}cinsiyet-partisi.png${SUFFIX}`,
  "dogum-gunu": `${STORAGE_BASE}dogum-gunu.png${SUFFIX}`,
  kina: `${STORAGE_BASE}kina.png${SUFFIX}`,
  "klasik-dugun": `${STORAGE_BASE}klasik-dugun.png${SUFFIX}`,
  mevlut: `${STORAGE_BASE}mevlut.png${SUFFIX}`,
  "modern-dugun": `${STORAGE_BASE}modern-dugun.png${SUFFIX}`,
  nisan: `${STORAGE_BASE}nisan.png${SUFFIX}`,
  sunnet: `${STORAGE_BASE}sunnet.png${SUFFIX}`,
  toplanti: `${STORAGE_BASE}toplanti.png${SUFFIX}`,
  /* -2 variants */
  "baby-shower-2": `${STORAGE_BASE}baby-shower-2.png${SUFFIX}`,
  "bohem-dugun-2": `${STORAGE_BASE}bohem-dugun-2.png${SUFFIX}`,
  "cinsiyet-partisi-2": `${STORAGE_BASE}cinsiyet-partisi-2.png${SUFFIX}`,
  "dogum-gunu-2": `${STORAGE_BASE}dogum-gunu-2.png${SUFFIX}`,
  "kina-2": `${STORAGE_BASE}kina-2.png${SUFFIX}`,
  "klasik-dugun-2": `${STORAGE_BASE}klasik-dugun-2.png${SUFFIX}`,
  "mevlut-2": `${STORAGE_BASE}mevlut-2.png${SUFFIX}`,
  "modern-dugun-2": `${STORAGE_BASE}modern-dugun-2.png${SUFFIX}`,
  "nisan-2": `${STORAGE_BASE}nisan-2.png${SUFFIX}`,
  "sunnet-2": `${STORAGE_BASE}sunnet-2.png${SUFFIX}`,
  "toplanti-2": `${STORAGE_BASE}toplanti-2.png${SUFFIX}`,
  "acilis-daveti": `${STORAGE_BASE}acilis-daveti.png${SUFFIX}`,
  "acilis-daveti-2": `${STORAGE_BASE}acilis-daveti-2.png${SUFFIX}`,
} as const;
