"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWizardStore } from "@/store/wizardStore";
import type { InvitationFormData } from "@/lib/types";
import { getTemplateById, getCategoryConfig } from "@/lib/templateData";

const formatDate = (dateStr: string, timeStr?: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}${timeStr ? ", " + timeStr : ""}`;
};
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import type { FontFamilyId, CountdownStyleId } from "@/lib/types";
import { auth, db, storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { MUSIC_TRACKS } from "@/lib/musicTracks";

export interface CustomizeStepProps {
  onBack: () => void;
  invitationId?: string;
}

// Map CustomizeStep UI values <-> InvitationFormData
const MEDIA_MAP = { "Tek Fotoğraf": "image" as const, "Fotoğraf Slaytı (3-7)": "slider" as const, Video: "video" as const };
const MEDIA_REV: Record<string, "Tek Fotoğraf" | "Fotoğraf Slaytı (3-7)" | "Video"> = {
  image: "Tek Fotoğraf",
  slider: "Fotoğraf Slaytı (3-7)",
  video: "Video",
};
const AUDIO_MAP = { "Arka Plan Müziği": "music" as const, "Sesli Mesaj": "voice" as const, "Müzik İstemiyorum": "none" as const };
const AUDIO_REV: Record<string, "Arka Plan Müziği" | "Sesli Mesaj" | "Müzik İstemiyorum"> = {
  music: "Arka Plan Müziği",
  voice: "Sesli Mesaj",
  none: "Müzik İstemiyorum",
};
const OVERLAY_MAP = { Açık: "light" as const, Orta: "medium" as const, Koyu: "dark" as const };
const OVERLAY_REV: Record<string, "Açık" | "Orta" | "Koyu"> = { light: "Açık", medium: "Orta", dark: "Koyu" };
const FONT_MAP: Record<string, string> = { Klasik: "cormorant", Modern: "inter", Romantik: "dancing", Zarif: "playfair" };
const FONT_REV: Record<string, string> = { cormorant: "Klasik", inter: "Modern", dancing: "Romantik", playfair: "Zarif" };
const CD_MAP = { Klasik: "classic" as const, Modern: "modern" as const, Minimal: "minimal" as const };
const CD_REV: Record<string, "Klasik" | "Modern" | "Minimal"> = { classic: "Klasik", modern: "Modern", minimal: "Minimal" };
const SHAPE_MAP = { Yuvarlak: "circle" as const, Yuvarlatılmış: "rounded" as const, Kare: "square" as const };
const SHAPE_REV: Record<string, "Yuvarlak" | "Yuvarlatılmış" | "Kare"> = { circle: "Yuvarlak", rounded: "Yuvarlatılmış", square: "Kare" };
const TRACK_MAP: Record<string, string> = { m1: "romantic-piano", m2: "classical-waltz", m3: "acoustic-guitar" };
const TRACK_REV: Record<string, string> = { "romantic-piano": "m1", "classical-waltz": "m2", "acoustic-guitar": "m3", orchestral: "m1", "jazz-lounge": "m1" };
const COLORS_HEX: Record<string, string> = { white: "#FFFFFF", cream: "#F5F0E8", gold: "#C9A84C", pink: "#E8A0A0", black: "#1A1A1A" };

function templateFontToOurFont(fontVar: string | undefined): string {
  if (!fontVar) return "Klasik";
  if (fontVar.includes("cormorant")) return "Klasik";
  if (fontVar.includes("playfair")) return "Zarif";
  if (fontVar.includes("dancing")) return "Romantik";
  if (fontVar.includes("inter")) return "Modern";
  return "Klasik";
}

type CustomizeState = {
  mediaType: "Tek Fotoğraf" | "Fotoğraf Slaytı (3-7)" | "Video";
  musicType: "Arka Plan Müziği" | "Sesli Mesaj" | "Müzik İstemiyorum";
  selectedTrack: string;
  overlay: "Açık" | "Orta" | "Koyu";
  uploadedPhoto: string | "removed" | null;
  slidePhotos: { id: string; url: string | null; isTemplate: boolean }[];
  showTitle: boolean;
  upperTitle: string;
  inviteNote: string;
  fontB: string;
  fontI: string;
  fontN: string;
  textColor: string;
  customColor: string;
  fs: { baslik: number; isimler: number; sayac: number; not: number };
  countdown: boolean;
  cdStyle: "Klasik" | "Modern" | "Minimal";
  family: boolean;
  familyNames: Record<string, string>;
  el: Record<string, boolean>;
  photoShape: string;
  rsvp: boolean;
  profilePhoto1: string | null;
  profilePhoto2: string | null;
};

function getInitialS(formData: InvitationFormData | undefined): CustomizeState {
  const fd = (formData ?? {}) as Partial<InvitationFormData>;
  const template = getTemplateById(fd.templateId ?? null);
  const category = template?.category ?? "Düğün";
  const categoryConfig = getCategoryConfig(category);
  const hex = fd.textColor ?? "#FFFFFF";
  const colorId = Object.entries(COLORS_HEX).find(([, h]) => h === hex)?.[0] ?? "white";
  const isCustom = !Object.values(COLORS_HEX).includes(hex);

  const el = {
    profilFoto: fd.showAvatar ?? false,
    davetiyeNotu: fd.showNote ?? true,
    tarih: fd.showDate ?? true,
    mekan: fd.showVenue ?? true,
    hatirlatici: fd.showReminderButton ?? true,
    kaydirma: fd.showScrollIndicator ?? true,
  };

  const fn = (fd.familyNames ?? {}) as Partial<NonNullable<InvitationFormData["familyNames"]>>;
  const familyNames = {
    gelinAnne: fn.brideMotherName ?? "",
    gelinBaba: fn.brideFatherName ?? "",
    damatAnne: fn.groomMotherName ?? "",
    damatBaba: fn.groomFatherName ?? "",
    gelinSoyadi: fn.brideFamilySurname ?? "",
    damatSoyadi: fn.groomFamilySurname ?? "",
  };

  const urls = fd.mediaUrls ?? [];
  const firstUrl = urls[0];
  const slidePhotos =
    fd.mediaType === "slider" && urls.length > 0
      ? urls.map((url: string, i: number) => ({ id: `slide-${i}`, url, isTemplate: false }))
      : [{ id: "template", url: null as string | null, isTemplate: true }];

  return {
    mediaType: MEDIA_REV[fd.mediaType ?? "image"] ?? "Tek Fotoğraf",
    musicType: AUDIO_REV[fd.audioType ?? "none"] ?? "Müzik İstemiyorum",
    selectedTrack: TRACK_REV[fd.musicTrack ?? "romantic-piano"] ?? "m1",
    overlay: OVERLAY_REV[fd.overlayStrength ?? template?.overlayStrength ?? "medium"] ?? "Orta",
    uploadedPhoto: fd.mediaType === "image" && firstUrl ? firstUrl : (null as string | "removed" | null),
    slidePhotos,
    showTitle: fd.showSubtitle ?? true,
    upperTitle: fd.subtitle ?? categoryConfig.defaultSubtitle ?? "Nikahımıza Davetlisiniz",
    inviteNote: fd.noteText ?? "Bu mutlu günümüzü sizinle paylaşmak istiyoruz",
    fontB: FONT_REV[fd.titleFontFamily ?? ""] ?? templateFontToOurFont(template?.font) ?? "Klasik",
    fontI: FONT_REV[fd.namesFontFamily ?? ""] ?? templateFontToOurFont(template?.font) ?? "Klasik",
    fontN: FONT_REV[fd.noteFontFamily ?? ""] ?? templateFontToOurFont(template?.font) ?? "Klasik",
    textColor: isCustom ? ("custom" as const) : (colorId as "white" | "cream" | "gold" | "pink" | "black"),
    customColor: hex,
    fs: {
      baslik: fd.titleFontSize ?? 12,
      isimler: fd.namesFontSize ?? 28,
      sayac: fd.countdownFontSize ?? 14,
      not: fd.noteFontSize ?? 10,
    },
    countdown: fd.showCountdown ?? true,
    cdStyle: CD_REV[fd.countdownStyle ?? "classic"] ?? "Klasik",
    family: fd.showFamilyNames ?? false,
    familyNames,
    el,
    photoShape: SHAPE_REV[fd.avatarShape ?? "circle"] ?? "Yuvarlak",
    rsvp: fd.rsvpEnabled ?? true,
    profilePhoto1: fd.avatarUrl1 ?? null,
    profilePhoto2: fd.avatarUrl2 ?? null,
  };
}

function toStoreUpdate(k: string, v: unknown, s: CustomizeState): Partial<InvitationFormData> {
  const upd: Partial<InvitationFormData> = {};
  switch (k) {
    case "mediaType":
      upd.mediaType = MEDIA_MAP[v as keyof typeof MEDIA_MAP];
      break;
    case "musicType":
      upd.audioType = AUDIO_MAP[v as keyof typeof AUDIO_MAP];
      break;
    case "selectedTrack":
      upd.musicTrack = (TRACK_MAP[v as string] ?? "romantic-piano") as "romantic-piano" | "classical-waltz" | "acoustic-guitar" | "orchestral" | "jazz-lounge";
      break;
    case "overlay":
      upd.overlayStrength = OVERLAY_MAP[v as keyof typeof OVERLAY_MAP];
      break;
    case "uploadedPhoto":
      if (v === "removed") upd.mediaUrls = [];
      else if (typeof v === "string") upd.mediaUrls = [v];
      break;
    case "slidePhotos": {
      const arr = v as { url: string | null }[];
      upd.mediaUrls = arr.filter((p) => p.url).map((p) => p.url!);
      break;
    }
    case "showTitle":
      upd.showSubtitle = v as boolean;
      break;
    case "upperTitle":
      upd.subtitle = v as string;
      break;
    case "inviteNote":
      upd.noteText = v as string;
      break;
    case "fontB":
      upd.titleFontFamily = FONT_MAP[v as string] as "cormorant" | "inter" | "dancing" | "playfair";
      break;
    case "fontI":
      upd.namesFontFamily = FONT_MAP[v as string] as "cormorant" | "inter" | "dancing" | "playfair";
      break;
    case "fontN":
      upd.noteFontFamily = FONT_MAP[v as string] as "cormorant" | "inter" | "dancing" | "playfair";
      break;
    case "textColor":
      if (v === "custom") upd.textColor = s.customColor;
      else upd.textColor = COLORS_HEX[v as string] ?? s.customColor;
      break;
    case "customColor":
      upd.textColor = v as string;
      upd.customColor = v as string;
      break;
    case "fs": {
      const fs = v as { baslik?: number; isimler?: number; sayac?: number; not?: number };
      if (fs.baslik != null) upd.titleFontSize = fs.baslik;
      if (fs.isimler != null) upd.namesFontSize = fs.isimler;
      if (fs.sayac != null) upd.countdownFontSize = fs.sayac;
      if (fs.not != null) upd.noteFontSize = fs.not;
      break;
    }
    case "countdown":
      upd.showCountdown = v as boolean;
      break;
    case "cdStyle":
      upd.countdownStyle = CD_MAP[v as keyof typeof CD_MAP];
      break;
    case "family":
      upd.showFamilyNames = v as boolean;
      break;
    case "familyNames": {
      const fn = v as Record<string, string>;
      upd.familyNames = {
        brideMotherName: fn.gelinAnne ?? "",
        brideFatherName: fn.gelinBaba ?? "",
        groomMotherName: fn.damatAnne ?? "",
        groomFatherName: fn.damatBaba ?? "",
        brideFamilySurname: fn.gelinSoyadi ?? "",
        groomFamilySurname: fn.damatSoyadi ?? "",
      };
      break;
    }
    case "el": {
      const el = v as Record<string, boolean>;
      upd.showAvatar = el.profilFoto;
      upd.showNote = el.davetiyeNotu;
      upd.showDate = el.tarih;
      upd.showVenue = el.mekan;
      upd.showReminderButton = el.hatirlatici;
      upd.showScrollIndicator = el.kaydirma;
      break;
    }
    case "photoShape":
      upd.avatarShape = SHAPE_MAP[v as keyof typeof SHAPE_MAP];
      break;
    case "profilePhoto1":
      upd.avatarUrl1 = (v as string | null) ?? undefined;
      break;
    case "profilePhoto2":
      upd.avatarUrl2 = (v as string | null) ?? undefined;
      break;
    case "rsvp":
      upd.rsvpEnabled = v as boolean;
      break;
    default:
      break;
  }
  return upd;
}

const TABS = [
  { id: "gorsel", emoji: "🖼️", label: "Görsel & Ses" },
  { id: "metin", emoji: "✏️", label: "Metinler" },
  { id: "tasarim", emoji: "🎨", label: "Tasarım" },
  { id: "elementler", emoji: "🎛️", label: "Elementler" },
];

const TRACKS = [
  { id: "m1", title: "Romantic Waltz", dur: "2:34", emoji: "🎻" },
  { id: "m2", title: "Soft Piano", dur: "3:12", emoji: "🎹" },
  { id: "m3", title: "Spring Breeze", dur: "2:58", emoji: "🌸" },
];

const COLORS = [
  { id: "white", hex: "#FFFFFF" },
  { id: "cream", hex: "#F5F0E8" },
  { id: "gold", hex: "#C9A84C" },
  { id: "pink", hex: "#E8A0A0" },
  { id: "black", hex: "#1A1A1A" },
];

function Toggle({
  label,
  sublabel,
  checked,
  onChange,
}: {
  label: string;
  sublabel?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <span className="text-sm text-stone-700">{label}</span>
        {sublabel && <p className="text-xs text-stone-400 mt-0.5">{sublabel}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-stone-900" : "bg-stone-200"}`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function Chips({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            value === opt
              ? "bg-stone-900 text-white border-stone-900"
              : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function FL({ children }: { children: React.ReactNode }) {
  return <div className="text-sm font-semibold text-stone-400 uppercase tracking-widest mb-2">{children}</div>;
}

function HR() {
  return <div className="border-t border-stone-100 my-5" />;
}

function SL({
  label,
  value,
  onChange,
  min = 8,
  max = 72,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-stone-500 w-24 shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1"
      />
      <span className="text-xs font-semibold text-stone-700 w-8 text-right tabular-nums">{value}px</span>
    </div>
  );
}

function UpRow({
  label,
  hint,
  accept,
  onChange,
}: {
  label: string;
  hint: string;
  accept: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const id = `up-${label.replace(/\s/g, "-")}`;
  return (
    <label className="flex items-center gap-3 p-3 border border-dashed border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50/50 transition-colors">
      <div className="w-9 h-9 bg-stone-100 rounded-xl flex items-center justify-center shrink-0">
        <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-700">{label}</p>
        <p className="text-xs text-stone-400">{hint}</p>
      </div>
      <input
        id={id}
        type="file"
        accept={accept}
        onChange={onChange}
        className="hidden"
      />
    </label>
  );
}

const inputClass =
  "border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition-all w-full";

export function CustomizeStep({ onBack, invitationId: invitationIdProp }: CustomizeStepProps) {
  const router = useRouter();
  const { formData, updateFormData, invitationId: storeInvitationId, setInvitationId } = useWizardStore();
  const invitationId = storeInvitationId ?? invitationIdProp;
  const [tab, setTab] = useState("gorsel");
  const [s, setS] = useState(() => getInitialS(formData));
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [publishing, setPublishing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payerName, setPayerName] = useState("");
  const [payerEmail, setPayerEmail] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState("");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const saveIdleRef = useRef<ReturnType<typeof setTimeout>>();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handlePlay = (trackId: string, trackUrl: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (playingId === trackId) {
      setPlayingId(null);
      return;
    }
    const audio = new Audio(trackUrl);
    audio.play();
    audioRef.current = audio;
    setPlayingId(trackId);
    audio.onended = () => setPlayingId(null);
  };

  const template = getTemplateById(formData.templateId);
  const category = template?.category ?? "Düğün";
  const categoryConfig = getCategoryConfig(category);

  const flushSaveIndicator = () => {
    setSaveStatus("saving");
    clearTimeout(saveTimerRef.current);
    clearTimeout(saveIdleRef.current);
    saveTimerRef.current = setTimeout(() => {
      setSaveStatus("saved");
      saveIdleRef.current = setTimeout(() => setSaveStatus((cur) => (cur === "saved" ? "idle" : cur)), 2000);
    }, 800);
  };

  const setAndSave = (kOrUpdates: string | Record<string, unknown>, v?: unknown) => {
    const updates = typeof kOrUpdates === "string" ? { [kOrUpdates]: v } : kOrUpdates;
    const nextS = { ...s, ...updates };
    setS(() => nextS);
    const allUpd: Partial<InvitationFormData> = {};
    for (const [key, val] of Object.entries(updates)) {
      Object.assign(allUpd, toStoreUpdate(key, val, nextS));
    }
    if (Object.keys(allUpd).length > 0) updateFormData(allUpd);
    flushSaveIndicator();
  };
  const set = setAndSave;

  const slideCnt = s.slidePhotos.filter((p: { url: string | null; isTemplate: boolean }) => p.url || p.isTemplate).length;

  const handlePayment = () => {
    alert("Ödeme sistemi yakında aktif olacak!");
  };

  const handleTestPublish = async () => {
    setPublishing(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        router.push("/auth");
        return;
      }

      const randomStr = Math.random().toString(36).substring(2, 8);
      const defaultSlug = `davetiye-${randomStr}`;

      const dataToSave = Object.fromEntries(
        Object.entries({
          ...formData,
          userId: user.uid,
          payerName: payerName || "",
          payerEmail: payerEmail || "",
          slug: defaultSlug,
          status: "active",
          isPaid: true,
          publishedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }).filter(([, v]) => v !== undefined)
      );

      if (invitationId) {
        await updateDoc(doc(db, "invitations", invitationId), dataToSave);
      } else {
        const docRef = await addDoc(collection(db, "invitations"), {
          ...dataToSave,
          createdAt: serverTimestamp(),
        });
        setInvitationId(docRef.id);
      }

      setPublishedSlug(defaultSlug);
      setShowPaymentModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      alert("Hata: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setPublishing(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) set("uploadedPhoto", URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleSlideAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const current = s.slidePhotos.filter((p: { url: string | null; isTemplate: boolean }) => p.url || p.isTemplate);
    const toAdd = Array.from(files)
      .slice(0, 7 - current.length)
      .map((f, i) => ({
        id: `slide-${Date.now()}-${i}`,
        url: URL.createObjectURL(f),
        isTemplate: false,
      }));
    set(
      "slidePhotos",
      [...s.slidePhotos.filter((p: { isTemplate: boolean }) => !p.isTemplate), ...toAdd].slice(-7)
    );
    e.target.value = "";
  };

  const removeSlide = (id: string) => {
    const next = s.slidePhotos.filter((p: { id: string }) => p.id !== id);
    set("slidePhotos", next);
  };

  const handleProfile1Upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) set("profilePhoto1", URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleProfile2Upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) set("profilePhoto2", URL.createObjectURL(file));
    e.target.value = "";
  };

  const [audioUploading, setAudioUploading] = useState(false);
  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !auth.currentUser) return;
    setAudioUploading(true);
    try {
      const storageRef = ref(storage, `audio/${auth.currentUser.uid}/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      const url = await new Promise<string>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          () => {},
          reject,
          async () => resolve(await getDownloadURL(uploadTask.snapshot.ref))
        );
      });
      updateFormData({ audioUrl: url });
      flushSaveIndicator();
    } catch (err) {
      console.error("Audio upload failed:", err);
      alert("Ses yüklenemedi: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setAudioUploading(false);
    }
  };

  let activePanel: React.ReactNode = null;

  if (tab === "gorsel") {
    activePanel = (
      <>
        <FL>Görsel Türü</FL>
        <Chips
          options={["Tek Fotoğraf", "Fotoğraf Slaytı (3-7)", "Video"]}
          value={s.mediaType}
          onChange={(v) => set("mediaType", v as typeof s.mediaType)}
        />
        {s.mediaType === "Tek Fotoğraf" && (
          <div className="mt-4">
            {s.uploadedPhoto === "removed" ? (
              <UpRow
                label="Fotoğraf yükle"
                hint="PNG, JPG, WEBP — maks. 10 MB"
                accept="image/*"
                onChange={handlePhotoUpload}
              />
            ) : (
              <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl border border-stone-100">
                <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 relative">
                  {s.uploadedPhoto ? (
                    <img src={s.uploadedPhoto} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-rose-200 to-pink-400 flex items-end justify-center">
                      <span className="text-[9px] font-medium text-white/90 mb-0.5">Şablon</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-stone-700">
                    {s.uploadedPhoto ? "Yüklenen fotoğraf" : "Şablon fotoğrafı"}
                  </p>
                  <p className="text-sm text-stone-500">× ile kaldırıp yenisini yükleyebilirsiniz</p>
                  <label className="inline-block mt-1 text-sm text-stone-600 underline cursor-pointer">
                    Yeni seç
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => set("uploadedPhoto", "removed")}
                  className="w-7 h-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0 hover:bg-red-100"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        )}
        {s.mediaType === "Fotoğraf Slaytı (3-7)" && (
          <div className="mt-4">
            <div className="mb-3">
              <span
                className={`inline-block text-sm font-medium px-4 py-3 rounded ${
                  slideCnt < 3
                    ? "bg-amber-50 text-amber-600"
                    : slideCnt >= 7
                      ? "bg-stone-100 text-stone-500"
                      : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {slideCnt < 3
                  ? `${3 - slideCnt} tane daha ekle · ${slideCnt}/7`
                  : slideCnt >= 7
                    ? "Maksimum"
                    : `✓ Hazır · ${slideCnt}/7`}
              </span>
            </div>
            <div className="flex flex-wrap gap-4">
              {s.slidePhotos.map((p: { id: string; url: string | null; isTemplate: boolean }, i: number) => (
                <div key={p.id} className="relative">
                  <div
                    className="w-11 h-11 rounded-lg overflow-hidden bg-cover bg-center"
                    style={{ backgroundImage: p.url ? `url(${p.url})` : undefined }}
                  >
                    {p.isTemplate && (
                      <div className="w-full h-full bg-gradient-to-br from-rose-200 to-pink-400 flex items-end justify-center">
                        <span className="text-[9px] font-medium text-white/90 mb-0.5">Şablon</span>
                      </div>
                    )}
                    {!p.isTemplate && (
                      <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded bg-black/60 text-white text-[9px] flex items-center justify-center">
                        {i + 1}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSlide(p.id)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-sm -mr-0.5"
                  >
                    ×
                  </button>
                </div>
              ))}
              {slideCnt < 7 && (
                <label className="w-11 h-11 rounded-lg border-2 border-dashed border-stone-300 flex items-center justify-center cursor-pointer hover:bg-stone-50 text-stone-400 text-xl">
                  +
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleSlideAdd} />
                </label>
              )}
            </div>
            {slideCnt < 3 && (
              <p className="text-sm text-amber-600 mt-2">⚠ Slayt için en az 3 fotoğraf gereklidir</p>
            )}
          </div>
        )}
        {s.mediaType === "Video" && (
          <div className="mt-4">
            <UpRow label="Video yükle" hint="MP4, MOV — maks. 50 MB" accept="video/*" />
          </div>
        )}
        <HR />
        <FL>Overlay Yoğunluğu</FL>
        <Chips options={["Açık", "Orta", "Koyu"]} value={s.overlay} onChange={(v) => set("overlay", v as typeof s.overlay)} />
        <HR />
        <FL>Ses</FL>
        <Chips
          options={["Arka Plan Müziği", "Sesli Mesaj", "Müzik İstemiyorum"]}
          value={s.musicType}
          onChange={(v) => set("musicType", v as typeof s.musicType)}
        />
        {s.musicType === "Arka Plan Müziği" && (
          <div className="mt-3 flex flex-col gap-2">
            {TRACKS.map((t) => {
              const trackId = TRACK_MAP[t.id] ?? "romantic-piano";
              const trackUrl = MUSIC_TRACKS[trackId] ?? MUSIC_TRACKS["romantic-piano"];
              const isSelected = s.selectedTrack === t.id;
              return (
                <div
                  key={t.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => set("selectedTrack", t.id)}
                  onKeyDown={(e) => e.key === "Enter" && set("selectedTrack", t.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all cursor-pointer ${
                    isSelected ? "bg-stone-900 text-white" : "bg-white border border-stone-200 text-stone-700 hover:border-stone-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (trackUrl) handlePlay(t.id, trackUrl);
                    }}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 ${
                      isSelected ? "bg-white/20 hover:bg-white/30" : "bg-stone-100 hover:bg-stone-200"
                    }`}
                    aria-label={playingId === t.id ? "Durdur" : "Oynat"}
                  >
                    {playingId === t.id ? "⏸" : "▶"}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-base font-medium ${isSelected ? "text-white" : "text-stone-700"}`}>{t.title}</p>
                    <p className={`text-sm ${isSelected ? "text-white/80" : "text-stone-500"}`}>{t.dur}</p>
                  </div>
                  {isSelected && (
                    <div className="flex gap-0.5 items-end h-4">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className="w-1 bg-white/80 rounded-full"
                          style={{
                            height: "3px",
                            animation: "wv 0.7s ease-in-out infinite",
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {s.musicType === "Sesli Mesaj" && (
          <div className="mt-3">
            <UpRow
              label="Ses dosyası yükle"
              hint="MP3, WAV, M4A — maks. 10 MB"
              accept="audio/*"
              onChange={handleAudioUpload}
            />
            {audioUploading && <p className="text-sm text-stone-500 mt-2">Yükleniyor...</p>}
            {formData.audioUrl && !audioUploading && (
              <p className="text-sm text-emerald-600 mt-2">Ses yüklendi ✓</p>
            )}
          </div>
        )}
      </>
    );
  }

  if (tab === "metin") {
    const categoryConfig = getCategoryConfig(template?.category ?? "Düğün");
    activePanel = (
      <>
        <div className="rounded-2xl border border-stone-100 bg-stone-50/40 p-4">
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: "#666", display: "block", marginBottom: 4 }}>
              Ana Başlık
            </label>
            <input
              value={formData.mainTitle ?? categoryConfig?.getMainTitle(formData as unknown as Record<string, string | undefined>) ?? ""}
              onChange={(e) => updateFormData({ mainTitle: e.target.value })}
              className={inputClass}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd", fontSize: 14 }}
            />
          </div>
        </div>
        <div className="rounded-2xl border border-stone-100 bg-stone-50/40 p-4 mt-3">
          <Toggle label="Üst başlığı göster" checked={s.showTitle} onChange={(v) => set("showTitle", v)} />
          {s.showTitle && (
            <input
              type="text"
              value={s.upperTitle}
              onChange={(e) => set("upperTitle", e.target.value)}
              className={`${inputClass} mt-3`}
            />
          )}
        </div>

        <div className="rounded-2xl border border-stone-100 bg-stone-50/40 p-4 mt-3">
          <FL>Davetiye Notu</FL>
          <textarea
            value={s.inviteNote}
            onChange={(e) => set("inviteNote", e.target.value)}
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="rounded-2xl border border-stone-100 bg-stone-50/40 p-4 mt-3">
          <Toggle label="Geri sayımı göster" checked={s.countdown} onChange={(v) => set("countdown", v)} />
          {s.countdown && (
            <div className="mt-3 pt-3 border-t border-stone-100">
              <FL>Geri sayım stili</FL>
              <Chips
                options={["Klasik", "Modern", "Minimal"]}
                value={s.cdStyle}
                onChange={(v) => set("cdStyle", v as typeof s.cdStyle)}
              />
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-stone-100 bg-stone-50/40 p-4 mt-3">
          <Toggle label="Aile isimlerini göster" checked={s.family} onChange={(v) => set("family", v)} />
          {s.family && (
            <div className="mt-3 pt-3 border-t border-stone-100">
              <div className="grid grid-cols-2 gap-4.5">
                {[
                  { k: "gelinAnne", p: "Gelin Ailesi - Anne" },
                  { k: "gelinBaba", p: "Gelin Ailesi - Baba" },
                  { k: "damatAnne", p: "Damat Ailesi - Anne" },
                  { k: "damatBaba", p: "Damat Ailesi - Baba" },
                  { k: "gelinSoyadi", p: "Gelin Ailesi Soyadı" },
                  { k: "damatSoyadi", p: "Damat Ailesi Soyadı" },
                ].map(({ k, p }) => (
                  <input
                    key={k}
                    type="text"
                    placeholder={p}
                    value={s.familyNames[k as keyof typeof s.familyNames]}
                    onChange={(e) =>
                      set("familyNames", { ...s.familyNames, [k]: e.target.value })
                    }
                    className={inputClass}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  if (tab === "tasarim") {
    activePanel = (
      <>
        <FL>Yazı Tipleri</FL>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-stone-500 mb-1">Başlık</p>
            <Chips options={["Klasik", "Modern", "Romantik", "Zarif"]} value={s.fontB} onChange={(v) => set("fontB", v)} />
          </div>
          <div>
            <p className="text-sm text-stone-500 mb-1">İsimler</p>
            <Chips options={["Klasik", "Modern", "Romantik", "Zarif"]} value={s.fontI} onChange={(v) => set("fontI", v)} />
          </div>
          <div>
            <p className="text-sm text-stone-500 mb-1">Davetiye Notu</p>
            <Chips options={["Klasik", "Modern", "Romantik", "Zarif"]} value={s.fontN} onChange={(v) => set("fontN", v)} />
          </div>
        </div>
        <HR />
        <FL>Metin Rengi</FL>
        <div className="flex flex-wrap gap-4 items-center">
          {COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => set("textColor", c.id)}
              className="w-8 h-8 rounded-full shrink-0 transition-all"
              style={{
                backgroundColor: c.hex,
                boxShadow: s.textColor === c.id ? "0 0 0 2px white, 0 0 0 4px #1c1917" : undefined,
                transform: s.textColor === c.id ? "scale(1.15)" : undefined,
              }}
            />
          ))}
          <label className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-stone-200 cursor-pointer shrink-0 flex items-center justify-center text-stone-400 hover:border-stone-400">
            <span>+</span>
            <input
              type="color"
              value={s.customColor}
              onChange={(e) => set({ customColor: e.target.value, textColor: "custom" })}
              className="absolute w-0 h-0 opacity-0"
            />
          </label>
        </div>
        <HR />
        <FL>Font Boyutları</FL>
        <div className="space-y-3">
          <SL label="Başlık" value={s.fs.baslik} onChange={(v) => set("fs", { ...s.fs, baslik: v })} min={8} max={20} />
          <SL label="İsimler" value={s.fs.isimler} onChange={(v) => set("fs", { ...s.fs, isimler: v })} min={16} max={48} />
          <SL label="Geri Sayım" value={s.fs.sayac} onChange={(v) => set("fs", { ...s.fs, sayac: v })} min={10} max={22} />
          <SL label="Davetiye Notu" value={s.fs.not} onChange={(v) => set("fs", { ...s.fs, not: v })} min={8} max={16} />
        </div>
      </>
    );
  }

  if (tab === "elementler") {
    activePanel = (
      <>
        <FL>Görünür Elementler</FL>
        <div className="space-y-3">
          <Toggle label="💬  Davetiye Notu" checked={s.el.davetiyeNotu} onChange={(v) => set("el", { ...s.el, davetiyeNotu: v })} />
          <Toggle label="📅  Tarih" checked={s.el.tarih} onChange={(v) => set("el", { ...s.el, tarih: v })} />
          <Toggle label="📍  Mekan Bilgisi" checked={s.el.mekan} onChange={(v) => set("el", { ...s.el, mekan: v })} />
          <Toggle label="🔔  Hatırlatıcı Butonu" checked={s.el.hatirlatici} onChange={(v) => set("el", { ...s.el, hatirlatici: v })} />
          <Toggle label="⬇️  Kaydırma İkonu" checked={s.el.kaydirma} onChange={(v) => set("el", { ...s.el, kaydirma: v })} />
        </div>
        <div className={`rounded-2xl border transition-all mt-3 ${s.el.profilFoto ? "border-stone-200 bg-stone-50/40" : "border-transparent"}`}>
          <div className="px-4 pt-3 pb-3">
            <Toggle
              label="👤  Profil Fotoğrafı"
              checked={s.el.profilFoto}
              onChange={(v) => set("el", { ...s.el, profilFoto: v })}
            />
          </div>
          {s.el.profilFoto && (
            <div className="px-4 pb-4 pt-1 border-t border-stone-100 space-y-3">
              {s.profilePhoto1 ? (
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-stone-100">
                  <img src={s.profilePhoto1} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium text-stone-700">1. Görsel</p>
                    <label className="text-sm text-stone-500 underline cursor-pointer">
                      Değiştir
                      <input type="file" accept="image/*" className="hidden" onChange={handleProfile1Upload} />
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => set("profilePhoto1", null)}
                    className="w-7 h-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <UpRow label="1. Görsel" hint="PNG, JPG" accept="image/*" onChange={handleProfile1Upload} />
              )}
              {s.profilePhoto2 ? (
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-stone-100">
                  <img src={s.profilePhoto2} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium text-stone-700">2. Görsel</p>
                    <label className="text-sm text-stone-500 underline cursor-pointer">
                      Değiştir
                      <input type="file" accept="image/*" className="hidden" onChange={handleProfile2Upload} />
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => set("profilePhoto2", null)}
                    className="w-7 h-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <UpRow label="2. Görsel" hint="PNG, JPG" accept="image/*" onChange={handleProfile2Upload} />
              )}
              <div className="pt-1">
                <FL>Fotoğraf Şekli</FL>
                <Chips
                  options={["Yuvarlak", "Yuvarlatılmış", "Kare"]}
                  value={s.photoShape}
                  onChange={(v) => set("photoShape", v)}
                />
              </div>
            </div>
          )}
        </div>
        <HR />
        <div className="rounded-2xl border border-stone-100 overflow-hidden">
          <div className="bg-stone-50 px-4 py-3.5 flex items-center justify-between">
            <span className="text-sm font-semibold text-stone-500 uppercase tracking-widest">Davetiye Özeti</span>
            <span className="text-sm text-stone-400">Kontrol et</span>
          </div>
          <div className="p-4 space-y-0 text-sm">
            {[
              ["Şablon", template?.name ?? "-"],
              ["İsimler", categoryConfig?.getMainTitle(formData as unknown as Record<string, string | undefined>) ?? "-"],
              ["Tarih", formatDate(formData?.eventDate ?? "", formData?.eventTime)],
              ["Mekan", formData?.venueName ?? "-"],
              ["Medya", MEDIA_REV[formData?.mediaType ?? ""] ?? formData?.mediaType ?? "Tek Fotoğraf"],
              ["Ses", AUDIO_REV[formData?.audioType ?? ""] ?? formData?.audioType ?? "Müzik İstemiyorum"],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #f5f5f5",
                }}
              >
                <span style={{ fontSize: 13, color: "#888" }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#111" }}>{value}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-stone-100 px-4 py-3 bg-amber-50/40">
            <Toggle
              label="RSVP Formu Aktif"
              sublabel="Davetliler katılım bildirimi yapabilir"
              checked={s.rsvp}
              onChange={(v) => set("rsvp", v)}
            />
          </div>
        </div>
      </>
    );
  }

  const mediaUrls =
    s.mediaType === "Tek Fotoğraf" && s.uploadedPhoto && s.uploadedPhoto !== "removed"
      ? [s.uploadedPhoto]
      : s.mediaType === "Fotoğraf Slaytı (3-7)"
        ? s.slidePhotos.filter((p) => p.url).map((p) => p.url!)
        : formData?.mediaUrls;

  const textColorHex =
    s.textColor === "custom" ? s.customColor : COLORS.find((c) => c.id === s.textColor)?.hex ?? "#FFFFFF";

  const familyNamesMapped = {
    brideMotherName: s.familyNames.gelinAnne ?? "",
    brideFatherName: s.familyNames.gelinBaba ?? "",
    groomMotherName: s.familyNames.damatAnne ?? "",
    groomFatherName: s.familyNames.damatBaba ?? "",
    brideFamilySurname: s.familyNames.gelinSoyadi ?? "",
    groomFamilySurname: s.familyNames.damatSoyadi ?? "",
  };

  // formData BASE — kullanıcı verisi (Bilgiler adımından); s sadece görsel override
  const previewProps = {
    templateId: formData?.templateId ?? null,
    mainTitle: formData?.mainTitle,
    wedding_brideName: formData?.wedding_brideName,
    wedding_groomName: formData?.wedding_groomName,
    kina_brideName: formData?.kina_brideName,
    babyshower_motherName: formData?.babyshower_motherName,
    cinsiyet_parentNames: formData?.cinsiyet_parentNames,
    sunnet_childName: formData?.sunnet_childName,
    sunnet_parentNames: formData?.sunnet_parentNames,
    dogum_childName: formData?.dogum_childName,
    dogum_age: formData?.dogum_age,
    mevlut_hostName: formData?.mevlut_hostName,
    mevlut_reason: formData?.mevlut_reason,
    toplanti_eventTitle: formData?.toplanti_eventTitle,
    toplanti_organizationName: formData?.toplanti_organizationName,
    acilis_firmaAdi: formData?.acilis_firmaAdi,
    eventDate: formData?.eventDate,
    eventTime: formData?.eventTime,
    venueName: formData?.venueName,
    venueAddress: formData?.venueAddress,
    googleMapsUrl: formData?.googleMapsUrl,
    rsvpEnabled: s.rsvp,
    mediaUrls: mediaUrls ?? undefined,
    mediaType: MEDIA_MAP[s.mediaType],
    backgroundType: formData?.backgroundType,
    presetBackground: formData?.presetBackground,
    fontFamily: (FONT_MAP[s.fontB] ?? "cormorant") as FontFamilyId,
    textColor: textColorHex,
    countdownStyle: (CD_MAP[s.cdStyle] ?? "classic") as CountdownStyleId,
    titleFontSize: s.fs.baslik,
    namesFontSize: s.fs.isimler,
    noteFontSize: s.fs.not,
    countdownFontSize: s.fs.sayac,
    titleFontFamily: (FONT_MAP[s.fontB] ?? "cormorant") as FontFamilyId,
    namesFontFamily: (FONT_MAP[s.fontI] ?? "cormorant") as FontFamilyId,
    noteFontFamily: (FONT_MAP[s.fontN] ?? "cormorant") as FontFamilyId,
    subtitle: s.upperTitle || formData?.subtitle,
    noteText: s.inviteNote || formData?.noteText,
    showSubtitle: s.showTitle,
    showDate: s.el.tarih,
    showFamilyNames: s.family,
    familyNames: familyNamesMapped,
    showAvatar: s.el.profilFoto,
    avatarUrl1: s.profilePhoto1 ?? undefined,
    avatarUrl2: s.profilePhoto2 ?? undefined,
    avatarShape: (SHAPE_MAP[s.photoShape as keyof typeof SHAPE_MAP] ?? "circle") as "circle" | "square" | "rounded",
    showCountdown: s.countdown,
    showNote: s.el.davetiyeNotu,
    showVenue: s.el.mekan,
    showReminderButton: s.el.hatirlatici,
    showScrollIndicator: s.el.kaydirma,
    overlayStrength: (OVERLAY_MAP[s.overlay] ?? "medium") as "light" | "medium" | "dark",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500;600&family=Dancing+Script:wght@600&family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap');
        * { font-family: 'Jost', sans-serif; }
        .serif { font-family: 'Playfair Display', serif; }
        .phone-inner::-webkit-scrollbar { display: none; }
        .phone-scroll::-webkit-scrollbar { display: none; }
        .phone-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .scroll-area::-webkit-scrollbar { width: 3px; }
        .scroll-area::-webkit-scrollbar-thumb { background: #d6d3d1; border-radius: 2px; }
        input[type=range] { -webkit-appearance: none; height: 2px; background: #e7e5e4; border-radius: 1px; outline: none; cursor: pointer; width: 100%; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 13px; height: 13px; border-radius: 50%; background: #1c1917; cursor: pointer; }
        @keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(3px)} }
        @keyframes wv { 0%,100%{height:3px} 50%{height:12px} }
        .bob { animation: bob 1.6s ease-in-out infinite; }
        .wv { animation: wv 0.7s ease-in-out infinite; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(2px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}</style>
      <div className="flex overflow-hidden bg-[#F3F0EA]" style={{ height: "calc(100vh - var(--wizard-header-h, 113px))" }}>
        {/* Sol: Card preview — no phone frame */}
        <div className="w-[50%] shrink-0 overflow-hidden" style={{ height: "100%" }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              paddingTop: "20px",
            }}
          >
            {/* Preview label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
                fontSize: 12,
                color: "#888",
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#22c55e",
                }}
              />
              Canlı Önizleme
            </div>

            {/* Card preview - no phone frame */}
            <div
              className="phone-scroll"
              style={{
                width: "320px",
                height: "calc(100vh - 180px)",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                position: "relative",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <div style={{ width: "390px", zoom: 0.82 }}>
                <TemplateRenderer {...previewProps} />
              </div>
            </div>

            {/* Scroll hint */}
            <p style={{ fontSize: 11, color: "#aaa", marginTop: 12 }}>
              ↕ Kaydırarak tüm davetiyeyi gör
            </p>
          </div>
        </div>

        {/* Sağ panel — flex-col + overflow-hidden + min-h-0 zinciri */}
        <div className="flex-1 flex flex-col min-h-0 bg-white overflow-hidden shadow-[-24px_0_48px_-12px_rgba(0,0,0,0.07)]">
          <div className="shrink-0 px-8 pt-7 pb-5">
            <div className="flex items-center gap-4 mb-1">
              <span className="text-sm font-semibold text-stone-400 uppercase tracking-widest">Adım 3/4</span>
              <div className="w-px h-3 bg-stone-200" />
              <span className="text-sm text-stone-400">Özelleştir</span>
            </div>
            <h2 className="text-xl font-semibold text-stone-900 tracking-tight">Davetiyeni kişiselleştir</h2>
          </div>

          <div className="shrink-0 px-8 border-b border-stone-100">
            <div className="flex">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-all whitespace-nowrap ${
                    tab === t.id
                      ? "border-stone-900 text-stone-900"
                      : "border-transparent text-stone-400 hover:text-stone-600"
                  }`}
                >
                  <span className="text-sm">{t.emoji}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto scroll-area px-8 py-6">
            {activePanel}
            <div className="h-4" />
          </div>

          <div className="shrink-0 px-8 py-5 border-t border-stone-100 bg-white">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 rounded-2xl border border-stone-200 text-stone-500 text-sm font-medium hover:bg-stone-50 hover:border-stone-300 hover:text-stone-700 transition-all whitespace-nowrap"
              >
                ← Geri
              </button>
              <button
                type="button"
                onClick={() => setShowPaymentModal(true)}
                disabled={publishing}
                className="flex-1 py-3 rounded-2xl bg-stone-900 text-white text-sm font-semibold hover:bg-stone-800 active:scale-[0.99] transition-all shadow-lg shadow-stone-900/10 tracking-wide disabled:opacity-70"
              >
                Davetiyemi Yayınla · 499₺ →
              </button>
            </div>
            <div className="flex items-center justify-center gap-3.5 mt-2.5 h-4">
              {saveStatus === "saving" && (
                <span className="text-sm text-stone-400 flex items-center gap-3">
                  <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeWidth={2} strokeLinecap="round" />
                  </svg>
                  Kaydediliyor...
                </span>
              )}
              {saveStatus === "saved" && (
                <span className="text-sm text-emerald-600 flex items-center gap-3 animate-fade-in">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 13l4 4L19 7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Kaydedildi
                </span>
              )}
              {saveStatus === "idle" && (
                <span className="text-sm text-stone-400">Yayınladıktan sonra da değişiklik yapabilirsiniz</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment modal */}
      {showPaymentModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 24,
              padding: 32,
              maxWidth: 420,
              width: "100%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>💌</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
                Davetiyeniz Hazır!
              </h2>
              <p style={{ fontSize: 14, color: "#888" }}>
                Yayınlamak için tek adım kaldı
              </p>
            </div>

            <div
              style={{
                background: "#f9f9f9",
                borderRadius: 16,
                padding: 20,
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: -2 }}>
                499₺
              </div>
              <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>
                tek seferlik • KDV dahil • 1 yıl aktif
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px 16px",
                marginBottom: 24,
              }}
            >
              {[
                "✓ Sınırsız misafir",
                "✓ RSVP takibi",
                "✓ WhatsApp paylaşım",
                "✓ Arka plan müziği",
                "✓ Geri sayım",
                "✓ Harita entegrasyonu",
                "✓ İstatistikler",
                "✓ 7/24 destek",
              ].map((f) => (
                <div key={f} style={{ fontSize: 12, color: "#555" }}>
                  {f}
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 12 }}>
              <input
                placeholder="Ad Soyad"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  fontSize: 14,
                  marginBottom: 8,
                  boxSizing: "border-box",
                }}
              />
              <input
                placeholder="E-posta adresi"
                type="email"
                value={payerEmail}
                onChange={(e) => setPayerEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  fontSize: 14,
                  boxSizing: "border-box",
                }}
              />
            </div>

            <button
              type="button"
              onClick={handlePayment}
              disabled={publishing}
              style={{
                width: "100%",
                padding: 16,
                borderRadius: 12,
                background: "#111",
                color: "white",
                fontSize: 15,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                marginBottom: 10,
                opacity: publishing ? 0.7 : 1,
              }}
            >
              {publishing ? "⏳ İşleniyor..." : "Ödemeye Geç →"}
            </button>

            <button
              type="button"
              onClick={handleTestPublish}
              disabled={publishing}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 12,
                background: "white",
                border: "1px solid #ddd",
                fontSize: 13,
                color: "#666",
                cursor: "pointer",
                marginBottom: 12,
              }}
            >
              🧪 Test: Ücretsiz Yayınla
            </button>

            <button
              type="button"
              onClick={() => setShowPaymentModal(false)}
              style={{
                width: "100%",
                padding: 10,
                background: "none",
                border: "none",
                fontSize: 13,
                color: "#aaa",
                cursor: "pointer",
              }}
            >
              Vazgeç
            </button>
          </div>
        </div>
      )}

      {/* Success modal */}
      {showSuccessModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 24,
              padding: 32,
              maxWidth: 440,
              width: "100%",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
              Davetiyeniz Yayında!
            </h2>
            <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>
              Davetiyeniz başarıyla yayınlandı
            </p>

            <div
              style={{
                background: "#f5f5f5",
                borderRadius: 12,
                padding: "12px 16px",
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <span
                style={{ fontSize: 13, color: "#333", fontWeight: 500 }}
                className="truncate"
              >
                digitaldavetiyem.com/{publishedSlug}
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://digitaldavetiyem.com/${publishedSlug}`
                  );
                  alert("Link kopyalandı!");
                }}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  background: "#111",
                  color: "white",
                  border: "none",
                  fontSize: 12,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                📋 Kopyala
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                window.open(
                  `https://wa.me/?text=Davetiyemize davetlisiniz! 💌 https://digitaldavetiyem.com/${publishedSlug}`
                )
              }
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 12,
                background: "#25D366",
                color: "white",
                border: "none",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                marginBottom: 10,
              }}
            >
              💬 WhatsApp&apos;ta Paylaş
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/payment?id=${invitationId ?? ""}&customize=true`
                )
              }
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 12,
                background: "white",
                border: "1px solid #ddd",
                fontSize: 13,
                color: "#555",
                cursor: "pointer",
                marginBottom: 10,
              }}
            >
              🔧 Linki Özelleştir (davetiye-xxx → ayse-mehmet)
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              style={{
                width: "100%",
                padding: 10,
                background: "none",
                border: "none",
                fontSize: 13,
                color: "#aaa",
                cursor: "pointer",
              }}
            >
              Panele Git →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
